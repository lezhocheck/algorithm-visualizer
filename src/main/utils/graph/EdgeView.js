import {Edge} from "./AdjacencyTable";
import UtilsError from "../UtilsError";
import Colors from "../Colors";
import Line from "../Line";
import Vector2 from "../Vector2";
import BaseObject from "../BaseObject";
import Scene from "../Scene";
import Text from "../Text";
import {GraphNode} from "./Graph";
import Validator from "../../../Validator";

export default class EdgeView extends BaseObject {

    #start; #end;
    #scene;
    #edge;
    #line;
    #text;
    #defaultEdgeColor;

    static #DEFAULT_COLOR = new Colors('#99999955');
    static #SELECTED_COLOR = new Colors('#15650f');
    static #SELECTED_TEXT_COLOR = '#33b416';
    static #WIDTH = 3;
    static #ARROW_SIZE = 15;
    static #EDGE_DETECTION_OFFSET = 0.1;

    constructor(start, end, scene, edge) {
        Validator.checkInstance(UtilsError, GraphNode, {start: start}, {end: end});
        super(start.position);
        Validator.checkInstance(UtilsError, Scene, {scene: scene});
        Validator.checkInstance(UtilsError, Edge, {edge: edge});
        this.#start = start;
        this.#end = end;
        this.#scene = scene;
        this.#edge = edge;
        this.#defaultEdgeColor = EdgeView.#DEFAULT_COLOR;
        this.#line = new Line(this.position, end.position, this.#defaultEdgeColor, EdgeView.#WIDTH);
        this.#text = new Text(this.position.add(end.position).divide(2), edge.weight.toString(),
            new Colors(null, this.#defaultEdgeColor.stroke));
    }

    get startGraphNode() { return this.#start; }
    get endGraphNode() { return this.#end; }
    get edge() { return this.#edge; }

    #update(context) {
        const lineLength = Vector2.distance(this.#line.position, this.#line.end);
        const d1 = Vector2.distance(this.#scene.mousePosition, this.#line.position);
        const d2 = Vector2.distance(this.#scene.mousePosition, this.#line.end);

        const detectionOffsetAdaptive = context.convertToAdaptive(EdgeView.#EDGE_DETECTION_OFFSET);
        const isMouseIn = d1 + d2 >= lineLength - detectionOffsetAdaptive &&
            d1 + d2 <= lineLength + detectionOffsetAdaptive;
        isMouseIn ? this.#scene.selectEdge(this) : this.#scene.deselectEdge(this);

        if (this.#scene.hasEdge(this)) {
            this.#line.colors = EdgeView.#SELECTED_COLOR;
            this.#text.colors.fill = EdgeView.#SELECTED_TEXT_COLOR;
            this.#text.size = 50;
            this.#text.position = this.#scene.mousePosition;
        } else {
            this.#line.colors = this.#defaultEdgeColor;
            this.#text.colors.fill = this.#defaultEdgeColor.stroke;
            this.#text.size = 20;
            this.#text.position = this.position.add(this.#line.end).divide(2);
        }
    }

    set defaultColor(value) {
        Validator.checkInstance(UtilsError, Colors, {defaultColor: value});
        this.#defaultEdgeColor = value;
    }

    #drawArrow(context, start, end, size) {
        const adaptiveSize = context.convertToAdaptive(size);
        function rotate(vector, angle) {
            let x = adaptiveSize * Math.cos(angle) + vector.x;
            let y = adaptiveSize * Math.sin(angle) + vector.y;
            return new Vector2(x, y);
        }

        const offset = GraphNode.RADIUS + size;
        const delta = (this.#line.length - context.convertToAdaptive(offset)) / this.#line.length;
        if (delta < 0) {
            return;
        }

        let offsetEnd = start.add(end.subtract(start).multiply(delta));

        context.fillColor(this.#line.colors.stroke);
        context.beginPath();
        const deltaAngle = 2 / 3 * Math.PI;
        let angle = Math.atan2(offsetEnd.y - start.y, offsetEnd.x - start.x);
        let vector = rotate(offsetEnd, angle);
        context.moveTo(vector);
        angle += deltaAngle;
        vector = rotate(offsetEnd, angle);
        context.lineTo(vector);
        angle += deltaAngle;
        vector = rotate(offsetEnd, angle);
        context.lineTo(vector);
        context.endPath();
        context.fill();
    }

    draw(context) {
        this.#update(context);
        this.#line.draw(context);
        this.#drawArrow(context, this.#line.position, this.#line.end, EdgeView.#ARROW_SIZE);
        this.#drawArrow(context, this.#line.end, this.#line.position, EdgeView.#ARROW_SIZE);
        this.#text.draw(context);
    }

}