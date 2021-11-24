import { DiggerConfigInterface, DiggerInterface } from './digger.interface';
import { Calculator } from '../calculator/calculator';
import { CalculatorInterface } from '../calculator/calculator.interface';
import { PainterInterface } from '../painter/painter.interface';
import { Painter } from '../painter/painter';
import { CoordinateInterface, ZoomLevelInterface } from '../data.interface';

export class Digger implements DiggerInterface {
    config: DiggerConfigInterface;
    calculator: CalculatorInterface;
    painter: PainterInterface;

    currentZoomLevel: ZoomLevelInterface;
    currentZoomValue: number;
    currentCoordinate: CoordinateInterface;

    boundaryRatio = 1.5;


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
            height: this.config.height
        });

        this.currentZoomValue = 1;
        this.currentCoordinate = {x: 0, y: 0};
        if (Array.isArray(this.config.zoomLevels) && this.config.zoomLevels.length) {
            this.currentZoomLevel = this.config.zoomLevels[0];
            this.render(this.currentZoomLevel, this.currentZoomValue, this.currentCoordinate);
        }

        // TODO: test
        this.painter.drawImages([
            {uuid: 'aaa', url: 'https://via.placeholder.com/80x80.png?text=1', position: {x: 0, y: 0}, scale: 1},
            {uuid: 'bbb', url: 'https://via.placeholder.com/80x80.png?text=2', position: {x: 0, y: 80}, scale: 1},
            {uuid: 'ccc', url: 'https://via.placeholder.com/80x80.png?text=3', position: {x: 0, y: 160}, scale: 1},
            {uuid: 'ddd', url: 'https://via.placeholder.com/80x80.png?text=4', position: {x: 80, y: 0}, scale: 1},
            {uuid: 'eee', url: 'https://via.placeholder.com/80x80.png?text=5', position: {x: 80, y: 80}, scale: 1},
            {uuid: 'fff', url: 'https://via.placeholder.com/80x80.png?text=6', position: {x: 80, y: 160}, scale: 1},
            {uuid: 'ggg', url: 'https://via.placeholder.com/80x80.png?text=7', position: {x: 80, y: 240}, scale: 1}
        ], '111');

        setTimeout(() => {
            this.painter.drawImages([
                {uuid: 'qqq', url: 'https://via.placeholder.com/20/0000FF/fff?text=1', position: {x: 0, y: 0}, scale: 1},
                {uuid: 'www', url: 'https://via.placeholder.com/20/0000FF/fff?text=2', position: {x: 20, y: 0}, scale: 1},
                {uuid: 'rrr', url: 'https://via.placeholder.com/20/0000FF/fff?text=3', position: {x: 40, y: 0}, scale: 1},
                {uuid: 'ttt', url: 'https://via.placeholder.com/20/0000FF/fff?text=4', position: {x: 60, y: 0}, scale: 1},
                {uuid: 'yyy', url: 'https://via.placeholder.com/20/0000FF/fff?text=5', position: {x: 0, y: 20}, scale: 1},
                {uuid: 'uuu', url: 'https://via.placeholder.com/20/0000FF/fff?text=6', position: {x: 0, y: 40}, scale: 1},
                {uuid: 'iii', url: 'https://via.placeholder.com/20/0000FF/fff?text=7', position: {x: 0, y: 60}, scale: 1}
            ], '222');
        }, 3000);

        this.painter.drawPoints([
            {uuid: "uiop", text: "hello", position: {x: 100, y: 100}, rotation: 90},
            {uuid: "xcv", text: '', position: {x: 200, y: 300}, rotation: 90},
        ]);

        setTimeout(() => {
            this.painter.updatePoint({uuid: "xcv", text: 'ya ya ya', position: {x: 200, y: 300}, rotation: 90},)
        }, 2000);

    }

    private render(zoomLevel: ZoomLevelInterface, zoomValue?: number, coordinate?: CoordinateInterface): void {
        if (!zoomLevel) {
            throw new Error('Zoom level is required');
        }
        if (!zoomValue || zoomValue < zoomLevel.level) {
            zoomValue = zoomLevel.level;
        }
        if (!coordinate) {
            coordinate = {x: 0, y: 0};
        }
        const container = this.getContainter();
        const images = this.calculator.generateRequiredImages(
            coordinate,
            this.applyBoundary(container.clientWidth), this.applyBoundary(container.clientHeight),
            zoomLevel.image,
            zoomValue
        );
        this.painter.drawImages(images, zoomLevel.uuid);
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

    cbDragEnd(): void {
        //
    }
    cbScale(): void {
        //
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

    private getContainter(): HTMLElement {
        const container = document.getElementById(this.config.containerId);
        if (!container) {
            throw new Error(`Container does not exist (id = ${this.config.containerId})`);
        }
        return container;
    }

    /**
     * Apply boundary for the getting requires images
     * @param value
     * @private
     */
    private applyBoundary(value: number): number {
        return this.boundaryRatio * value;
    }
}
