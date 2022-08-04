import UtilsError from "../UtilsError";
import {Edge} from "./AdjacencyTable";

const InvalidField = { Start: 0, End: 1, Weight: 2 };

class EdgeValidator {

    #startVertex;
    #vertexesCount;
    #minWeight;
    #maxWeight;

    #inputData = {
        start: null,
        end: null,
        weight: null
    };

    constructor(startVertex, vertexesCount, minWeight, maxWeight) {
        this.#startVertex = startVertex;
        this.#vertexesCount = vertexesCount;
        this.#minWeight = minWeight;
        this.#maxWeight = maxWeight;
    }

    isValid(startVertex, endVertex, weight) {
        this.#inputData.start = parseInt(startVertex);
        this.#inputData.end = parseInt(endVertex);
        this.#inputData.weight = parseInt(weight);
        const keys = Object.keys(this.#inputData);
        let result = true;
        let errorSet = new Set();
        for (const i in keys) {
            if (isNaN(this.#inputData[keys[i]])) {
                result = false;
                errorSet.add(InvalidField[Object.keys(InvalidField)[i]]);
            }
        }

        function process(condition, value) {
            if (condition === false) {
                result = false;
                errorSet.add(value);
            }
        }

        const isStartValid = startVertex >= this.#startVertex && startVertex < this.#startVertex + this.#vertexesCount;
        process(isStartValid, InvalidField.Start);
        const isEndValid = endVertex >= this.#startVertex && endVertex < this.#startVertex + this.#vertexesCount;
        process(isEndValid, InvalidField.End);
        const isWeightValid = weight >= this.#minWeight && weight < this.#maxWeight;
        process(isWeightValid, InvalidField.Weight);
        return {result: result, errors: errorSet};

    }

    get() {
        if (this.isValid(this.#inputData.start, this.#inputData.end, this.#inputData.weight).result === false) {
            throw new UtilsError(`Provided data is not valid`);
        }
        return new Edge(this.#inputData.start, this.#inputData.end, this.#inputData.weight);
    }

}

export {EdgeValidator, InvalidField};