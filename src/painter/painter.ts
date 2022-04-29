import {
    PainterConfigInterface,
    PainterImageInterface,
    PainterInterface,
    PainterPointInterface,
    PointType
} from './painter.interface';
import Konva from 'konva';
import { TextService } from './services/text.service';
import { LinkService } from './services/link.service';
import { BestPracticeService } from './services/best-practice.service';
import { RiskService } from './services/risk.service';
import { PointService } from './services/base.service';
import { ComingSoonService } from './services/coming-soon.service';
import { DropdownService } from './services/dropdown.service';

export class Painter implements PainterInterface {
    config: PainterConfigInterface;
    containerId: string;
    standardWidth: number;

    servicesMap = new Map<number, PointService>();

    stage: Konva.Stage;
    imageLayer: Konva.Layer;
    // levelMapper: Map<string, Konva.Group>;
    pointLayer: Konva.Layer;
    // pointMapper: Map<string, Konva.Group>;
    visibleImageIds: string[];
    maxScaleValue = 100;
    boundary = {
        minX: -Infinity,
        maxX: Infinity,
        minY: -Infinity,
        maxY: Infinity,
    };

    constructor(config: PainterConfigInterface) {
        if (!config || !config.containerId) {
            throw new Error('Must provide the container Id');
        }
        this.config = config;
        this.containerId = config.containerId;
        this.standardWidth = config.standardWidth;
        this.init();
    }

    init(): void {
        // this.levelMapper = new Map<string, Konva.Group>();
        // this.pointMapper = new Map<string, Konva.Group>();
        Konva.hitOnDragEnabled = true;
        this.stage = new Konva.Stage({
            container: this.containerId,
            width: this.config.width,
            height: this.config.height,
            draggable: true,
            dragBoundFunc: (pos) => {
                return this.applyBoundaryForPosition(pos);
            },
        });
        this.imageLayer = new Konva.Layer({
            listening: false,
            id: 'image-layers'
        });
        this.pointLayer = new Konva.Layer({
            id: 'point-layers'
        });
        this.stage.add(this.imageLayer);
        this.stage.add(this.pointLayer);

        // this.imageLayer.draw();
        this.initEvents();
        this.calculateBoundary();
    }

    setMaxScaleValue(val: number): void {
        this.maxScaleValue = val;
    }

    initEvents(): void {
        this.stage.on('wheel', (e) => {
            e.evt.preventDefault();
            const oldScale = this.stage.scaleX();
            const pointer = this.stage.getPointerPosition() ?? {x: 0, y: 0};
            const mousePointTo = {
                x: (pointer.x - this.stage.x()) / oldScale,
                y: (pointer.y - this.stage.y()) / oldScale,
            };
            const newScale = e.evt.deltaY < 0 ? oldScale * this.config.scaleBy : oldScale / this.config.scaleBy;
            const newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };
            this.scaleTo(newScale, newPos);
        });
        let lastCenter: {x: number, y: number} = null;
        let lastDist = 0;

        this.stage.on('touchmove', (e) => {
            e.evt.preventDefault();
            const touch1 = e.evt.touches[0];
            const touch2 = e.evt.touches[1];

            if (touch1 && touch2) {
                // if the stage was under Konva's drag&drop
                // we need to stop it, and implement our own pan logic with two pointers
                if (this.stage.isDragging()) {
                    this.stage.stopDrag();
                }

                const p1 = {
                    x: touch1.clientX,
                    y: touch1.clientY,
                };
                const p2 = {
                    x: touch2.clientX,
                    y: touch2.clientY,
                };

                if (!lastCenter) {
                    lastCenter = this.getCenter(p1, p2);
                    return;
                }
                const newCenter = this.getCenter(p1, p2);
                const dist = this.getDistance(p1, p2);
                if (!lastDist) {
                    lastDist = dist;
                }

                // local coordinates of center point
                const pointTo = {
                    x: (newCenter.x - this.stage.x()) / this.stage.scaleX(),
                    y: (newCenter.y - this.stage.y()) / this.stage.scaleX(),
                };

                const oldScale = this.stage.scaleX();
                let newScale = this.stage.scaleX() * (dist / lastDist);
                newScale = newScale < 1 ? 1 : newScale;
                newScale = this.maxScaleValue < newScale ? this.maxScaleValue : newScale;
                if (oldScale === newScale) {
                    return;
                }

                // calculate new position of the stage
                const dx = newCenter.x - lastCenter.x;
                const dy = newCenter.y - lastCenter.y;
                const newPos = {
                    x: newCenter.x - pointTo.x * newScale + dx,
                    y: newCenter.y - pointTo.y * newScale + dy,
                };
                this.scaleTo(newScale, newPos);
                lastDist = dist;
                lastCenter = newCenter;
            }
        });

