import { PainterPointInterface, TooltipConfig } from '../painter.interface';
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
        const iconBase64 = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTAwcHgiIGhlaWdodD0iMTAwcHgiIHZpZXdCb3g9IjAgMCAxMDAgMTAwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPHRpdGxlPkdyb3VwIDYgQ29weSAzPC90aXRsZT4KICAgIDxkZWZzPgogICAgICAgIDxmaWx0ZXIgeD0iLTI4LjclIiB5PSItMjguNyUiIHdpZHRoPSIxNTcuMyUiIGhlaWdodD0iMTU3LjMlIiBmaWx0ZXJVbml0cz0ib2JqZWN0Qm91bmRpbmdCb3giIGlkPSJmaWx0ZXItMSI+CiAgICAgICAgICAgIDxmZUdhdXNzaWFuQmx1ciBzdGREZXZpYXRpb249IjUiIGluPSJTb3VyY2VHcmFwaGljIj48L2ZlR2F1c3NpYW5CbHVyPgogICAgICAgIDwvZmlsdGVyPgogICAgPC9kZWZzPgogICAgPGcgaWQ9IkhJLUZJLVVJIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KICAgICAgICA8ZyBpZD0iVXBkYXRlcyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTY1MS4wMDAwMDAsIC02OTguMDAwMDAwKSI+CiAgICAgICAgICAgIDxnIGlkPSJHcm91cC0xMy1Db3B5IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg2MjUuMDAwMDAwLCA2NjQuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICA8ZyBpZD0iR3JvdXAtNi1Db3B5LTMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDI2LjAwMDAwMCwgMzQuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbC1Db3B5IiBmaWxsLW9wYWNpdHk9IjAuMTI1MTYzODk5IiBmaWxsPSIjMkI4MUU2IiBjeD0iNTAiIGN5PSI1MCIgcj0iNTAiPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgICAgIDxjaXJjbGUgaWQ9Ik92YWwtQ29weS0yIiBmaWxsLW9wYWNpdHk9IjAuNTAwMjQ1ODQ4IiBmaWxsPSIjMjE3N0RCIiBmaWx0ZXI9InVybCgjZmlsdGVyLTEpIiBjeD0iNTAuMTYyNzkwNyIgY3k9IjUwLjE2Mjc5MDciIHI9IjI2LjE2Mjc5MDciPjwvY2lyY2xlPgogICAgICAgICAgICAgICAgICAgIDxnIGlkPSJQdWxzZS1Db3B5LTUiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMwLjAwMDAwMCwgMzAuMDAwMDAwKSI+CiAgICAgICAgICAgICAgICAgICAgICAgIDxwb2x5Z29uIGlkPSJTdGFyIiBmaWxsPSIjRkZGRkZGIiBwb2ludHM9IjIwIDM0LjkyNTEzMDIgMTUuNTQ5NTgxMyAzOS40OTg1NTgyIDEzLjUyNDIyODcgMzMuNDQ3MDc3NyA3LjUzMDIwMzk2IDM1LjYzNjYyOTYgOC4zMzEwNjMzMiAyOS4zMDU2NjY1IDEuOTgwNjIyNjQgMjguNjc3Njc0OCA1LjQ0OTA3Mzk3IDIzLjMyMTE1MzkgMCAyMCA1LjQ0OTA3Mzk3IDE2LjY3ODg0NjEgMS45ODA2MjI2NCAxMS4zMjIzMjUyIDguMzMxMDYzMzIgMTAuNjk0MzMzNSA3LjUzMDIwMzk2IDQuMzYzMzcwMzUgMTMuNTI0MjI4NyA2LjU1MjkyMjMzIDE1LjU0OTU4MTMgMC41MDE0NDE3NTYgMjAgNS4wNzQ4Njk3OSAyNC40NTA0MTg3IDAuNTAxNDQxNzU2IDI2LjQ3NTc3MTMgNi41NTI5MjIzMyAzMi40Njk3OTYgNC4zNjMzNzAzNSAzMS42Njg5MzY3IDEwLjY5NDMzMzUgMzguMDE5Mzc3NCAxMS4zMjIzMjUyIDM0LjU1MDkyNiAxNi42Nzg4NDYxIDQwIDIwIDM0LjU1MDkyNiAyMy4zMjExNTM5IDM4LjAxOTM3NzQgMjguNjc3Njc0OCAzMS42Njg5MzY3IDI5LjMwNTY2NjUgMzIuNDY5Nzk2IDM1LjYzNjYyOTYgMjYuNDc1NzcxMyAzMy40NDcwNzc3IDI0LjQ1MDQxODcgMzkuNDk4NTU4MiI+PC9wb2x5Z29uPgogICAgICAgICAgICAgICAgICAgICAgICA8cG9seWxpbmUgaWQ9IlBhdGgtOCIgc3Ryb2tlPSIjMDM3MkZGIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgcG9pbnRzPSIxMy4zOTUwNzQ0IDIxLjY1MDIyNjggMTcuNTU4NTgwOCAyNS44OTY4MDcxIDI2LjMxNzU0MTYgMTQuNjk2ODA3MSI+PC9wb2x5bGluZT4KICAgICAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgICAgICA8L2c+CiAgICAgICAgICAgIDwvZz4KICAgICAgICA8L2c+CiAgICA8L2c+Cjwvc3ZnPg==';
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
