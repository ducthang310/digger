import { PainterConfigInterface, PainterPointInterface, TooltipConfig } from '../painter.interface';
import Konva from 'konva';
import { DefaultColor } from '../painter.constants';
import { PointService } from './base.service';

export class BestPracticeService extends PointService {
    async createShapes(data: PainterPointInterface): Promise<Konva.Group> {
        const primaryColor = data.primaryColor ?? DefaultColor;
        const point = new Konva.Group({
            id: data.id,
            name: 'Point',
            draggable: data.draggable,
        });
        const iconBase64 = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTAwcHgiIGhlaWdodD0iMTAwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPmJlc3QtcHJhY3RpY2U8L3RpdGxlPgogICAgPGRlZnM+CiAgICAgICAgPGZpbHRlciB4PSItMjguNyUiIHk9Ii0yOC43JSIgd2lkdGg9IjE1Ny4zJSIgaGVpZ2h0PSIxNTcuMyUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgaWQ9ImZpbHRlci0xIj4KICAgICAgICAgICAgPGZlR2F1c3NpYW5CbHVyIHN0ZERldmlhdGlvbj0iNSIgaW49IlNvdXJjZUdyYXBoaWMiPjwvZmVHYXVzc2lhbkJsdXI+CiAgICAgICAgPC9maWx0ZXI+CiAgICA8L2RlZnM+CiAgICA8ZyBpZD0iYmVzdC1wcmFjdGljZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGNpcmNsZSBpZD0iaGFsbyIgY3g9IjUwIiBjeT0iNTAiIHI9IjUwIj48L2NpcmNsZT4KICAgICAgICA8Y2lyY2xlIGlkPSJPdmFsLUNvcHktMiIgZmlsbC1vcGFjaXR5PSIwLjUwMDI0NTg0OCIgZmlsbD0iIzIxNzdEQiIgZmlsdGVyPSJ1cmwoI2ZpbHRlci0xKSIgY3g9IjUwLjE2Mjc5MDciIGN5PSI1MC4xNjI3OTA3IiByPSIyNi4xNjI3OTA3Ij48L2NpcmNsZT4KICAgICAgICA8cG9seWdvbiBpZD0iU3RhciIgZmlsbD0iI0ZGRkZGRiIgcG9pbnRzPSI1MCA2NC45MjUxMzAyIDQ1LjU0OTU4MTMgNjkuNDk4NTU4MiA0My41MjQyMjg3IDYzLjQ0NzA3NzcgMzcuNTMwMjA0IDY1LjYzNjYyOTYgMzguMzMxMDYzMyA1OS4zMDU2NjY1IDMxLjk4MDYyMjYgNTguNjc3Njc0OCAzNS40NDkwNzQgNTMuMzIxMTUzOSAzMCA1MCAzNS40NDkwNzQgNDYuNjc4ODQ2MSAzMS45ODA2MjI2IDQxLjMyMjMyNTIgMzguMzMxMDYzMyA0MC42OTQzMzM1IDM3LjUzMDIwNCAzNC4zNjMzNzA0IDQzLjUyNDIyODcgMzYuNTUyOTIyMyA0NS41NDk1ODEzIDMwLjUwMTQ0MTggNTAgMzUuMDc0ODY5OCA1NC40NTA0MTg3IDMwLjUwMTQ0MTggNTYuNDc1NzcxMyAzNi41NTI5MjIzIDYyLjQ2OTc5NiAzNC4zNjMzNzA0IDYxLjY2ODkzNjcgNDAuNjk0MzMzNSA2OC4wMTkzNzc0IDQxLjMyMjMyNTIgNjQuNTUwOTI2IDQ2LjY3ODg0NjEgNzAgNTAgNjQuNTUwOTI2IDUzLjMyMTE1MzkgNjguMDE5Mzc3NCA1OC42Nzc2NzQ4IDYxLjY2ODkzNjcgNTkuMzA1NjY2NSA2Mi40Njk3OTYgNjUuNjM2NjI5NiA1Ni40NzU3NzEzIDYzLjQ0NzA3NzcgNTQuNDUwNDE4NyA2OS40OTg1NTgyIj48L3BvbHlnb24+CiAgICAgICAgPHBvbHlsaW5lIGlkPSJQYXRoLTgiIHN0cm9rZT0iIzAzNzJGRiIgc3Ryb2tlLXdpZHRoPSIzIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHBvaW50cz0iNDQgNTAuOTUzNDE5NiA0OC4xNjM1MDY0IDU1LjIgNTYuOTIyNDY3MSA0NCI+PC9wb2x5bGluZT4KICAgIDwvZz4KPC9zdmc+';
        point.add(await this.createIcon(data, iconBase64));

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
        const primaryColor = '#ffffff';
        const textColor = tooltipConfig.primaryColor ?? '#ffffff';
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
            fontStyle: '400',
            fontFamily: 'Poppins',
        });

        const contentWidth = simpleText.width();
        // const icon: Konva.Group = this.iconBestPractice();
        // icon.setPosition({x: 9, y: 8});
        // const iconWidth = 35;
        // contentWidth += iconWidth;
        // simpleText.x(8 + iconWidth);
        rectWidth = contentWidth + paddingLeft * 2;
        const rectWrapper = new Konva.Shape({
            sceneFunc: (context, shape) => {
                this.createWrapper(context, 0, 0, rectWidth, rectHeight, [8, 8, 8, 8], triangleWidth, triangleHeight, tooltipPosition);
                context.fillStrokeShape(shape);
            },
            x: 0,
            y: 0,
            fill: primaryColor,
            shadowColor: '#000000',
            shadowBlur: 9,
            shadowOffset: { x: 0, y: 3 },
            shadowOpacity: 0.5,
            // strokeWidth: 1,
            // stroke: primaryColor,
            name: 'RectWrapper'
        });
        rectWrapper.width(rectWidth);
        rectWrapper.height(rectHeight);

        toolTip.add(rectWrapper);
        // icon && toolTip.add(icon);
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

    // private iconBestPractice(): Konva.Group {
    //     const group = new Konva.Group({
    //         x: 0,
    //         y: 0,
    //     });
    //     group.add(new Konva.Path({
    //         x: 0,
    //         y: 0,
    //         data:
    //             'M12,3 L1,9 L5,11.18 L5,17.18 L12,21 L19,17.18 L19,11.18 L21,10.09 L21,17 L23,17 L23,9 L12,3 Z M18.82,9 L12,12.72 L5.18,9 L12,5.28 L18.82,9 Z M17,15.99 L12,18.72 L7,15.99 L7,12.27 L12,15 L17,12.27 L17,15.99 Z',
    //         fill: '#ffffff',
    //     }));
    //     return group;
    // }

    initEvents(point: Konva.Group, config: PainterConfigInterface): Konva.Group {
        point.on('click', (evt) => {
            if (config.events?.pointClick && evt.target.name() === 'PointCircle') {
                config.events.pointClick(point.id());
            } else if (config.events?.tooltipClick && evt.target.name() === 'Tooltip') {
                config.events.tooltipClick(point.id());
            }
        });
        point.on('mouseenter', () => {
            point.getStage().container().style.cursor = 'pointer';
            if (config.events && config.events.pointMouseenter) {
                config.events.pointMouseenter(point.id(), point.getPosition());
            }
        });
        point.on('mouseleave', () => {
            point.getStage().container().style.cursor = 'default';
            if (config.events && config.events.pointMouseleave) {
                config.events.pointMouseleave(point.id(), point.getPosition());
            }
        });
        return point;
    }
}
