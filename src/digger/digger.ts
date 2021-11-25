import { DiggerConfigInterface, DiggerInterface } from './digger.interface';
import { Calculator } from '../calculator/calculator';
import { CalculatorInterface } from '../calculator/calculator.interface';
import { PainterInterface } from '../painter/painter.interface';
import { Painter } from '../painter/painter';
import { CoordinateInterface, ZoomLevelInterface } from '../data.interface';

export const DEFAULT_ZOOM_GAP = 1.5;

export class Digger implements DiggerInterface {
    config: DiggerConfigInterface;
    calculator: CalculatorInterface;
    painter: PainterInterface;
    zoomLevelMapper: Map<number, ZoomLevelInterface>;

    currentZoomLevel: ZoomLevelInterface;
    currentScaleValue: number;
    currentCoordinate: CoordinateInterface;

    timeoutIDRendering: any;
    zoomGap: number;


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
            width: this.config.width,
            height: this.config.height,
            events: {
                dragend: this.cbDragEnd.bind(this),
                scale: this.cbScale.bind(this)
            }
        });

        this.zoomGap = this.config.zoomGap || DEFAULT_ZOOM_GAP;
        this.zoomLevelMapper = new Map<number, ZoomLevelInterface>();

        this.currentScaleValue = 1;
        this.currentCoordinate = {x: 0, y: 0};
        if (Array.isArray(this.config.zoomLevels) && this.config.zoomLevels.length) {
            this.config.zoomLevels.forEach(z => {
                this.zoomLevelMapper.set(z.levelIndex, z);
            });
            this.currentZoomLevel = this.config.zoomLevels[0];
            this.render(this.currentZoomLevel, this.currentScaleValue, this.currentCoordinate);
        }
    }

    private render(zoomLevel: ZoomLevelInterface, scaleValue: number, coordinate?: CoordinateInterface): void {
        if (!zoomLevel) {
            throw new Error('Zoom level is required');
        }

        if (this.timeoutIDRendering) {
            clearTimeout(this.timeoutIDRendering);
            this.timeoutIDRendering = null;
        }

        this.timeoutIDRendering = setTimeout(() => {
            if (!coordinate) {
                coordinate = {x: 0, y: 0};
            }
            const container = this.getContainer();
            const images = this.calculator.generateRequiredImages(
                coordinate,
                container.clientWidth, container.clientHeight,
                zoomLevel.image,
                scaleValue,
                this.getContainer().clientWidth,
            );
            this.painter.drawImages(images, zoomLevel.uuid);
        }, 300);
    }

    reset(): void {
        //
    }

    zoomIn(): void {
        this.painter.zoomIn();
    }

    zoomOut(): void {
        this.painter.zoomOut();
    }

    cbDragEnd(position: {x: number, y: number} | undefined): void {
        this.currentCoordinate = position || {x: 0, y: 0};
        this.render(this.currentZoomLevel, this.currentScaleValue, this.currentCoordinate);
    }

    cbScale(newScale: number, position: {x: number, y: number}): void {
        this.currentCoordinate = position;
        const zl = this.zoomLevelMapper.get(this.scaleToLevelIndex(newScale));
        this.currentZoomLevel = zl ? zl : this.currentZoomLevel;
        this.currentScaleValue = newScale;
        this.render(this.currentZoomLevel, this.currentScaleValue, this.currentCoordinate);
    }

    cbPointDragEnd(): void {
        //
    }

    cbPointHover(): void {
        //
    }

    cbPointClick(): void {
        //
    }

    private getContainer(): HTMLElement {
        const container = document.getElementById(this.config.containerId);
        if (!container) {
            throw new Error(`Container does not exist (id = ${this.config.containerId})`);
        }
        return container;
    }

    private scaleToLevelIndex(scale: number): number {
        return scale < 1 ? 0 : Math.floor(Math.log(scale) / Math.log(this.zoomGap));
    }

    // private levelIndexToScale(index: number): number {
    //     return index * this.zoomGap + 1;
    // }
}