        this.stage.on('touchend', () => {
            lastDist = 0;
            lastCenter = null;
        });
        if (this.config.events && this.config.events.dragend) {
            this.stage.on('dragend', () => {
                if (this.config.events && this.config.events.dragend) {
                    this.config.events.dragend(this.stage.position());
                }
            });
        }
    }

    private applyBoundaryForPosition(pos: {x: number, y: number}): {x: number, y: number} {
        const x = this.boundary.maxX < pos.x ? this.boundary.maxX : (pos.x < this.boundary.minX ? this.boundary.minX : pos.x);
        const y = this.boundary.maxY < pos.y ? this.boundary.maxY : (pos.y < this.boundary.minY ? this.boundary.minY : pos.y);
        return {x, y};
    }

    private scaleTo(newScale: number, newPosition?: {x: number, y: number}): void {
        const oldScale = this.stage.scaleX();
        newScale = newScale < 1 ? 1 : newScale;
        newScale = this.maxScaleValue < newScale ? this.maxScaleValue : newScale;

        if (oldScale === newScale) {
            return;
        }
        newPosition = this.applyBoundaryForPosition(newPosition);
        this.stage.scale({x: newScale, y: newScale});
        this.stage.position(newPosition);
        this.keepThePointSize();
        this.stage.batchDraw();
        if (this.config.events && this.config.events.scale) {
            this.config.events.scale(newScale, newPosition);
        }
        this.calculateBoundary();
    }

    scale(value: number): void {
        const oldScale = this.stage.scaleX();
        const center = {
            x: this.stage.width() / 2,
            y: this.stage.height() / 2,
        };

        const relatedTo = {
            x: (center.x - this.stage.x()) / oldScale,
            y: (center.y - this.stage.y()) / oldScale,
        };
        const newPos = {
            x: center.x - relatedTo.x * value,
            y: center.y - relatedTo.y * value,
        };
        const tween = new Konva.Tween({
            node: this.stage,
            duration: 1,
            easing: Konva.Easings.EaseInOut,
            onUpdate: () => {
                if (this.config.events && this.config.events.scale) {
                    this.config.events.scale(this.stage.scaleX(), this.stage.position());
                }
                this.keepThePointSize();
            },
            onFinish: () => {
                tween.destroy();
                this.calculateBoundary();
            },
            scaleX: value,
            scaleY: value,
            x: newPos.x,
            y: newPos.y
        });
        tween.play();
    }

    private getDistance(p1: {x: number, y: number}, p2: {x: number, y: number}) {
        return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
    }

    private getCenter(p1: {x: number, y: number}, p2: {x: number, y: number}) {
        return {
            x: (p1.x + p2.x) / 2,
            y: (p1.y + p2.y) / 2,
        };
    }

    private getContainer(containerId?: string): HTMLElement {
        containerId = containerId ?? this.config.containerId;
        const container = document.getElementById(containerId);
        if (!container) {
            throw new Error(`Container does not exist (id = ${containerId})`);
        }
        return container;
    }

    public resize(): void {
        // const sceneWidth = window.innerWidth;
        const container = this.getContainer('tool-viewer');
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;
        // const scale = containerWidth / sceneWidth;
        if (this.stage.width() === containerWidth && this.stage.height() === containerHeight) {
            return;
        }

        this.stage.width(containerWidth);
        this.stage.height(containerHeight);
        // this.stage.scale({ x: scale, y: scale });

        // Re-calculate boundary
        this.calculateBoundary();
    }

    private calculateBoundary(): void {
        const containerWidth = this.stage.width();
        const containerHeight = this.stage.height();
        const standardHeight = this.standardWidth * 9 / 16;
        const scale = this.stage.scaleX();
        this.boundary = {
            minX: containerWidth - this.standardWidth * scale,
            maxX: 0,
            minY: containerHeight - standardHeight * scale,
            maxY: 0,
        }
    }

    reset(): void {
        this.imageLayer.destroyChildren();
        this.pointLayer.destroyChildren();
        this.stage.position({x: 0, y: 0});
        this.stage.scale({x: 1, y: 1});
        this.calculateBoundary();
    }

    private keepThePointSize(): void {
        const points = this.stage.find('.Point');
        points.forEach(p => {
            p.setAttrs({
                scaleX: 1 / this.stage.scaleX(),
                scaleY: 1 / this.stage.scaleY()
            });
        });
    }

    drawImages(images: PainterImageInterface[], levelId: string): void {
        const level = this.getLevelById(levelId) ?? this.createLevel(levelId);
        const children = this.imageLayer.children ?? [];
        level.zIndex(children.length - 1);
        const visibleImageIds: string[] = [];
        const promises = [];
        for (const image of images) {
            const imageId = this.generateImageId(image.id, levelId);
            visibleImageIds.push(imageId);
            const konImg = this.getImageById(imageId)
            if (!konImg) {
                const promise = this.createImage(image, imageId);
                promises.push(promise);
                promise.then((konImage) => {
                    level && level.add(konImage);
                    // konImage.cache();
                    level.draw();
                })
            } else {
                konImg.visible(true);
            }
        }
        Promise.all(promises)
            .then(() => {
                // ignore
            })
            .catch(() => {
                // ignore
            })
            .finally(() => {
                this.hideImages(visibleImageIds);
            })
        ;

    }

    private async createImage(image: PainterImageInterface, id: string): Promise<Konva.Image> {
        return new Promise((resolve, reject) => {
            const imageObj = new Image();
            imageObj.onload = () => {
                const konImage = new Konva.Image({
                    id: id,
                    x: image.position.x,
                    y: image.position.y,
                    width: image.width,
                    height: image.height,
                    image: imageObj,
                    listening: false,
                    name: 'SubImage',
                });
                resolve(konImage);
            };
            imageObj.onerror = () => reject();
            imageObj.src = image.url;
        });
    }

    private generateImageId(imageId: string, levelId: string): string {
        return levelId + '-' + imageId;
    }

    hideImages(newImageIds: string[]): void {
        if (!this.visibleImageIds || !this.visibleImageIds.length) {
            this.visibleImageIds = newImageIds;
            return;
        }
        this.visibleImageIds.forEach(id => {
            if (newImageIds.indexOf(id) < 0) {
                const img = this.stage.findOne(`#${id}`);
                // img && img.visible(false);
                img && img.destroy();
            }
        });
        this.visibleImageIds = newImageIds;
    }

    drawPoints(points: PainterPointInterface[]): void {
        this.removeAllPoints();
        points.forEach((pointData) => {
            const service = this.getService(pointData.type);
            service.createShapes(pointData, this.stage)
                .then(point => {
                    point = service.initEvents(point, this.config, pointData);
                    point.setPosition(pointData.position);
                    point.setAttrs({
                        scaleX: 1 / this.stage.scaleX(),
                        scaleY: 1 / this.stage.scaleY()
                    });
                    point.cache();
                    this.pointLayer.add(point);
                    if (this.config.events && this.config.events.pointDragend) {
                        point.on('dragend', (evt) => {
                            if (this.config.events && this.config.events.pointDragend) {
                                this.config.events.pointDragend(pointData.id, evt.currentTarget.getPosition());
                            }
                        });
                    }
                })
            ;
        });
        this.pointLayer.batchDraw();
    }

    redrawPoint(pointData: PainterPointInterface): void {
        const point = this.getPointById(pointData.id);
        if (point) {
            point.destroy();
        }
        this.drawPoints([pointData]);
        this.pointLayer.draw();
    }

    changePointProperties(pointData: PainterPointInterface): void {
        const point = this.getPointById(pointData.id);
        if (!point) {
            throw new Error(`The point does not exist (${pointData.id})`);
        }
        const service = this.getService(pointData.type);
        service.changePointProperties(pointData, point);
    }

    removePoint(id: string): void {
        const point = this.getPointById(id);
        if (point) {
            point.destroy();
        }
    }

    removeAllPoints(): void {
        const points = this.stage.find('.Point');
        points.forEach(p => p.destroy());
    }

    private getLevelById(id: string): Konva.Group | undefined {
        // return this.levelMapper.get(id);
        return this.stage.findOne(`#${id}`) as Konva.Group;
    }

    private createLevel(id: string): Konva.Group {
        const level = new Konva.Group({
            id: id,
            name: 'Level'
        });
        this.imageLayer.add(level);
        // this.levelMapper.set(id, level);
        return level;
    }

    private getPointById(id: string): Konva.Group | undefined {
        // return this.pointMapper.get(id);
        return this.stage.findOne(`#${id}`) as Konva.Group;
    }

    private getImageById(id: string): Konva.Image {
        return this.stage.findOne(`#${id}`);
    }


    private getService(type: PointType): PointService {
        let service: PointService;
        if (this.servicesMap.has(type)) {
            return this.servicesMap.get(type);
        }
        switch (type) {
            case PointType.TEXT:
                service = new TextService();
                break;
            case PointType.LINK:
                service = new LinkService();
                break;
            case PointType.BEST_PRACTICE:
                service = new BestPracticeService();
                break;
            case PointType.RISK:
                service = new RiskService();
                break;
            case PointType.COMING_SOON:
                service = new ComingSoonService();
                break;
            case PointType.DROPDOWN:
                service = new DropdownService();
                break;
            default:
                throw new Error('Point type is invalid');
        }
        this.servicesMap.set(type, service);
        return service;
    }
}
