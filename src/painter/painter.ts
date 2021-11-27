import {
    PainterConfigInterface,
    PainterImageInterface,
    PainterInterface,
    PainterPointInterface, TooltipConfig
} from './painter.interface';
import Konva from 'konva';

export class Painter implements PainterInterface {
    config: PainterConfigInterface;
    containerId: string;

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

            const circles = this.stage.find('.Point');
            circles.forEach(c => {
                c.setAttrs({
                    scaleX: 1 / this.stage.scaleX(),
                    scaleY: 1 / this.stage.scaleY()
                });
            })
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

    zoomIn(): void {
        //
    }

    zoomOut(): void {
        //
    }

    drawImages(images: PainterImageInterface[], levelUuid: string): void {
        const level = this.getLevelByUuid(levelUuid) ?? this.createLevel(levelUuid);
        const children = this.imageLayer.children ?? [];
        level.zIndex(children.length - 1);
        images.forEach(image => {
            const imageId = level.id() + '-' + image.uuid;
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
            const primaryColor = pointData.primaryColor ?? '#0271FF';
            const strokeColor = this.hex2rgba(primaryColor, 0.2);
            const point = new Konva.Group({
                id: pointData.uuid,
                name: 'Point',
                draggable: true,
                rotation: pointData.rotation,
            });
            const circle = new Konva.Circle({
                radius: 10,
                fill: primaryColor,
                stroke: strokeColor,
                strokeWidth: 12,
            });
            circle.setAttr('point_uuid', pointData.uuid);
            circle.on('mouseenter', () => {
                this.stage.container().style.cursor = 'pointer';
            });

            circle.on('mouseleave', () => {
                this.stage.container().style.cursor = 'default';
            });

            circle.on('click', () => {
                if (this.config.events?.pointClick) {
                    this.config.events.pointClick(pointData.uuid);
                }
            });

            point.add(circle);

            if (pointData.text) {
                point.add(this.createToolTip({
                    text: pointData.text,
                    primaryColor: pointData.primaryColor,
                    textColor: pointData.textColor
                }));
            }
            point.setPosition(pointData.position);
            this.pointLayer.add(point);
        });
    }

    updatePoint(pointData: PainterPointInterface): void {
        const point = this.getPointByUuid(pointData.uuid);
        if (!point) {
            throw new Error(`The point does not exist (${pointData.uuid})`);
        }
        const konText: Konva.Text = point.findOne('Text');
        if (!pointData.text && konText) {
            konText.destroy();
        } else if (pointData.text) {
            if (!konText) {
                const newKonText = new Konva.Text({
                    text: pointData.text,
                    fontSize: 18,
                    fontFamily: 'Calibri',
                    fill: 'green',
                });
                point.add(newKonText);
            } else {
                konText.text(pointData.text);
            }
        }
        point.draw();
    }

    private getLevelByUuid(uuid: string): Konva.Group | undefined {
        // return this.levelMapper.get(uuid);
        return this.stage.findOne(`#${uuid}`) as Konva.Group;
    }

    private createLevel(uuid: string): Konva.Group {
        const level = new Konva.Group({
            id: uuid,
            name: 'Level'
        });
        this.imageLayer.add(level);
        // this.levelMapper.set(uuid, level);
        return level;
    }

    private getPointByUuid(uuid: string): Konva.Group | undefined {
        // return this.pointMapper.get(uuid);
        return this.stage.findOne(`#${uuid}`) as Konva.Group;
    }

    private imageExists(id: string): boolean {
        return !!this.stage.findOne(`#${id}`);
    }

    private createToolTip(tooltipConfig: TooltipConfig): Konva.Group {
        const primaryColor = tooltipConfig.primaryColor ?? '#0271FF';
        const textColor = tooltipConfig.textColor ?? '#ffffff';
        const paddingLeft = 15;
        const paddingTop = 8;
        const triangleWidth = 14;
        const triangleHeight = 7;
        const toolTip = new Konva.Group({
            name: 'Tooltip',
            x: 0,
            y: 0
        });
        const simpleText = new Konva.Text({
            x: paddingLeft,
            y: paddingTop,
            text: tooltipConfig.text,
            fontSize: 18,
            fill: textColor,
        });
        const rect = new Konva.Rect({
            x: 0,
            y: 0,
            width: 140,
            height: 40,
            fill: primaryColor,
            shadowColor: '#000000',
            shadowBlur: 5,
            shadowOffset: { x: 0, y: 2 },
            shadowOpacity: 0.25,
            cornerRadius: 3,
        });//0px 2px 5px 0 rgb(0 0 0 / 25%)

        const rectWidth = simpleText.width() + paddingLeft * 2;
        const rectHeight = simpleText.height() + paddingTop * 2;
        rect.width(rectWidth);
        rect.height(rectHeight);

        const triangle = new Konva.Shape({
            sceneFunc: function (context, shape) {
                context.beginPath();
                context.moveTo((rectWidth - triangleWidth) / 2, rectHeight);
                context.lineTo((rectWidth + triangleWidth) / 2, rectHeight);
                context.lineTo(rectWidth / 2, rectHeight + triangleHeight);
                context.closePath();
                context.fillStrokeShape(shape);
            },
            fill: primaryColor,
            shadowColor: '#000000',
            shadowBlur: 5,
            shadowOffset: { x: 0, y: 2 },
            shadowOpacity: 0.25,
        });

        toolTip.add(rect);
        toolTip.add(simpleText);
        toolTip.add(triangle);
        toolTip.setPosition({
            x: -1 * rectWidth / 2,
            y: -1 * (rectHeight + 20)
        });

        return toolTip;
    }

    private hex2rgba(hex: string, alpha = 1): string {
        const parts = hex.match(/\w\w/g);
        if (parts) {
            const [r, g, b] = parts.map(x => parseInt(x, 16));
            return `rgba(${r},${g},${b},${alpha})`;
        } else {
            return 'rgba(0, 0, 0, 1)';
        }
    }
}
