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
        point.add(this.createHotspot(data, 7, false));

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
            y: 10
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
        const pos = this.getTooltipPosition(rectWrapper, tooltipPosition);

        switch (tooltipPosition) {
            case 'right':
                pos.x -= 12;
                break;
            case 'bottom':
                pos.y -= 12;
                break;
            case 'left':
                pos.x += 12;
                break;
            default:
                pos.y += 12;
        }
        toolTip.setPosition(pos);

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
                'M0.244774323,0.20599246 C0.531448498,-0.0609106705 0.967743195,-0.0666469744 1.26058958,0.178316578 L1.33064307,0.244774323 L10,9.55632021 L1.31106246,18.2281433 C1.01072126,18.5278929 0.524251539,18.5274133 0.224501919,18.2270721 C-0.0521900384,17.9498341 -0.0730654087,17.5140013 0.161586713,17.2128294 L0.225573065,17.1405116 L7.86380145,9.51675162 L0.20599246,1.2918612 C-0.0609106705,1.00518703 -0.0666469744,0.568892332 0.178316578,0.276045949 L0.244774323,0.20599246 Z',
            fill: '#ffffff',
        }));
        return group;
    }
}
