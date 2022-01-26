import {
    PainterConfigInterface,
    PainterImageInterface,
    PainterInterface,
    PainterPointInterface, PointType
} from './painter.interface';
import Konva from 'konva';
import { TextService } from './services/text.service';
import { LinkService } from './services/link.service';
import { BestPracticeService } from './services/best-practice.service';
import { RiskService } from './services/risk.service';
import { PointService } from './services/base.service';

export class Painter implements PainterInterface {
    config: PainterConfigInterface;
    containerId: string;

    servicesMap = new Map<number, PointService>();

    stage: Konva.Stage;
    imageLayer: Konva.Layer;
    // levelMapper: Map<string, Konva.Group>;
    pointLayer: Konva.Layer;
    // pointMapper: Map<string, Konva.Group>;

    constructor(config: PainterConfigInterface) {
        if (!config || !config.containerId) {
            throw new Error('Must provide the container Id');
        }
        this.config = config;
        this.containerId = config.containerId;
        this.init();
    }

    init(): void {
        // this.levelMapper = new Map<string, Konva.Group>();
        // this.pointMapper = new Map<string, Konva.Group>();
        this.stage = new Konva.Stage({
            container: this.containerId,
            width: this.config.width,
            height: this.config.height,
            draggable: true
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
    }

    initEvents(): void {
        const scaleBy = 1.026;
        this.stage.on('wheel', (e) => {
            e.evt.preventDefault();
            const oldScale = this.stage.scaleX();
            const pointer = this.stage.getPointerPosition() ?? {x: 0, y: 0};
            const mousePointTo = {
                x: (pointer.x - this.stage.x()) / oldScale,
                y: (pointer.y - this.stage.y()) / oldScale,
            };
            const newScale =
                e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;

            this.stage.scale({x: newScale, y: newScale});

            const newPos = {
                x: pointer.x - mousePointTo.x * newScale,
                y: pointer.y - mousePointTo.y * newScale,
            };
            this.stage.position(newPos);
            this.keepThePointSize();
            this.stage.batchDraw();
            if (this.config.events && this.config.events.scale) {
                this.config.events.scale(newScale, newPos);
            }
        });
        if (this.config.events && this.config.events.dragend) {
            this.stage.on('dragend', () => {
                if (this.config.events && this.config.events.dragend) {
                    this.config.events.dragend(this.stage.position());
                }
            });
        }
    }

    reset(): void {
        //
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
            onFinish: () => tween.destroy(),
            scaleX: value,
            scaleY: value,
            x: newPos.x,
            y: newPos.y
        });
        tween.play();
    }

    drawImages(images: PainterImageInterface[], levelId: string): void {
        const level = this.getLevelById(levelId) ?? this.createLevel(levelId);
        const children = this.imageLayer.children ?? [];
        level.zIndex(children.length - 1);
        images.forEach(image => {
            const imageId = level.id() + '-' + image.id;
            if (!this.imageExists(imageId)) {
                const imageObj = new Image();
                imageObj.onload = () => {
                    const konImage = new Konva.Image({
                        id: imageId,
                        x: image.position.x,
                        y: image.position.y,
                        width: image.width,
                        height: image.height,
                        image: imageObj,
                        listening: false,
                    });
                    level && level.add(konImage);
                    konImage.cache();
                };
                imageObj.src = image.url;
            }
        });
    }

    drawPoints(points: PainterPointInterface[]): void {
        points.forEach(pointData => {
            const service = this.getService(pointData.type);
            const point = service.createShapes(pointData, this.stage);
            point.on('click', () => {
                if (this.config.events?.pointClick) {
                    this.config.events.pointClick(pointData.id);
                }
            });

            if (pointData.type === PointType.BEST_PRACTICE || pointData.type === PointType.RISK) {
                point.find('.PointCircle').forEach(c => {
                    c.on('mouseenter', () => {
                        this.stage.container().style.cursor = 'pointer';
                        if (this.config.events && this.config.events.pointMouseenter) {
                            this.config.events.pointMouseenter(pointData.id, point.getPosition());
                        }
                        point.find('.Tooltip').forEach(t => {
                            t.hide();
                        });
                        point.clearCache();
                    });
                    c.on('mouseleave', () => {
                        this.stage.container().style.cursor = 'default';
                        if (this.config.events && this.config.events.pointMouseleave) {
                            this.config.events.pointMouseleave(pointData.id, point.getPosition());
                        }

                        point.find('.Tooltip').forEach(t => {
                            t.show();
                        });
                        point.clearCache();
                    });
                });
            } else {
                point.on('mouseenter', () => {
                    this.stage.container().style.cursor = 'pointer';
                });
                point.on('mouseleave', () => {
                    this.stage.container().style.cursor = 'default';
                });
            }

            point.find('.Tooltip').forEach(t => {
                t.on('click', (evt) => {
                    console.log('---digger: clicked to tooltip', this.config.events);
                    if (this.config.events?.tooltipClick) {
                        evt.cancelBubble = true;
                        this.config.events.tooltipClick(pointData.id);
                    }
                });
            });

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
        });
    }

    redrawPoint(pointData: PainterPointInterface): void {
        const point = this.getPointById(pointData.id);
        if (point) {
            point.destroy();
        }
        this.drawPoints([pointData]);
        this.pointLayer.draw();
        console.log('--redraw');
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

    private imageExists(id: string): boolean {
        return !!this.stage.findOne(`#${id}`);
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
            default:
                throw new Error('Point type is invalid');
        }
        this.servicesMap.set(type, service);
        return service;
    }
}
