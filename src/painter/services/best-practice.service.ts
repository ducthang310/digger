import { PainterPointInterface, TooltipConfig } from '../painter.interface';
import Konva from 'konva';
import { DefaultColor } from '../painter.constants';
import { PointService } from './base.service';

export class BestPracticeService extends PointService {
    createShapes(data: PainterPointInterface): Konva.Group {
        const primaryColor = data.primaryColor ?? DefaultColor;
        const point = new Konva.Group({
            id: data.id,
            name: 'Point',
            draggable: data.draggable,
        });
        point.add(this.createHotspot(data));

        if (data.text) {
            point.add(this.createToolTip({
                text: data.text,
                primaryColor: primaryColor,
                textColor: data.textColor
            }));
        }

        return point;
    }

    private createToolTip(tooltipConfig: TooltipConfig): Konva.Group {
        const primaryColor = tooltipConfig.primaryColor ?? DefaultColor;
        const textColor = tooltipConfig.textColor ?? '#ffffff';
        const paddingLeft = 15;
        const paddingTop = 17;
        let rectWidth = 160;
        const rectHeight = 40;
        const triangleWidth = 14;
        const triangleHeight = 7;

        const toolTip = new Konva.Group({
            name: 'Tooltip',
            x: 0,
            y: 0,
        });

        const simpleText = new Konva.Text({
            x: paddingLeft,
            y: paddingTop,
            text: tooltipConfig.text,
            fontSize: 14,
            fill: textColor,
            fontStyle: '400',
        });
        const radius = 8;
        const rect = new Konva.Rect({
            x: 0,
            y: 6,
            width: 160,
            height: 34,
            fill: primaryColor,
            shadowColor: '#BBBBBB',
            shadowBlur: 14,
            shadowOffset: { x: 0, y: 2 },
            shadowOpacity: 0.5,
            cornerRadius: radius,
        });

        let contentWidth = simpleText.width();
        const icon: Konva.Group = this.iconBestPractice();
        icon.setPosition({x: 12, y: 12});
        const iconWidth = 35;
        contentWidth += iconWidth;
        simpleText.x(10 + iconWidth);

        rectWidth = contentWidth + paddingLeft * 2;
        rect.width(rectWidth);

        const triangle = new Konva.Shape({
            sceneFunc: function (context, shape) {
                context.beginPath();
                context.moveTo((rectWidth - triangleWidth) / 2, rectHeight);
                context.lineTo((rectWidth + triangleWidth) / 2, rectHeight);
                context.lineTo(rectWidth / 2, rectHeight + triangleHeight);
                context.closePath();
                context.fillStrokeShape(shape);
            },
            fill: primaryColor,
            shadowColor: '#BBBBBB',
            shadowBlur: 5,
            shadowOffset: { x: 0, y: 2 },
            shadowOpacity: 0.25,
        });
        toolTip.add(rect);
        icon && toolTip.add(icon);
        toolTip.add(simpleText);
        toolTip.add(triangle);
        toolTip.setPosition({
            x: -1 * rectWidth / 2,
            y: -1 * (rectHeight + 26)
        });

        return toolTip;
    }

    private iconBestPractice(): Konva.Group {
        const group = new Konva.Group({
            x: 0,
            y: 0,
        });
        group.add(new Konva.Path({
            x: 0,
            y: 0,
            data:
                'M12,3 L1,9 L5,11.18 L5,17.18 L12,21 L19,17.18 L19,11.18 L21,10.09 L21,17 L23,17 L23,9 L12,3 Z M18.82,9 L12,12.72 L5.18,9 L12,5.28 L18.82,9 Z M17,15.99 L12,18.72 L7,15.99 L7,12.27 L12,15 L17,12.27 L17,15.99 Z',
            fill: '#ffffff',
        }));
        return group;
    }
}
