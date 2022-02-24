import { PainterPointInterface, TooltipConfig } from '../painter.interface';
import Konva from 'konva';
import { DefaultColor } from '../painter.constants';
import { PointService } from './base.service';

export class LinkService extends PointService {
    async createShapes(data: PainterPointInterface): Promise<Konva.Group> {
        const primaryColor = data.primaryColor ?? DefaultColor;
        const point = new Konva.Group({
            id: data.id,
            name: 'Point',
            draggable: data.draggable,
            rotation: data.rotation,
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
        const textColor = '#ffffff';
        const paddingLeft = 15;
        const paddingTop = 14;
        let rectWidth = 160;
        const rectHeight = 40;
        const triangleWidth = 9;
        const triangleHeight = 20;

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
            fontFamily: 'Poppins',
            fontStyle: '400',
        });
        const icon: Konva.Group = this.iconLink();
        icon.setPosition({
            x: paddingLeft + simpleText.width() + 10,
            y: 8
        });
        icon.width(14);
        rectWidth = simpleText.width() + icon.width() + paddingLeft * 2;
        const rectWrapper = new Konva.Shape({
            sceneFunc: (context, shape) => {
                this.createWrapper(context, 0, 0, rectWidth, rectHeight, [8, 8, 8, 8], triangleWidth, triangleHeight, tooltipPosition)
                context.fillStrokeShape(shape);
            },
            x: 0,
            y: 0,
            fill: '#0372FF',
            shadowColor: '#000000',
            shadowBlur: 9,
            shadowOffset: { x: 0, y: 3 },
            shadowOpacity: 0.5,
            name: 'RectWrapper',
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

    private iconLink(): Konva.Group {
        const group = new Konva.Group({
            x: 0,
            y: 0,
        });
        group.add(new Konva.Path({
            x: 0,
            y: 0,
            data:
                'M0.31858602,0.268109486 C0.691706792,-0.0792782832 1.25956615,-0.0867443695 1.64072036,0.232087943 L1.73189848,0.31858602 L13.0155,12.4380286 L1.70641335,23.7248399 C1.31550426,24.114979 0.68233959,24.1143548 0.292200472,23.7234457 C-0.0679279445,23.3626065 -0.0950982826,22.7953484 0.210313186,22.4033581 L0.293594623,22.3092328 L10.2351308,12.3865281 L0.268109486,1.68142195 C-0.0792782832,1.30830118 -0.0867443695,0.740441815 0.232087943,0.359287605 L0.31858602,0.268109486 Z',
            fill: '#ffffff',
        }));
        return group;
    }
}
