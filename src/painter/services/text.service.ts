import { PainterConfigInterface, PainterPointInterface } from '../painter.interface';
import Konva from 'konva';
import { PointService } from './base.service';
import { Vector2d } from '../../data.interface';
// import html2canvas from 'html2canvas';
// import { DiggerUtility } from '../../digger.utility';

export class TextService extends PointService {
    async createShapes(data: PainterPointInterface): Promise<Konva.Group> {
        const point = new Konva.Group({
            id: data.id,
            name: 'Point',
            draggable: data.draggable,
            rotation: data.rotation,
        });
        let padding = 0;
        let mainText: Konva.Shape;
        let textScale = 1;
        let rect: Konva.Rect;
        if (!data.text_base64) {
            padding = 3;
            const textStr = data.text ? data.text.replace(/(<([^>]+)>)/gi, "") : '';
            rect = new Konva.Rect({
                x: 0,
                y: 0,
                width: 100,
                height: 50,
                fill: data.textBackgroundColor,
            });
            mainText = new Konva.Text({
                x: padding,
                y: padding,
                text: textStr,
                fontSize: 14,
                fill: data.textColor,
                fontStyle: '400',
                fontFamily: 'Poppins',
                lineHeight: 1.25,
            });
            return this.process(data, rect, point, mainText, textScale, padding);
        } else {
            textScale = 0.5;
            return new Promise((resolve, reject) => {
                const dataUrl = data.text_base64;
                const imageObj = new Image();
                imageObj.onload = () => {
                    mainText = new Konva.Image({
                        x: 0,
                        y: 0,
                        scaleX: textScale,
                        scaleY: textScale,
                        image: imageObj,
                    });
                    // const cacheService = this.getCacheService();
                    // const key = data.text + data.textBackgroundColor;
                    // cacheService.set(key, dataUrl);
                    resolve(this.process(data, rect, point, mainText, textScale, padding));
                };
                imageObj.onerror = () => reject();
                imageObj.src = dataUrl;
            });
        }
    }

    changePointProperties(pointData: PainterPointInterface, point: Konva.Group): void {
        point.position(pointData.position);
        // if (pointData.text_base64) {
        //     const textScale = 1 / window.devicePixelRatio;
        //     const mainText = new Konva.Image({
        //         x: 0,
        //         y: 0,
        //         scaleX: textScale,
        //         scaleY: textScale,
        //         image: pointData.text_base64,
        //     });
        //     const konText = point.findOne('Text');
        //     const konRect = point.findOne('Rect');
        //     konText && konText.destroy();
        //     konRect && konRect.destroy();
        //     point.add(mainText);
        // } else {
        //     const konText: Konva.Text = point.findOne('Text');
        //     if (!pointData.text && konText) {
        //         konText.destroy();
        //     } else if (pointData.text) {
        //         if (!konText) {
        //             const newKonText = new Konva.Text({
        //                 text: pointData.text,
        //                 fontSize: 14,
        //                 fill: pointData.textColor,
        //                 fontStyle: '400'
        //             });
        //             point.add(newKonText);
        //         } else {
        //             konText.fill(pointData.textColor);
        //             konText.text(pointData.text);
        //         }
        //
        //         const konRect: Konva.Rect = point.findOne('Rect');
        //         if (konRect) {
        //             konRect.fill(pointData.textBackgroundColor);
        //         }
        //     }
        // }
    }

    private getPositionByPinToEdge(pinToEdge: string, width: number, height: number): Vector2d {
        const pos = {x: 0, y: 0};
        switch (pinToEdge) {
            case 'top_right':
                pos.x = width;
                break;
            case 'bottom_left':
                pos.y = -1 * height;
                pos.y = height;
                break;
            case 'bottom_right':
                pos.x = width;
                pos.y = height;
                break;
            case 'middle':
                pos.x = Math.round(width / 2);
                pos.y = Math.round(height / 2);
                break;
            case 'top_center':
                pos.x = Math.round(width / 2);
                break;
            case 'bottom_center':
                pos.x = Math.round(width / 2);
                pos.y = height;
                break;
            case 'left_center':
                pos.y = Math.round(height / 2);
                break;
            case 'right_center':
                pos.x = width;
                pos.y = Math.round(height / 2);
                break;
            default:
                break;
        }

        return pos;
    }

    private process(data: PainterPointInterface, rect: Konva.Rect, point: Konva.Group, mainText: Konva.Shape, textScale: number, padding: number): Konva.Group {
        const textWidth = mainText.width() * textScale;
        const textHeight = mainText.height() * textScale;

        const rectWidth = textWidth + padding * 2;
        const rectHeight = textHeight + padding * 2;
        if (rect) {
            rect.width(rectWidth);
            rect.height(rectHeight);
            point.add(rect);
        }

        point.add(mainText);
        if (data.skewX) {
            point.skewX(Math.tan( Number(data.skewX) * Math.PI/180 ));
        }
        if (data.skewY) {
            point.skewY(Math.tan( Number(data.skewY) * Math.PI/180 ));
        }
        // point.position(this.getPositionByPinToEdge(data.pin_to_edge, rectWidth, rectHeight));
        const off = this.getPositionByPinToEdge(data.pin_to_edge, rectWidth, rectHeight);
        point.offsetX(off.x);
        point.offsetY(off.y);
        // point.add(point);
        return point;
    }

    // private async getTextCanvas(id: string, content: string, bgColor?: string): Promise<string> {
    //     if (!DiggerUtility.isHTML(content)) {
    //         return null;
    //     }
    //     const cacheService: Map<string, string> = this.getCacheService();
    //     const key = content + bgColor;
    //     if (cacheService.has(key)) {
    //         return cacheService.get(key);
    //     }
    //     const tmpContainer = document.getElementById(id);
    //     if (!tmpContainer || !tmpContainer.clientWidth || !tmpContainer.clientHeight) {
    //         return null;
    //     }
    //     return new Promise((resolve, reject) => {
    //         html2canvas(tmpContainer, {
    //             backgroundColor: bgColor ?? null,
    //             width: tmpContainer.clientWidth,
    //             height: tmpContainer.clientHeight,
    //             allowTaint: true,
    //             scale: 2,
    //         })
    //             .then(canvas => {
    //                 resolve(canvas.toDataURL('image/png', 1));
    //             })
    //             .catch(err => {
    //                 reject(err);
    //             })
    //         ;
    //     });
    // }
    //
    // private getCacheService(): Map<string, string> {
    //     if (!(window as any).appCacheService) {
    //         (window as any).appCacheService = new Map<string, string>();
    //     }
    //     return (window as any).appCacheService;
    // }

    initEvents(point: Konva.Group, config: PainterConfigInterface): Konva.Group {
        point.on('click', () => {
            if (config.events?.pointClick) {
                config.events.pointClick(point.id());
            }
        });
        point.on('mouseenter', () => {
            point.getStage().container().style.cursor = 'pointer';
        });
        point.on('mouseleave', () => {
            point.getStage().container().style.cursor = 'default';
        });
        return point;
    }
}
