import {AdjacencyBase} from "./AdjacencyTable";
import UtilsError from "../UtilsError";
import Circle from "../Circle";
import Text from "../Text";
import Colors from "../Colors";
import Vector2 from "../Vector2";
import BaseObject from "../BaseObject";
import EdgeView from "./EdgeView";
import Scene from "../Scene";
import Grid from "../Grid";
import Validator from "../../../Validator";

class GraphNode extends BaseObject {

    static RADIUS = 40;
    static #TEXT_COLORS = new Colors(null, '#ffffff');
    static #TYPES_MAP = {
        normal: new Colors(null, '#090f1c'),
        red: new Colors(null, '#ff0000'),
        blue: new Colors(null, '#0000ff')
    };

    #circle;
    #text;
    #id;

    constructor(position, id, type = 'normal') {
        if (!Object.keys(GraphNode.#TYPES_MAP).includes(type)) {
            throw new UtilsError(`Unknown type '${type}'`);
        }
        super(position);
        this.#id = id;
        this.#circle = new Circle(position, GraphNode.RADIUS, GraphNode.#TYPES_MAP[type]);
        this.#text = new Text(position, id.toString(), GraphNode.#TEXT_COLORS);
    }

    set type(type) {
        if (!Object.keys(GraphNode.#TYPES_MAP).includes(type)) {
            throw new UtilsError(`Unknown type '${type}'`);
        }
        this.#circle.colors = GraphNode.#TYPES_MAP[type];
    }

    get id() {
        return this.#id;
    }

    draw(context) {
        this.#circle.draw(context);
        this.#text.draw(context);
    }
}

class Graph extends BaseObject {

    #adjacencyBase;
    #edgeViews;
    #graphNodes;
    #size;
    #s;
    #t;

    constructor(grid, scene, adjacencyBase, s, t) {
        Validator.checkInstance(UtilsError, Grid, {grid: grid});
        Validator.checkInstance(UtilsError, Scene, {scene: scene});
        Validator.checkInstance(UtilsError, AdjacencyBase, {adjacencyBase: adjacencyBase});
        Validator.checkInstance(UtilsError, Number, {s: s}, {t: t});

        const vertices = adjacencyBase.getVertices();
        const edges = adjacencyBase.getEdges();

        if (!vertices.includes(s) || !vertices.includes(t)) {
            throw UtilsError(`Unknown 's' or 't'`);
        }

        const radius = vertices.length * GraphNode.RADIUS / 2;
        super(grid.center.subtract(radius));

        this.#adjacencyBase = adjacencyBase;
        this.#s = s;
        this.#t = t;

        const center = this.position.add(radius);
        this.#size = radius * 2;
        let positions = {};

        for (const vertex of vertices) {
            const r = radius * Math.sqrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const x = center.x + r * Math.cos(theta);
            const y = center.y + r * Math.sin(theta);
            positions[vertex] = new Vector2(x, y);
        }

        this.#edgeViews = [];
        this.#graphNodes = [];

        for (const vertex of vertices) {
            let node = new GraphNode(positions[vertex], vertex, 'normal');
            if (vertex === this.#s) {
                node.type = 'blue';
            } else if (vertex === this.#t) {
                node.type = 'red';
            }
            this.#graphNodes.push(node);
        }

        for (const edge of edges) {
            const startNode = this.#graphNodes.find(x => x.id === edge.startVertex);
            const endNode = this.#graphNodes.find(x => x.id === edge.endVertex);
            Validator.checkInstance(UtilsError, GraphNode, {startNode: startNode}, {endNode: endNode});
            const edgeView = new EdgeView(startNode, endNode, scene, edge);
            this.#edgeViews.push(edgeView);
        }

    }

    get size() { return new Vector2(this.#size, this.#size); }
    get center() { return this.position.add(this.size.divide(2)); }
    get observer() { return this.#adjacencyBase.observer; }

    updateEdges(condition, colors, save = true) {
        Validator.checkInstance(UtilsError, Function, {condition: condition});
        Validator.checkInstance(UtilsError, Colors, {colors: colors});
        for (const edge of this.#edgeViews) {
            if (!save) {
                edge.mark(null);
            }
            if (condition(edge)) {
                edge.mark(colors);
            }
        }
    }

    calculateMinCut() {
        return this.#adjacencyBase.minCut(this.#s, this.#t);
    }

    draw(context) {
        for (const edgeView of this.#edgeViews) {
            edgeView.draw(context);
        }
        for (const graphNode of this.#graphNodes) {
            graphNode.draw(context);
        }
    }

}

export {GraphNode, Graph};
