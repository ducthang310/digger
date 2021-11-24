export interface PainterConfigInterface {
    containerId: string;
    width: number;
    height: number;
}

export interface PainterImageInterface {
    uuid: string;
    url: string;
    position: {x: number, y: number};
    scale: number;
}

export interface PainterPointInterface {
    uuid: string;
    text: string;
    position: {x: number, y: number};
    rotation: number;
}

export interface PainterInterface {

    init(config: PainterConfigInterface): void;

    reset(): void;
    zoomIn(): void;
    zoomOut(): void;

    drawImages(images: PainterImageInterface[], levelUuid: string): void;
    drawPoints(points: PainterPointInterface[]): void;
    updatePoint(point: PainterPointInterface): void;
}