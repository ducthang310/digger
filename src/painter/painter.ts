import {
    PainterConfigInterface,
    PainterImageInterface,
    PainterInterface,
    PainterPointInterface
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
        this.imageLayer = new Konva.Layer();
        this.pointLayer = new Konva.Layer();
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
        });
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
        images.forEach(image => {
            const imageObj = new Image();
            imageObj.onload = () => {
                const konImage = new Konva.Image({
                    x: image.position.x,
                    y: image.position.y,
                    width: image.width,
                    height: image.height,
                    image: imageObj,
                });
                level && level.add(konImage);
            };
            imageObj.src = image.url;
        });
    }

    drawPoints(points: PainterPointInterface[]): void {
        points.forEach(pointData => {
            const point = new Konva.Group({
                id: pointData.uuid,
                name: 'Point'
            });
            const circle = new Konva.Circle({
                radius: 10,
                fill: 'red',
                stroke: 'gray',
                strokeWidth: 1,
            });
            point.add(circle);

            if (pointData.text) {
                const text = new Konva.Text({
                    text: pointData.text,
                    fontSize: 18,
                    fontFamily: 'Calibri',
                    fill: 'green',
                });
                point.add(text);
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
        } else if (pointData) {
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
            id: uuid
        });
        this.imageLayer.add(level);
        // this.levelMapper.set(uuid, level);
        return level;
    }

    private getPointByUuid(uuid: string): Konva.Group | undefined {
        // return this.pointMapper.get(uuid);
        return this.stage.findOne(`#${uuid}`) as Konva.Group;
    }
}
