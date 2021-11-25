import { CalculatorInterface } from './calculator.interface';
import { BaseImageInterface } from '../data.interface';
import { PainterImageInterface } from '../painter/painter.interface';

export const BASE_IMAGE_SIZE = 256;

export class Calculator implements CalculatorInterface {
    setCoordinate(): void {
        //
    }

    coordinateToPosition(): void {
        //
    }

    positionToCoordinate(): void {
        //
    }

    generateRequiredImages(
        coordinate: { x: number, y: number },
        containerWidth: number,
        containerHeight: number,
        baseImage: BaseImageInterface,
        scaleValue: number,
        standardWidth: number,
        baseImageSize: number = BASE_IMAGE_SIZE
    ): PainterImageInterface[] {
        const standardHeight = baseImage.height * standardWidth / baseImage.width;
        const realWidth = standardWidth * scaleValue;
        const realHeight = standardHeight * scaleValue;

        if (
            containerWidth < coordinate.x
            || (coordinate.x + realWidth) < 0
            || containerHeight < coordinate.y
            || (coordinate.y + realHeight) < 0) {
            return [];
        }

        const startX = 0 <= coordinate.x && coordinate.x <= containerWidth ? 0 : (0 - coordinate.x);
        const endX = (0 - coordinate.x + containerWidth) < realWidth ? (0 - coordinate.x + containerWidth) : realWidth;
        const startY = 0 <= coordinate.y && coordinate.y <= containerHeight ? 0 : (0 - coordinate.y);
        const endY = (0 - coordinate.y + containerHeight) < realHeight ? (0 - coordinate.y + containerHeight) : realHeight;

        const standardImageSize = standardWidth * baseImageSize / baseImage.width;
        const realImageSize = standardImageSize * scaleValue;

        const maxIndexX = Math.ceil(baseImage.width / baseImageSize);
        const maxIndexY = Math.ceil(baseImage.height / baseImageSize);

        let indexOriginalX = Math.floor(startX / realImageSize);
        indexOriginalX = indexOriginalX !== 0 ? indexOriginalX : 1;
        let indexOriginalY = Math.floor(startY / realImageSize);
        indexOriginalY = indexOriginalY !== 0 ? indexOriginalY : 1;
        const indexEndX = Math.min(Math.ceil(endX / realImageSize), maxIndexX);
        const indexEndY = Math.min(Math.ceil(endY / realImageSize), maxIndexY);

        const images: PainterImageInterface[] = [];
        for (let i = indexOriginalX; i <= indexEndX; i++) {
            for (let j = indexOriginalY; j <= indexEndY; j++) {
                const key = `${i}x${j}`;
                const x = (i - 1) * standardImageSize;
                const y = (j - 1) * standardImageSize;
                images.push({
                    uuid: key,
                    url: this.generateSubImageUrl(baseImage.url, key),
                    position: {
                        x,
                        y
                    },
                    width: standardImageSize,
                    height: standardImageSize
                });
            }
        }
        return images;
    }

    generateSubImageUrl(imageUrl: string, key: string): string {
        const paths = imageUrl.split('.');
        paths[paths.length - 2] += '-' + key;
        return paths.join('.');
    }
}
