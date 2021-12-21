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

    /**
     * Offset: the container position
     * @param offset
     * @param currentPosition
     */
    offsetToPosition(offset: Vector2d, currentPosition: Vector2d, currentScaleValue: number): Vector2d;

    canvasPositionToOffset(canvasPosition: Vector2d, currentPosition: Vector2d, currentScaleValue: number): Vector2d;

    imagePositionToCanvasPosition(imgPos: Vector2d, imageWidth: number, standardWidth: number): Vector2d;

    canvasPositionToImagePosition(imgPos: Vector2d, imageWidth: number, standardWidth: number): Vector2d;
}
