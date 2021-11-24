import { CalculatorInterface } from './calculator.interface';
import { BaseImageInterface } from '../data.interface';
import { PainterImageInterface } from '../painter/painter.interface';

export const BaseImageSize = 250;

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
        zoomValue: number,
        standardWidth: number
    ): PainterImageInterface[] {
        const standardHeight = baseImage.height * standardWidth / baseImage.width;
        const realWidth = standardWidth * zoomValue;
        const realHeight = standardHeight * zoomValue;

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


        console.log('start X ', startX, endX);
        console.log('start Y ', startY, endY);

        const standardImageSize = standardWidth * BaseImageSize / baseImage.width;
        const realImageSize = standardImageSize * zoomValue;

        console.log('image sizes: ', standardImageSize, realImageSize);

        let indexOriginalX = Math.ceil(startX / realImageSize);
        indexOriginalX = indexOriginalX !== 0 ? indexOriginalX : 1;
        let indexOriginalY = Math.ceil(startY / realImageSize);
        indexOriginalY = indexOriginalY !== 0 ? indexOriginalY : 1;
        const indexEndX = Math.ceil(endX / realImageSize);
        const indexEndY = Math.ceil(endY / realImageSize);

        console.log(indexOriginalX, indexOriginalY, indexEndX, indexEndY)
        const images = [];
        for (let i = indexOriginalX; i <= indexEndX; i++) {
            for (let j = indexOriginalY; j <= indexEndY; j++) {
                const key = `${i}x${j}`;
                const x = (i - 1) * standardImageSize + coordinate.x;
                const y = (j - 1) * standardImageSize + coordinate.y;
                images.push({
                    uuid: key,
                    url: this.generateSubImageUrl(baseImage.url, key),
                    position: {
                        x,
                        y
                    },
                    scale: 1,
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
