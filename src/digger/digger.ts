import { DiggerConfigInterface, DiggerInterface } from './digger.interface';
import { Calculator } from '../calculator/calculator';
import { CalculatorInterface } from '../calculator/calculator.interface';
import { PainterInterface, PainterPointInterface } from '../painter/painter.interface';
import { Painter } from '../painter/painter';
import { PointInterface, Vector2d, ZoomLevelInterface } from '../data.interface';

export const DEFAULT_ZOOM_GAP = 1.5;
export const STANDARD_WIDTH = 1024;
export const DEFAULT_SCALE_BY = 1.026;

export class Digger implements DiggerInterface {
    config: DiggerConfigInterface;
    calculator: CalculatorInterface;
    painter: PainterInterface;
    zoomLevelMapper: Map<number, ZoomLevelInterface>;
    points: PointInterface[] = [];

    currentZoomLevel: ZoomLevelInterface | null;
    currentScaleValue: number;
    currentPosition: Vector2d;

    timeoutIDRendering: any;
    zoomGap: number;
    maxLevel: number;
    minLevel: number;


    constructor(config: DiggerConfigInterface) {
        this.init(config);
    }

    /**
     *
     * @param config
     * @private
     */
    private validateConfig(config: DiggerConfigInterface): boolean {
        if (!config) {
            throw new Error('The config is invalid');
        }
        return true;
    }

    init(config: DiggerConfigInterface): void {
        this.validateConfig(config);
        this.config = config;

        this.calculator = new Calculator();
        this.painter = new Painter({
            containerId: this.config.containerId,
            width: this.getContainer().clientWidth,
            height: this.getContainer().clientHeight,
            events: {
                ...this.config.events,
                dragend: this.cbDragEnd.bind(this),
                scale: this.cbScale.bind(this),
                pointDragend: this.cbPointDragEnd.bind(this),
                pointMouseenter: this.cbPointMouseenter.bind(this),
                pointMouseleave: this.cbPointMouseleave.bind(this),
            },
            scaleBy: this.config.scaleBy ? this.config.scaleBy : DEFAULT_SCALE_BY,
        });

        this.zoomGap = this.config.zoomGap || DEFAULT_ZOOM_GAP;
        this.zoomLevelMapper = new Map<number, ZoomLevelInterface>();

        this.currentScaleValue = 1;
        this.currentPosition = {x: 0, y: 0};
        if (Array.isArray(this.config.zoomLevels) && this.config.zoomLevels.length) {
            this.setMaxMinLevel();
            this.config.zoomLevels.forEach(z => {
                this.zoomLevelMapper.set(z.levelIndex, z);
            });
            this.currentZoomLevel = this.config.zoomLevels[0];
            this.render(this.currentZoomLevel, this.currentScaleValue, this.currentPosition);
        }

        if (Array.isArray(this.config.points) && this.config.points.length) {
            this.painter.drawPoints(this.config.points.map(p => this.convertToPainterPoint(p)));
        }
    }

    private render(zoomLevel: ZoomLevelInterface, scaleValue: number, position?: Vector2d, redrawPoints = false): void {
        if (!zoomLevel) {
            return;
        }

        if (this.timeoutIDRendering) {
            clearTimeout(this.timeoutIDRendering);
            this.timeoutIDRendering = null;
        }

        this.timeoutIDRendering = setTimeout(async () => {
            if (!position) {
                position = {x: 0, y: 0};
            }
            const container = this.getContainer();
            const images = this.calculator.generateRequiredImages(
                position,
                container.clientWidth, container.clientHeight,
                zoomLevel.image,
                scaleValue,
                this.getContainer().clientWidth,
            );
            this.painter.drawImages(images, zoomLevel.id);

            const points = this.calculator.getVisiblePoints(
                this.points,
                scaleValue,
                this.zoomGap,
            );
            redrawPoints && this.painter.drawPoints(points.map(p => this.convertToPainterPoint(p)));
        }, 300);
    }

    reset(): void {
        //
    }

    updateScaleBy(val: number): void {
        this.config.scaleBy = val;
        this.painter.config.scaleBy = val;
        this.render(this.currentZoomLevel, this.currentScaleValue, this.currentPosition);
    }

    updateZoomGap(val: number): void {
        this.config.zoomGap = val;
        this.zoomGap = val;
        this.render(this.currentZoomLevel, this.currentScaleValue, this.currentPosition);
    }

    zoomIn(): void {
        const val = Math.round((this.currentScaleValue + Number.EPSILON) * 100) / 100;
        this.currentScaleValue = val + 0.1;
        this.painter.scale(this.currentScaleValue);
    }

    zoomOut(): void {
        const val = Math.round((this.currentScaleValue + Number.EPSILON) * 100) / 100;
        const newVal = val - 0.1;
        this.currentScaleValue = newVal <= 1 ? 1 : newVal;
        this.painter.scale(this.currentScaleValue);
    }

    redraw(): void {
        this.render(this.currentZoomLevel, this.currentScaleValue, this.currentPosition);
    }

    setMaxMinLevel(): void {
        const numbers = this.config.zoomLevels.map(zl => zl.levelIndex);
        this.maxLevel = Math.max(...numbers);
        this.minLevel = Math.min(...numbers);
    }

