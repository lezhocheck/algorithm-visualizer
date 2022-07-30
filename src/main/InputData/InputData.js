import Component from "../../Component";
import Input from "../Input/Input";
import Button from "../Button/Button";
import classes from './InputData.module.scss';
import CheckBox from "../CheckBox/CheckBox";
import {AdjacencyTable} from "../utils/graph/AdjacencyTable";
import {Graph} from "../utils/graph/Graph";
import EdgesInput from "../EdgeInput/EdgesInput";
import CodeObserver from "../utils/CodeObserver";

const InputData = function (properties) {

    const MAX_VERTICES = 300;

    const observer = new CodeObserver();
    let setValidationData
    let disableAll;
    let getEdges;

    function onSubmitClick() {
        const inputVerticesValue = parseInt(inputVertices.input.getChild(0).value);
        const inputStartIndexValue = parseInt(inputStartIndex.input.getChild(0).value);
        const inputSValue = parseInt(inputS.input.getChild(0).value);
        const inputTValue = parseInt(inputT.input.getChild(0).value);

        let valid = true;

        function notify(condition, input) {
            input.setValid(condition);
            valid = valid && condition;
        }

        notify(!isNaN(inputVerticesValue) && inputVerticesValue > 1 &&
            inputVerticesValue <= MAX_VERTICES, inputVertices);
        notify(!isNaN(inputStartIndexValue), inputStartIndex);
        notify(!isNaN(inputSValue) && inputSValue >= inputStartIndexValue &&
            inputSValue < inputStartIndexValue + inputVerticesValue, inputS);
        notify(!isNaN(inputTValue) && inputTValue >= inputStartIndexValue &&
            inputTValue < inputStartIndexValue + inputVerticesValue && inputTValue !== inputSValue, inputT);

        if (valid === false) {
            return;
        }

        const randomEdgesValue = randomEdgesCheckBox.getChild(0).checked;
        const adjacencyTable = new AdjacencyTable(inputStartIndexValue, inputVerticesValue, observer);
        if (randomEdgesValue === true) {
            adjacencyTable.fillRandom();
        } else {
            setValidationData({ start: inputStartIndexValue, vertexCount: inputVerticesValue });
            const {result, data} = getEdges();
            valid = valid && result;
            valid = valid && !data.includes(null);
            if (valid) {
                for (let i in data) {
                    const edge = data[i];
                    adjacencyTable.addEdge(edge.startVertex, edge.endVertex, edge.weight);
                }
            }
        }

        if (valid === false) {
            return;
        }

        disableAll();
        properties.closePopup();
        properties.scene.clearSelectedEdgesSet();
        properties.baseObjectContainer.clearAllOfType(Graph);
        observer.clear();
        const graph = new Graph(properties.grid, properties.scene, adjacencyTable, inputSValue, inputTValue);
        properties.baseObjectContainer.add(graph);
    }

    function getNumberInput(text, width, color = null) {
        let setValid;
        let props = {
            name: text,
            width: width,
            type: 'number',
            setSetValidFunction: (value) => setValid = value
        };
        if (color != null) {
            props['color'] = color;
        }
        return {input: new Input(props), setValid: setValid};
    }

    const inputVertices = getNumberInput('Number of vertices', '15rem');
    const inputStartIndex = getNumberInput('Start index', '15rem');
    const inputS = getNumberInput('S', '4rem', 'blue');
    const inputT = getNumberInput('T', '4rem', 'red');
    const randomEdgesCheckBox = new CheckBox({name: 'Random edges'});

    return new Component('div', {
        attributes: {
            className: classes.container
        },
        children: [
            new Component('h1', {
                attributes: {
                    className: classes.title
                },
                children: [
                    'Graph data'
                ]
            }),
            inputVertices.input,
            inputStartIndex.input,
            new Component('div', {
                attributes: {
                    style: 'display: flex; gap: 4rem;'
                },
                children: [
                    inputS.input,
                    inputT.input
                ]
            }),
            new EdgesInput({
                setSetValidationDataFunction: (value) => setValidationData = value,
                setGetEdgesFunction: (value) => getEdges = value,
                setDisableAll: (value) => disableAll = value
            }),
            randomEdgesCheckBox,
            new Button({
                width: '10rem',
                height: '4rem',
                onClick: onSubmitClick,
                children: [
                    'Build'
                ]
            })
        ]
    });

}

export default InputData;