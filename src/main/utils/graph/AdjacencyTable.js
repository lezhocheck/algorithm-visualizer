import NotImplementedError from "../NotImplementedError";
import UtilsError from "../UtilsError";
import CodeObserver from "../CodeObserver";
import Validator from "../../../Validator";

class Edge {

    static MIN_WEIGHT = 1;
    static MAX_WEIGHT = 1000;

    constructor(startVertex, endVertex, weight = null) {
        Validator.checkInstance(UtilsError, Number, {startVertex: startVertex}, {endVertex: endVertex});
        Validator.checkInstance(UtilsError, [Number, null], {weight: weight});

        this.startVertex = startVertex;
        this.endVertex = endVertex;
        this.weight = weight;
    }

    equals(other) {
        if (!(other instanceof Edge)) {
            return false;
        }
        return (this.startVertex === other.startVertex &&
            this.endVertex === other.endVertex) || (
                this.startVertex === other.endVertex &&
                    this.endVertex === other.startVertex);
    }

}

class AdjacencyBase {

    addEdge(start, end, weight = null) { throw new NotImplementedError(); }
    hasEdge(startVertex, endVertex) { throw new NotImplementedError(); }
    getVertices() { throw new NotImplementedError(); }
    fillRandom() { throw new NotImplementedError(); }

}

class AdjacencyTable extends AdjacencyBase {

    #container;
    #startIndex;
    #vertexCount;
    #oriented;
    #observer;

    constructor(startIndex, vertexCount, observer, oriented = false) {
        Validator.checkInstance(UtilsError, Number, {vertexCount: vertexCount});
        Validator.checkInstance(UtilsError, Number, {startIndex: startIndex});
        if (vertexCount <= 0) {
            throw new UtilsError(`Parameter 'vertexCount' must be greater than '0'`);
        }

        Validator.checkInstance(UtilsError, CodeObserver, {observer: observer});
        Validator.checkInstance(UtilsError, Boolean, {oriented: oriented});

        super();

        this.#startIndex = startIndex;
        this.#vertexCount = vertexCount;
        this.#container = new Array(vertexCount);
        this.#oriented = oriented;

        for (let i = 0; i < vertexCount; i++) {
            let array = new Array(vertexCount);
            array.fill(0);
            this.#container[i] = array;
        }

        this.#observer = observer;
    }

    get observer() { return this.#observer; }

    traverseMatrix(callback) {
        for (let i = 0; i < this.#vertexCount; i++) {
            for (let j = 0; j < (this.#oriented === true ? this.#vertexCount : i); j++) {
                if (this.hasEdge(i + this.#startIndex, j + this.#startIndex)) {
                    const w = this.#container[i][j];
                    const start = i + this.#startIndex;
                    const end = j + this.#startIndex;
                    callback(start, end, w);
                }
            }
        }
    }

    hasEdge(startVertex, endVertex) {
        const start = startVertex - this.#startIndex;
        const end = endVertex - this.#startIndex;
        if (start < 0 || start >= this.#vertexCount ||
            end < 0 || end >= this.#vertexCount) {
            throw new UtilsError(`Invalid arguments`);
        }

        if (this.#oriented === true) {
            return this.#container[start][end] !== 0;
        }

        return this.#container[start][end] !== 0 && this.#container[end][start] !== 0;
    }

    addEdge(startVertex, endVertex, weight) {
        Validator.checkInstance(UtilsError, Number, {startVertex: startVertex});
        Validator.checkInstance(UtilsError, Number, {endVertex: endVertex});
        Validator.checkInstance(UtilsError, [Number, null], {weight: weight});
        const start = startVertex - this.#startIndex;
        const end = endVertex - this.#startIndex;

        if (start < 0 || start >= this.#vertexCount ||
            end < 0 || end >= this.#vertexCount || weight <= 0) {
            throw new UtilsError(`Invalid arguments`);
        }

        this.#container[start][end] = weight;
        if (this.#oriented === false) {
            this.#container[end][start] = weight;
        }
    }

    getEdges() {
        let result = [];
        this.traverseMatrix((start, end, w) => {
            result.push(new Edge(start, end, w));
        });
        return result;
    }

    #bfs(rGraph, s, t, parent) {
        let visited = new Array(rGraph.length).fill(false);
        let q = [];
        q.push(s);
        visited[s] = true;
        parent[s] = -1;
        while (q.length > 0) {
            let u = q.shift();
            for (let v = 0; v < rGraph.length; v++) {
                if (visited[v] === false && rGraph[u][v] > 0) {
                    q.push(v);
                    parent[v] = u;
                    visited[v] = true;
                    this.#observer.saveState('bfs', {start: v, end: u});
                }
            }
        }
        return visited[t] === true;
    }

    #dfs(rGraph, s, visited) {
        visited[s] = true;
        for (let i = 0; i < rGraph.length; i++) {
            if (rGraph[s][i] !== 0 && !visited[i]) {
                this.#dfs(rGraph, i, visited);
            }
        }
    }

    minCut(s, t) {
        Validator.checkInstance(UtilsError, Number, {s: s});
        Validator.checkInstance(UtilsError, Number, {t: t});
        return this.#minCut(s, t);
    }

    #minCut(s, t) {
        let u, v;
        let rGraph = JSON.parse(JSON.stringify(this.#container));
        let parent = new Array(rGraph.length);
        while (this.#bfs(rGraph, s, t, parent)) {
            // Find minimum residual capacity of the edges along the
            // path filled by BFS. Or we can say find the maximum flow
            // through the path found.
            let pathFlow = Infinity;
            for (v = t; v !== s; v = parent[v]) {
                u = parent[v];
                pathFlow = Math.min(pathFlow, rGraph[u][v]);
            }

            // update residual capacities of the edges and reverse edges
            // along the path
            for (v = t; v !== s; v = parent[v]) {
                u = parent[v];
                rGraph[u][v] -= pathFlow;
                rGraph[v][u] += pathFlow;
            }
        }

        // Flow is maximum now, find vertices reachable from s

        let visited = new Array(rGraph.length).fill(false);
        this.#dfs(rGraph, s, visited);

        // Print all edges that are from a reachable vertex to
        // non-reachable vertex in the original graph
        let minCutValue = 0;
        const edges = [];

        for (let i = 0; i < rGraph.length; i++) {
            for (let j = 0; j < rGraph.length; j++) {
                if (visited[i] && !visited[j] && this.#container[i][j] !== 0) {
                    const start = i + this.#startIndex;
                    const end = j + this.#startIndex;
                    edges.push(new Edge(start, end, this.#container[i][j]));
                    minCutValue += this.#container[i][j];
                }
            }
        }

        return {
            value: minCutValue,
            cutEdges: edges
        };
    }

    getVertices() {
        return [...Array(this.#vertexCount).keys()].map(x => x + this.#startIndex);
    }

    fillRandom() {
        const max = this.#vertexCount * 10;
        const edges = Math.trunc(Math.random() * max);
        for (let i = 0; i < edges; i++) {
            const a = Math.trunc(Math.random() * this.#vertexCount) + this.#startIndex;
            const b = Math.trunc(Math.random() * this.#vertexCount) + this.#startIndex;
            const w = Math.trunc(Math.random() * Edge.MAX_WEIGHT + Edge.MIN_WEIGHT);
            if (a !== b && this.hasEdge(a, b) === false) {
                this.addEdge(a, b, w);
            }
        }
    }

}

export {AdjacencyBase, Edge, AdjacencyTable};
