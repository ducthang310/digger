import {
    PainterConfigInterface,
    PainterImageInterface,
    PainterInterface,
    PainterPointInterface, TooltipConfig
} from './painter.interface';
import Konva from 'konva';

const DefaultColor = '#FF7000';

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
            const primaryColor = pointData.primaryColor ?? DefaultColor;
            const strokeColor = this.hex2rgba(primaryColor, 0.2);
            const point = new Konva.Group({
                id: pointData.uuid,
                name: 'Point',
                draggable: pointData.draggable,
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
                }, pointData.type));
            }
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
                        this.config.events.pointDragend(pointData.uuid, evt.currentTarget.getPosition());
                    }
                });
            }
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

    removePoint(uuid: string): void {
        const point = this.getPointByUuid(uuid);
        if (point) {
            point.destroy();
        }
    }

    removeAllPoints(): void {
        const points = this.stage.find('.Point');
        points.forEach(p => p.destroy());
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

    private createToolTip(tooltipConfig: TooltipConfig, type?: number): Konva.Group {
        const primaryColor = tooltipConfig.primaryColor ?? DefaultColor;
        const textColor = tooltipConfig.textColor ?? '#ffffff';
        const paddingLeft = 15;
        const paddingTop = 16;
        let rectWidth = 160;
        const rectHeight = 40;
        const triangleWidth = 14;
        const triangleHeight = 7;

        const toolTip = new Konva.Group({
            name: 'Tooltip',
            x: 0,
            y: 0,
        });

        const simpleText = new Konva.Text({
            x: paddingLeft,
            y: paddingTop,
            text: tooltipConfig.text,
            fontSize: 14,
            fill: textColor,
            fontStyle: '600'
        });
        const radius = type && type > 2 ? [0, 0, 8, 8] : 8;
        const rect = new Konva.Rect({
            x: 0,
            y: 6,
            width: 160,
            height: 34,
            fill: type === 2 ? primaryColor : '#fff',
            shadowColor: '#BBBBBB',
            shadowBlur: 14,
            shadowOffset: { x: 0, y: 2 },
            shadowOpacity: 0.5,
            cornerRadius: radius,
        });//0px 2px 5px 0 rgb(0 0 0 / 25%) 0 2px 14px 0 rgba(187,187,187,0.50)
        const headRect = new Konva.Rect({
            x: 0,
            y: 0,
            width: 140,
            height: 16,
            fill: primaryColor,
            cornerRadius: [8, 8, 0, 0],
        });
        let icon: Konva.Group;
        let contentWidth = simpleText.width();
        if (type && type > 2) {
            if (type === 3) {
                icon = this.iconHighRisk();
            } else if (type === 4) {
                icon = this.iconMediumRisk();
            } else if (type === 5) {
                icon = this.iconLowRisk();
            }
            if (icon) {
                const iconWidth = 35;
                contentWidth += iconWidth;
                icon.setPosition({x: 10, y: 12});
                simpleText.x(20 + iconWidth);
            }
        }

        rectWidth = contentWidth + paddingLeft * 2;
        rect.width(rectWidth);
        headRect.width(rectWidth);

        const triangle = new Konva.Shape({
            sceneFunc: function (context, shape) {
                context.beginPath();
                context.moveTo((rectWidth - triangleWidth) / 2, rectHeight);
                context.lineTo((rectWidth + triangleWidth) / 2, rectHeight);
                context.lineTo(rectWidth / 2, rectHeight + triangleHeight);
                context.closePath();
                context.fillStrokeShape(shape);
            },
            fill: type === 2 ? primaryColor : '#ffffff',
            shadowColor: '#000000',
            shadowBlur: 5,
            shadowOffset: { x: 0, y: 2 },
            shadowOpacity: 0.25,
        });

        if (type && type > 2) {
            toolTip.add(headRect);
        } else {
            headRect.destroy();
        }
        toolTip.add(rect);
        icon && toolTip.add(icon);
        toolTip.add(simpleText);
        toolTip.add(triangle);
        toolTip.setPosition({
            x: -1 * rectWidth / 2,
            y: -1 * (rectHeight + 26)
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

    private iconLowRisk(): Konva.Group {
        const group = new Konva.Group({
            x: 0,
            y: 0,
        });
        const clockwise = new Konva.Path({
            x: 0,
            y: 0,
            data:
                'M4.51422485,17.1951152 C4.42851354,16.6894926 4.73848196,16.2082467 5.21917093,16.0681728 L5.3330273,16.0420486 L14.4186792,14.5018099 C15.1517038,13.5863102 16.2787892,13 17.5428146,13 C19.7519536,13 21.5428146,14.790861 21.5428146,17 C21.5428146,19.209139 19.7519536,21 17.5428146,21 C16.3603071,21 15.2976465,20.4868745 14.5653469,19.6711376 L5.32355141,18.0122644 C4.90845985,17.9377852 4.58470787,17.610904 4.51422485,17.1951152 Z',
            fill: '#56B631',

        });
        const clock = new Konva.Path({
            x: 0,
            y: 0,
            data:
                'M17.4856883,-0.00667040478 C26.9835835,-0.00667040478 34.7142383,7.55978506 34.9786943,16.9937376 L32.977797,16.9939768 C32.8719559,13.649817 31.7068047,10.5729168 29.8068051,8.08773786 L24.9427951,12.9504364 C24.5522708,13.3409607 23.9191059,13.3409607 23.5285816,12.9504364 C23.1680976,12.5899524 23.1403681,12.0227214 23.445393,11.6304302 L23.5285816,11.5362228 L28.4881096,6.57560325 C25.6798866,3.7457318 21.7874352,1.9933296 17.4856883,1.9933296 C13.1839415,1.9933296 9.29149007,3.7457318 6.48326707,6.57560325 L11.4427951,11.5362228 L11.5259837,11.6304302 C11.8310086,12.0227214 11.8032791,12.5899524 11.4427951,12.9504364 C11.0522708,13.3409607 10.4191059,13.3409607 10.0285816,12.9504364 L10.0285816,12.9504364 L5.16457158,8.08773786 C3.26457198,10.5729168 2.09942082,13.649817 1.9935797,16.9939768 L-0.00731763447,16.9937376 C0.257138367,7.55978506 7.98779317,-0.00667040478 17.4856883,-0.00667040478 Z',
            fill: '#242424',
        });
        group.add(clockwise, clock);
        return group;
    }

    private iconMediumRisk(): Konva.Group {
        const group = new Konva.Group({
            x: 0,
            y: 0,
        });
        const clockwise = new Konva.Path({
            x: 0,
            y: 0,
            data:
                'M17.3048848,4.01422485 C17.8105074,3.92851354 18.2917533,4.23848196 18.4318272,4.71917093 L18.4579514,4.8330273 L19.9981901,13.9186792 C20.9136898,14.6517038 21.5,15.7787892 21.5,17.0428146 C21.5,19.2519536 19.709139,21.0428146 17.5,21.0428146 C15.290861,21.0428146 13.5,19.2519536 13.5,17.0428146 C13.5,15.8603071 14.0131255,14.7976465 14.8288624,14.0653469 L16.4877356,4.82355141 C16.5622148,4.40845985 16.889096,4.08470787 17.3048848,4.01422485 Z',
            fill: '#FBAF40',

        });
        const clock = new Konva.Path({
            x: 0,
            y: 0,
            data:
                'M17.4856883,-0.00667040478 C26.9835835,-0.00667040478 34.7142383,7.55978506 34.9786943,16.9937376 L32.977797,16.9939768 C32.8719559,13.649817 31.7068047,10.5729168 29.8068051,8.08773786 L24.9427951,12.9504364 C24.5522708,13.3409607 23.9191059,13.3409607 23.5285816,12.9504364 C23.1680976,12.5899524 23.1403681,12.0227214 23.445393,11.6304302 L23.5285816,11.5362228 L28.4881096,6.57560325 C25.6798866,3.7457318 21.7874352,1.9933296 17.4856883,1.9933296 C13.1839415,1.9933296 9.29149007,3.7457318 6.48326707,6.57560325 L11.4427951,11.5362228 L11.5259837,11.6304302 C11.8310086,12.0227214 11.8032791,12.5899524 11.4427951,12.9504364 C11.0522708,13.3409607 10.4191059,13.3409607 10.0285816,12.9504364 L10.0285816,12.9504364 L5.16457158,8.08773786 C3.26457198,10.5729168 2.09942082,13.649817 1.9935797,16.9939768 L-0.00731763447,16.9937376 C0.257138367,7.55978506 7.98779317,-0.00667040478 17.4856883,-0.00667040478 Z',
            fill: '#242424',
        });
        group.add(clockwise, clock);
        return group;
    }

    private iconHighRisk(): Konva.Group {
        const group = new Konva.Group({
            x: 0,
            y: 0,
        });
        const clockwise = new Konva.Path({
            x: 0,
            y: 0,
            data:
                'M30.5285898,16.8048848 C30.6143011,17.3105074 30.3043327,17.7917533 29.8236437,17.9318272 L29.7097873,17.9579514 L20.6241355,19.4981901 C19.8911108,20.4136898 18.7640255,21 17.5,21 C15.290861,21 13.5,19.209139 13.5,17 C13.5,14.790861 15.290861,13 17.5,13 C18.6825075,13 19.7451681,13.5131255 20.4774677,14.3288624 L29.7192632,15.9877356 C30.1343548,16.0622148 30.4581068,16.389096 30.5285898,16.8048848 Z',
            fill: '#EF4036',

        });
        const clock = new Konva.Path({
            x: 0,
            y: 0,
            data:
                'M17.4856883,-0.00667040478 C26.9835835,-0.00667040478 34.7142383,7.55978506 34.9786943,16.9937376 L32.977797,16.9939768 C32.8719559,13.649817 31.7068047,10.5729168 29.8068051,8.08773786 L24.9427951,12.9504364 C24.5522708,13.3409607 23.9191059,13.3409607 23.5285816,12.9504364 C23.1680976,12.5899524 23.1403681,12.0227214 23.445393,11.6304302 L23.5285816,11.5362228 L28.4881096,6.57560325 C25.6798866,3.7457318 21.7874352,1.9933296 17.4856883,1.9933296 C13.1839415,1.9933296 9.29149007,3.7457318 6.48326707,6.57560325 L11.4427951,11.5362228 L11.5259837,11.6304302 C11.8310086,12.0227214 11.8032791,12.5899524 11.4427951,12.9504364 C11.0522708,13.3409607 10.4191059,13.3409607 10.0285816,12.9504364 L10.0285816,12.9504364 L5.16457158,8.08773786 C3.26457198,10.5729168 2.09942082,13.649817 1.9935797,16.9939768 L-0.00731763447,16.9937376 C0.257138367,7.55978506 7.98779317,-0.00667040478 17.4856883,-0.00667040478 Z',
            fill: '#242424',
        });
        group.add(clockwise, clock);
        return group;
    }
}
