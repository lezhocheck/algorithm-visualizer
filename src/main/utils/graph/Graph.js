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
    #observerState;

    constructor(grid, scene, adjacencyBase, s, t) {
        if (!(grid instanceof Grid)) {
            throw new UtilsError(`Unknown type of grid. Expected 'Grid'`);
        }
        if (!(scene instanceof Scene)) {
            throw new UtilsError(`Unknown type of scene. Expected 'Scene'`);
        }
        if (!(adjacencyBase instanceof AdjacencyBase)) {
            throw new UtilsError(`Unknown type of adjacencyBase. Expected 'AdjacencyBase'`);
        }
        if (typeof s !== 'number' || typeof t !== 'number') {
            throw new UtilsError(`Unknown type of parameter 's' or 't'. Expected 'number'`);
        }

        const vertices = adjacencyBase.getVertices();
        const edges = adjacencyBase.getEdges();

        if (!vertices.includes(s) || !vertices.includes(t)) {
            throw UtilsError(`Unknown 's' or 't'`);
        }

        const radius = vertices.length * GraphNode.RADIUS / 2;
        super(grid.center.subtract(radius));

        this.#adjacencyBase = adjacencyBase;
        this.#observerState = false;
        this.#s = s;
        this.#t = t;

        const center = this.position.add(radius);
        this.#size = radius * 2;
        let positions = {};

        for (let i in vertices) {
            const r = radius * Math.sqrt(Math.random());
            const theta = Math.random() * 2 * Math.PI;
            const x = center.x + r * Math.cos(theta);
            const y = center.y + r * Math.sin(theta);
            positions[vertices[i]] = new Vector2(x, y);
        }

        this.#edgeViews = [];
        this.#graphNodes = [];

        for (let i in vertices) {
            let node = new GraphNode(positions[vertices[i]], vertices[i], 'normal');
            if (vertices[i] === this.#s) {
                node.type = 'blue';
            } else if (vertices[i] === this.#t) {
                node.type = 'red';
            }
            this.#graphNodes.push(node);
        }

        for (let i in edges) {
            const edge = edges[i];
            const startNode = this.#graphNodes.find(x => x.id === edge.startVertex);
            const endNode = this.#graphNodes.find(x => x.id === edge.endVertex);
            if (startNode == null || endNode == null) {
                throw new UtilsError(`Unknown edge`);
            }
            const edgeView = new EdgeView(startNode, endNode, scene, edge);
            this.#edgeViews.push(edgeView);
        }

    }

    set enableObserver(value) {
        if (typeof value !== 'boolean') {
            throw new UtilsError(`Unknown type of observerState. Expected 'boolean'`);
        }
        this.#observerState = value;
    }

    get size() { return new Vector2(this.#size, this.#size); }
    get center() { return this.position.add(this.size.divide(2)); }
    get observer() { return this.#adjacencyBase.observer; }

    calculateMinCut() {
        const minCutResult = this.#adjacencyBase.minCut(this.#s, this.#t);
        for (let i in minCutResult.cutEdges) {
            const edge = minCutResult.cutEdges[i];
            const view = this.#edgeViews.find(x => x.edge.equals(edge));
            view.defaultColor = new Colors('rgba(255, 153, 0, 0.6)');
        }

        return minCutResult.value;
    }

    draw(context) {
        for (let i in this.#edgeViews) {
            const edgeView = this.#edgeViews[i];

            if (this.#observerState === true) {
                this.#adjacencyBase.observer.observe('bfs', (start, end) => {
                    if (edgeView.edge.startVertex === start && edgeView.edge.endVertex === end) {
                        edgeView.defaultColor = new Colors('red');
                    }
                });
            }

            edgeView.draw(context);
        }
        for (let i in this.#graphNodes) {
            this.#graphNodes[i].draw(context);
        }
    }

}

export {GraphNode, Graph};
