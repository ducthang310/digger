import { CalculatorInterface } from './calculator.interface';
import { BaseImageInterface, PointInterface, Vector2d } from '../data.interface';
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
        if (baseImage.width === null || baseImage.height === null) {
            return [{
                id: baseImage.id + '-1x1',
                url: baseImage.url,
                position: {
                    x: 0,
                    y: 0,
                },
                width: containerWidth,
                height: null
            }]
        }
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
                const width = i === indexEndX ? (standardWidth - x) : standardImageSize;
                const height = j === indexEndY ? (standardHeight - y) : standardImageSize;
                images.push({
                    id: key,
                    url: this.generateSubImageUrl(baseImage.url, key),
                    position: {
                        x,
                        y
                    },
                    width: width,
                    height: height,
                });
            }
        }
        return images;
    }

    offsetToPosition(offset: Vector2d, currentPosition: Vector2d, currentScaleValue: number): Vector2d {
        return {
            x: (offset.x - currentPosition.x) / currentScaleValue,
            y: (offset.y - currentPosition.y) / currentScaleValue
        };
    }

    canvasPositionToOffset(canvasPosition: Vector2d, currentPosition: Vector2d, currentScaleValue: number): Vector2d {
        return {
            x: canvasPosition.x * currentScaleValue + currentPosition.x,
            y: canvasPosition.y * currentScaleValue + currentPosition.y,
        };
    }

    offsetToPositionWithoutRatioScaling(offset: Vector2d, currentPosition: Vector2d): Vector2d {
        return {
            x: (offset.x - currentPosition.x),
            y: (offset.y - currentPosition.y)
        };
    }

    imagePositionToCanvasPosition(imgPos: Vector2d, imageWidth: number, standardWidth: number): Vector2d {
        if (!imageWidth) {
            return {x: 0, y: 0};
        }
        const ratio = standardWidth / imageWidth;
        return {
            x: imgPos.x * ratio,
            y: imgPos.y * ratio
        }
    }

    canvasPositionToImagePosition(canvasPos: Vector2d, imageWidth: number, standardWidth: number): Vector2d {
        if (!imageWidth) {
            return {x: 0, y: 0};
        }
        const ratio = standardWidth / imageWidth;
        return {
            x: canvasPos.x / ratio,
            y: canvasPos.y / ratio
        }
    }

    private generateSubImageUrl(imageUrl: string, key: string): string {
        const paths = imageUrl.split('.');
        paths[paths.length - 2] += '-' + key;
        return paths.join('.');
    }

    getVisiblePoints(points: PointInterface[], scaleValue: number): PointInterface[] {
        const visiblePoints: PointInterface[] = [];
        const numbers: number[] = [];
        const mapper: Map<number, PointInterface[]> = new Map<number, PointInterface[]>();
        points.forEach(p => {
            const minZoom = p.min_zoom ? p.min_zoom : 0;
            if (numbers.indexOf(minZoom) < 0) {
                numbers.push(minZoom);
            }

            const arrPoints = mapper.has(minZoom) ? mapper.get(minZoom) : [];
            arrPoints.push(p);
            mapper.set(minZoom, arrPoints);
        });

        for (let i = 0, len = numbers.length; i < len; i++) {
            const num = numbers[i];
            if (scaleValue < num) {
                continue;
            }
            const arrPoints = mapper.has(num) ? mapper.get(num) : [];
            arrPoints.forEach(p => {
                const minZoom = num;
                const maxZoom = p.max_zoom ? p.max_zoom : 999;
                if (minZoom <= scaleValue && scaleValue <= maxZoom) {
                    visiblePoints.push(p);
                }
            })
        }
        // console.log(scaleValue, numbers);
        // console.log(points, visiblePoints);
        return visiblePoints;
    }
}
