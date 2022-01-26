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
            }, data.tooltipPosition));
        }

        return point;
    }

    private createToolTip(tooltipConfig: TooltipConfig, tooltipPosition?: string): Konva.Group {
        tooltipPosition = tooltipPosition ? tooltipPosition : 'top';
        const primaryColor = tooltipConfig.primaryColor ?? DefaultColor;
        const textColor = tooltipConfig.textColor ?? '#ffffff';
        const paddingLeft = 10;
        const paddingTop = 14;
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
            fontFamily: 'Poppins',
        });

        let contentWidth = simpleText.width();
        const icon: Konva.Group = this.iconBestPractice();
        icon.setPosition({x: 9, y: 8});
        const iconWidth = 35;
        contentWidth += iconWidth;
        simpleText.x(8 + iconWidth);
        rectWidth = contentWidth + 18;
        const rectWrapper = new Konva.Shape({
            sceneFunc: (context, shape) => {
                this.createWrapper(context, 0, 0, rectWidth, rectHeight, [8, 8, 8, 8], triangleWidth, triangleHeight, tooltipPosition);
                context.fillStrokeShape(shape);
            },
            x: 0,
            y: 0,
            fill: primaryColor,
            shadowColor: '#BBBBBB',
            shadowBlur: 14,
            shadowOffset: { x: 0, y: 2 },
            shadowOpacity: 0.5,
            strokeWidth: 1,
            stroke: primaryColor,
            name: 'RectWrapper'
        });
        rectWrapper.width(rectWidth);
        rectWrapper.height(rectHeight);

        toolTip.add(rectWrapper);
        icon && toolTip.add(icon);
        toolTip.add(simpleText);
        toolTip.setPosition(this.getTooltipPosition(rectWrapper, tooltipPosition));

        return toolTip;
    }

    changePointProperties(pointData: PainterPointInterface, point: Konva.Group): void {
        point.position(pointData.position);
        const toolTip: Konva.Group = point.findOne('.Tooltip');
        let wrapper: Konva.Rect;
        if (toolTip) {
            wrapper = toolTip.findOne('.RectWrapper');
        }
        if (wrapper) {
            toolTip.setPosition(this.getTooltipPosition(wrapper, pointData.tooltipPosition));
        }
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
