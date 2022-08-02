import Vector2 from "./Vector2";
import UtilsError from "./UtilsError";
import EdgeView from "./graph/EdgeView";
import Validator from "../../Validator";

export default class Scene {

    #mousePosition;
    #mouseClickedPosition;
    #scale;
    #transform;

    #dragStartPosition;
    #dragEndPosition;
    #mouseButton;

    static #CAMERA_ZOOM_SENSITIVITY = 0.05;
    static #DETECTION_THRESHOLD = 10;
    static #MIN_SCALE = 0.01;
    static #MAX_SCALE = 100;

    #selectedEdgesSet;

    constructor() {
        this.#mousePosition = new Vector2(0, 0);
        this.#scale = 1;
        this.#transform = new Vector2(0, 0);
        this.#mouseButton = null;
        this.#selectedEdgesSet = new Set();
    }

    get scale() {
        return this.#scale;
    }

    set scale(value) {
        Validator.checkInstance(UtilsError, Number, {scale: value});
        this.#scale = value;
    }

    set transform(value) {
        Validator.checkInstance(UtilsError, Vector2, {transform: value});
        this.#transform = value;
    }
    get transform() {
        return this.#transform;
    }

    // In world coordinates
    get mousePosition() {
        return this.#mousePosition.subtract(this.#transform).divide(this.#scale);
    }

    onMouseDown(event) {
        this.#mouseButton = event.which;
        this.#mouseClickedPosition = this.#mousePosition;
        this.#dragStartPosition = this.#mousePosition;
    }

    onMouseUp() {
        this.#mouseClickedPosition = null;
        this.#dragStartPosition = null;
        this.#dragEndPosition = null;
        this.#mouseButton = null;
    }

    onMouseDragged() {
        const distance = Vector2.distance(this.#mouseClickedPosition, this.#mousePosition);
        if (distance > Scene.#DETECTION_THRESHOLD) {
            this.#transform.add(this.#dragEndPosition.subtract(this.#dragStartPosition), true);
        }
    }

    onMouseMove(event) {
        this.#mousePosition = event;
        if (this.#dragStartPosition != null) {
            this.#dragEndPosition = this.#mousePosition;
            this.onMouseDragged();
            this.#dragStartPosition = this.#dragEndPosition;
        }
    }

    onMouseWheel(event) {
        const scaleFactor = event < 0 ? 1 + Scene.#CAMERA_ZOOM_SENSITIVITY : 1 / (1 + Scene.#CAMERA_ZOOM_SENSITIVITY);
        if (this.#scale * scaleFactor >= Scene.#MIN_SCALE && this.#scale * scaleFactor < Scene.#MAX_SCALE) {
            this.#scale *= scaleFactor;
            const a = this.#mousePosition.multiply(scaleFactor);
            const b = this.#transform.multiply(scaleFactor);
            this.#transform = this.#mousePosition.subtract(a).add(b);
        }
    }

    selectEdge(edgeView) {
        Validator.checkInstance(UtilsError, EdgeView, {edgeView: edgeView});
        if (this.#selectedEdgesSet.size === 0) {
            this.#selectedEdgesSet.add(edgeView);
        }
    }

    deselectEdge(edgeView) {
        Validator.checkInstance(UtilsError, EdgeView, {edgeView: edgeView});
        return this.#selectedEdgesSet.delete(edgeView);
    }

    hasEdge(edgeView) {
        Validator.checkInstance(UtilsError, EdgeView, {edgeView: edgeView});
        return this.#selectedEdgesSet.has(edgeView);
    }

    clearSelectedEdgesSet() {
        this.#selectedEdgesSet.clear();
    }

}