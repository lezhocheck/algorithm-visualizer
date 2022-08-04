import Component from "../../Component";
import EdgeInput from "./EdgeInput";
import Button from "../Button/Button";
import classes from './EdgesInput.module.scss';

const EdgesInput = function (properties) {

    const edges = [];

    properties.setSetValidationDataFunction((value) => {
        for (const edge of edges) {
            edge.setValidationData(value);
        }
    });

    function update() {
        container.update({
            children: [
                ...edges.map(x => x.edgeInput)
            ]
        });
    }

    function onDeleteEdgeButtonClick(index) {
        let obj = edges.splice(index, 1)[0];
        container.removeChild(obj.edgeInput);

        for (const i in edges) {
            edges[i].setIndexFunction(parseInt(i));
        }
        update();
    }

    properties.setDisableAllHints(() => {
        edges.forEach(x => {
            x.setActiveFunction(true);
        });
    });

    properties.setClear(() => {
        container.removeChildren();
        edges.length = 0;
    });

    properties.setGetEdgesFunction(() => {
        const edgeMapped = edges.map(x => x.getEdgeFunction());
        const pull = [];
        const repetitions = [];
        let result = true;
        let i = 0;
        edgeMapped.forEach(x => {
            if (x != null) {
                let obj = pull.find(v => x.equals(v));
                if (obj != null) {
                    repetitions.push(x);
                    edges[i].setValidationData({ start: 0, vertexCount: 0 });
                    edges[i].getEdgeFunction();
                    result = false;
                } else {
                    pull.push(x);
                }
            }
            i++;
        });
        return result === true ? {result: true, data: edgeMapped} : {result: false, data: repetitions};
    });

    function addEdgeInput() {
        let getEdgeFunction;
        let setIndexFunction;
        let setValidationData;
        let setActive;
        const edgeInput = new EdgeInput({
            onDeleteButtonClick: onDeleteEdgeButtonClick,
            index: edges.length,
            setGetEdgeFunction: (value) => getEdgeFunction = value,
            setSetIndexFunction: (value) => setIndexFunction = value,
            setSetValidationDataFunction: (value) => setValidationData = value,
            setActiveFunction: (value) => setActive = value
        });
        edges.push({edgeInput: edgeInput, getEdgeFunction: getEdgeFunction,
            setIndexFunction: setIndexFunction,
            setValidationData: setValidationData, setActiveFunction: setActive});
        update();
    }

    const container = new Component('div', {
        attributes: {
            className: classes.container
        },
        children: []
    });

    return new Component('div', {
        children: [
            container,
            new Button({
                attributes: {
                    style: 'margin-left: 70%; margin-top: 1rem;'
                },
                onClick: addEdgeInput,
                children: [
                    new Component('span', {
                        attributes: {
                            className: 'material-icon'
                        },
                        children: [
                            'add'
                        ]
                    })
                ]
            })
        ]
    });

}

export default EdgesInput;