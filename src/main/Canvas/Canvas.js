import CanvasComponent from "../../CanvasComponent";
import styles from "../Canvas/Canvas.module.scss";
import Scene from "../utils/Scene";
import Vector2 from "../utils/Vector2";
import Grid from "../utils/Grid";
import {Graph} from "../utils/graph/Graph";

const Canvas = function (properties) {

    let scene = new Scene();
    let contextObject;
    const canvasParams = new Vector2(properties.size.width, properties.size.height);
    const gridSize = new Vector2(10000, 10000);

    properties.setFindFunction(function () {
        const graph = contextObject.baseObjectContainer.findOfType(Graph)[0];
        if (graph == null) {
            return;
        }
        scene.scale = canvasParams.maxCoordinate / graph.size.maxCoordinate;
        scene.transform = graph.center.multiply(-1 * scene.scale).add(canvasParams.divide(2));
    });

    function onStart(context) {
        contextObject = context;
        properties.setScene(scene);
        const grid = new Grid(canvasParams.divide(2).subtract(gridSize.divide(2)),
            gridSize.x, gridSize.y, 100);
        context.add(grid);
        properties.setGrid(grid);
        properties.setBaseObjectContainer(context.baseObjectContainer);
    }

    function onDraw(context) {
        context.clearAll();
        context.draw(scene.transform, scene.scale);
    }

    return new CanvasComponent({
        ...properties,
        attributes: {
            className: styles.canvas
        },
        eventHandlers: [
            { name: 'start', handler: onStart },
            { name: 'draw', handler: onDraw },
            { name: 'mousemove', handler: (event) => scene.onMouseMove(event) },
            { name: 'mousedown', handler: (event) => scene.onMouseDown(event) },
            { name: 'mouseup', handler: () => scene.onMouseUp() },
            { name: 'wheel', handler: (event) => scene.onMouseWheel(event) },
        ]
    });

}

export default Canvas;