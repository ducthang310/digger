import { BaseImageInterface } from '../data.interface';
import { PainterImageInterface } from '../painter/painter.interface';

export interface CalculatorInterface {

    setCoordinate(): void;

    coordinateToPosition(): void;

    positionToCoordinate(): void;

    generateRequiredImages(
        coordinate: { x: number, y: number },
        containerWidth: number,
        containerHeight: number,
        baseImage: BaseImageInterface,
        zoomValue: number,
        standardWidth: number
    ): PainterImageInterface[];
}