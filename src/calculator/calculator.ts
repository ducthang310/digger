import { CalculatorInterface } from './calculator.interface';
import { BaseImageInterface, Vector2d } from '../data.interface';
import { PainterImageInterface } from '../painter/painter.interface';

export const BASE_IMAGE_SIZE = 256;
export const DEFAULT_BOUNDARY_RATIO = 1.5;

export class Calculator implements CalculatorInterface {

    generateRequiredImages(
        position: Vector2d,
        containerWidth: number,
        containerHeight: number,
        baseImage: BaseImageInterface,
        scaleValue: number,
        standardWidth: number,
        baseImageSize: number = BASE_IMAGE_SIZE,
        boundary: number = DEFAULT_BOUNDARY_RATIO
    ): PainterImageInterface[] {
        const standardHeight = baseImage.height * standardWidth / baseImage.width;
        const realWidth = standardWidth * scaleValue;
        const realHeight = standardHeight * scaleValue;

        if (
            containerWidth < position.x
            || (position.x + realWidth) < 0
            || containerHeight < position.y
            || (position.y + realHeight) < 0) {
            return [];
        }

        const startX = 0 <= position.x && position.x <= containerWidth ? 0 : (0 - position.x);
        const endX = (0 - position.x + containerWidth) < realWidth ? (0 - position.x + containerWidth) : realWidth;
        const startY = 0 <= position.y && position.y <= containerHeight ? 0 : (0 - position.y);
        const endY = (0 - position.y + containerHeight) < realHeight ? (0 - position.y + containerHeight) : realHeight;

        const standardImageSize = standardWidth * baseImageSize / baseImage.width;
        const realImageSize = standardImageSize * scaleValue;

        const maxIndexX = Math.ceil(baseImage.width / baseImageSize);
        const maxIndexY = Math.ceil(baseImage.height / baseImageSize);

        let indexOriginalX = Math.floor(startX / realImageSize);
        indexOriginalX = indexOriginalX !== 0 ? indexOriginalX : 1;
        let indexOriginalY = Math.floor(startY / realImageSize);
        indexOriginalY = indexOriginalY !== 0 ? indexOriginalY : 1;
        let indexEndX = Math.min(Math.ceil(endX / realImageSize), maxIndexX);
        let indexEndY = Math.min(Math.ceil(endY / realImageSize), maxIndexY);

        // Apply boundary
        if (boundary > 1) {
            const additionalX = Math.ceil((boundary - 1) * (indexEndX - indexOriginalX));
            indexOriginalX = Math.max(1, indexOriginalX - additionalX);
            indexEndX = Math.min(maxIndexX, indexEndX + additionalX);
            const additionalY = Math.ceil((boundary - 1) * (indexEndY - indexOriginalY));
            indexOriginalY = Math.max(1, indexOriginalY - additionalY);
            indexEndY = Math.min(maxIndexY, indexEndY + additionalY);
        }

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

    offsetToPosition(offset: Vector2d, currentPosition: Vector2d): Vector2d {
        return {x: offset.x - currentPosition.x, y: offset.y - currentPosition.y};
    }

    private generateSubImageUrl(imageUrl: string, key: string): string {
        const paths = imageUrl.split('.');
        paths[paths.length - 2] += '-' + key;
        return paths.join('.');
    }
}
