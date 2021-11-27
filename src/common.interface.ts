export interface DiggerEventCallbacksInterface {
    dragstart?: () => void,
    dragMove?: () => void,
    dragend?: (position: {x: number, y: number} | undefined) => void,
    scale?: (newScale: number, position: {x: number, y: number}) => void,
    pointClick?: (uuid: string) => void,
}