    setZoomLevels(zoomLevels: ZoomLevelInterface[], redraw?: boolean): void {
        this.config.zoomLevels = zoomLevels;
        this.zoomLevelMapper = new Map<number, ZoomLevelInterface>();
        this.config.zoomLevels.forEach(z => {
            this.zoomLevelMapper.set(z.levelIndex, z);
        });
        this.setMaxMinLevel();
        let zl: ZoomLevelInterface;
        if (this.currentZoomLevel) {
            zl = this.config.zoomLevels.find(zl => zl.id === this.currentZoomLevel?.id);
        }
        this.currentZoomLevel = zl ? zl : (this.config.zoomLevels.length ? this.config.zoomLevels[0] : null);
        redraw && this.render(this.currentZoomLevel, this.currentScaleValue, this.currentPosition);
    }

    setPoints(points: PointInterface[]): void {
        // this.painter.removeAllPoints();
        // this.painter.drawPoints(points.map(p => this.convertToPainterPoint(p)));
        // console.log('---setPoints');
        this.points = points;
        this.drawPoints();
    }

    addPoint(point: PointInterface): void {
        // this.painter.drawPoints([{
        //     ...this.convertToPainterPoint(point),
        // }]);
        // console.log('---addPoint');
        this.points.push(point);
        this.drawPoints();
    }

    convertOffsetToImagePosition(offset: Vector2d): Vector2d {
        const canvasPos = this.calculator.offsetToPosition(offset, this.currentPosition, this.currentScaleValue);
        return this.calculator.canvasPositionToImagePosition(
            canvasPos,
            STANDARD_WIDTH,
            this.getContainer().clientWidth
        );
    }

    removePoint(id: string): void {
        // console.log('---removePoint');
        this.points = this.points.filter(p => p.id !== id);
        this.painter.removePoint(id);
    }

    redrawPoint(point: PointInterface, redraw?: boolean): void {
        this.points = this.points.filter(p => p.id !== point.id);
        this.points.push(point);
        // console.log('---redrawPoint');
        this.painter.redrawPoint(this.convertToPainterPoint(point));
        redraw && this.render(this.currentZoomLevel, this.currentScaleValue, this.currentPosition);
    }

    private drawPoints(): void {
        const points = this.calculator.getVisiblePoints(
            this.points,
            this.currentScaleValue,
            this.zoomGap,
        );
        this.painter.drawPoints(points.map(p => this.convertToPainterPoint(p)));
    }

    changePointProperties(point: PointInterface, redraw?: boolean): void {
        this.painter.changePointProperties(this.convertToPainterPoint(point));
        redraw && this.render(this.currentZoomLevel, this.currentScaleValue, this.currentPosition);
    }

    private cbDragEnd(position: { x: number, y: number } | undefined): void {
        this.currentPosition = position || {x: 0, y: 0};
        this.render(this.currentZoomLevel, this.currentScaleValue, this.currentPosition);
    }

    private cbScale(newScale: number, position: { x: number, y: number }): void {
        this.currentPosition = position;
        const index = this.scaleToLevelIndex(newScale);
        if (index <= this.minLevel) {
            this.currentZoomLevel = this.zoomLevelMapper.get(this.minLevel);
        } else if (index >= this.maxLevel) {
            this.currentZoomLevel = this.zoomLevelMapper.get(this.maxLevel);
        } else {
            const zl = this.zoomLevelMapper.get(index);
            this.currentZoomLevel = zl ? zl : this.currentZoomLevel;
        }
        this.currentScaleValue = newScale;
        this.render(this.currentZoomLevel, this.currentScaleValue, this.currentPosition, true);
        if (this.config.events && this.config.events.cbScale) {
            this.config.events.cbScale(this.currentScaleValue, this.currentZoomLevel.levelIndex);
        }
    }

    private cbPointDragEnd(id: string, position: { x: number, y: number }): void {
        if (this.config.events && this.config.events.pointDragend) {
            this.config.events.pointDragend(id, this.calculator.canvasPositionToImagePosition(
                position,
                STANDARD_WIDTH,
                this.getContainer().clientWidth
            ));
        }
    }

    private cbPointMouseenter(id: string, position: { x: number, y: number }): void {
        if (this.config.events && this.config.events.pointMouseenter) {
            this.config.events.pointMouseenter(id, this.calculator.canvasPositionToOffset(
                position, this.currentPosition, this.currentScaleValue
            ));
        }
    }

    private cbPointMouseleave(id: string, position: { x: number, y: number }): void {
        if (this.config.events && this.config.events.pointMouseleave) {
            this.config.events.pointMouseleave(id, this.calculator.canvasPositionToOffset(
                position, this.currentPosition, this.currentScaleValue
            ));
        }
    }

    private getContainer(): HTMLElement {
        const container = document.getElementById(this.config.containerId);
        if (!container) {
            throw new Error(`Container does not exist (id = ${this.config.containerId})`);
        }
        return container;
    }

    private scaleToLevelIndex(scale: number): number {
        return (scale < 1 ? 0 : Math.floor(Math.log(scale) / Math.log(this.zoomGap))) + 1;
    }

    private convertToPainterPoint(data: PointInterface): PainterPointInterface {
        return {
            id: data.id,
            type: data.type,
            subtype: data.subtype,
            text: data.text,
            text_base64: data.text_base64,
            textWidth: data.text_width,
            title: data.title,
            description: data.description,
            rotation: data.text_rotation,
            skewX: data.text_skew_x,
            skewY: data.text_skew_y,
            textColor: data.text_color,
            textBackgroundColor: data.text_background_color,
            primaryColor: data.primary_color,
            draggable: data.draggable,
            position: this.calculator.imagePositionToCanvasPosition(
                data.position,
                STANDARD_WIDTH,
                this.getContainer().clientWidth
            ),
            tooltipPosition: data.tooltip_position,
            pin_to_edge: data.pin_to_edge,
        }
    }
}
