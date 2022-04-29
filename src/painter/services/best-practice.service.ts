import { PainterConfigInterface, PainterPointInterface } from '../painter.interface';
import Konva from 'konva';
import { PointService } from './base.service';
// import { ShapeConfig } from 'konva/lib/Shape';

export class BestPracticeService extends PointService {
    async createShapes(data: PainterPointInterface): Promise<Konva.Group> {
        const point = new Konva.Group({
            id: data.id,
            name: 'Point',
            draggable: data.draggable,
        });
        const iconBase64 = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMjBweCIgaGVpZ2h0PSIyMHB4IiB2aWV3Qm94PSIwIDAgMjAgMjAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayI+CiAgICA8dGl0bGU+SG90IFNwb3QgQmVzdCBQcmFjdGljZTwvdGl0bGU+CiAgICA8ZyBpZD0iSG90LVNwb3QtQmVzdC1QcmFjdGljZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCI+CiAgICAgICAgPGNpcmNsZSBpZD0iT3ZhbCIgc3Ryb2tlPSIjRkZGRkZGIiBmaWxsPSIjMDM3MkZGIiBjeD0iMTAiIGN5PSIxMCIgcj0iOS41Ij48L2NpcmNsZT4KICAgICAgICA8cG9seWxpbmUgaWQ9IlBhdGgtOCIgc3Ryb2tlPSIjRkZGRkZGIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgcG9pbnRzPSI2IDExLjM0NTg4NzMgOC41Nzc1MzAzMyAxNCAxNCA3Ij48L3BvbHlsaW5lPgogICAgPC9nPgo8L3N2Zz4=';
        point.add(await this.createIcon(data, iconBase64));

        if (data.text) {
            point.add(this.createText(data, data.tooltipPosition));
        }

        return point;
    }

    // private createToolTip(data: PainterPointInterface, tooltipPosition?: string): Konva.Group {
    //     tooltipPosition = tooltipPosition ? tooltipPosition : 'top';
    //     const primaryColor = '#ffffff';
    //     const textColor = data.primaryColor ?? '#ffffff';
    //     const paddingLeft = 12;
    //     const paddingTop = 14;
    //     let rectWidth = 160;
    //     const rectHeight = 40;
    //     const triangleWidth = 9;
    //     const triangleHeight = 20;
    //
    //     const toolTip = new Konva.Group({
    //         name: 'Tooltip',
    //         x: 0,
    //         y: 0,
    //     });
    //
    //     const simpleText = new Konva.Text({
    //         x: paddingLeft,
    //         y: paddingTop,
    //         text: data.text,
    //         fontSize: 14,
    //         fill: textColor,
    //         fontStyle: '400',
    //         fontFamily: 'Poppins',
    //     });
    //
    //     const contentWidth = simpleText.width();
    //     rectWidth = contentWidth + paddingLeft * 2;
    //
    //     const config: ShapeConfig = {};
    //     if (data.active) {
    //         config.strokeWidth = 3;
    //         config.stroke = '#0372FF';
    //     }
    //     const rectWrapper = new Konva.Shape({
    //         sceneFunc: (context, shape) => {
    //             const arrowWidth = data.active ? 0 : triangleWidth;
    //             const arrowHeight = data.active ? 0 : triangleHeight;
    //             this.createWrapper(context, 0, 0, rectWidth, rectHeight, [8, 8, 8, 8], arrowWidth, arrowHeight, tooltipPosition);
    //             context.fillStrokeShape(shape);
    //         },
    //         x: 0,
    //         y: 0,
    //         fill: primaryColor,
    //         shadowColor: '#000000',
    //         shadowBlur: 9,
    //         shadowOffset: { x: 0, y: 3 },
    //         shadowOpacity: 0.5,
    //         name: 'RectWrapper',
    //         ...config,
    //         shadowForStrokeEnabled: false,
    //     });
    //     rectWrapper.width(rectWidth);
    //     rectWrapper.height(rectHeight);
    //     toolTip.add(rectWrapper);
    //     let arrow: Konva.Shape;
    //     if (data.active) {
    //         arrow = new Konva.Shape({
    //             sceneFunc: (context, shape) => {
    //                 this.createArrow(context, 0, 0, triangleWidth, triangleHeight, tooltipPosition);
    //                 context.fillStrokeShape(shape);
    //             },
    //             x: 0,
    //             y: 0,
    //             fill: '#0372FF',
    //             name: 'PointArrow',
    //         });
    //         const arrowPos = this.getArrowPosition(rectWrapper, tooltipPosition, triangleWidth);
    //         arrow.setPosition(arrowPos);
    //     }
    //     arrow && toolTip.add(arrow);
    //     toolTip.add(simpleText);
    //     toolTip.setPosition(this.getTooltipPosition(rectWrapper, tooltipPosition));
    //
    //     return toolTip;
    // }

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
        point.on('click touchstart', (evt) => {
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
