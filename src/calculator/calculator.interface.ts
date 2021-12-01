import { BaseImageInterface, Vector2d } from '../data.interface';
import { PainterImageInterface } from '../painter/painter.interface';

export interface CalculatorInterface {

    generateRequiredImages(
        position: Vector2d,
        containerWidth: number,
        containerHeight: number,
        baseImage: BaseImageInterface,
        scaleValue: number,
        standardWidth: number,
        boundary?: number
    ): PainterImageInterface[];
}
