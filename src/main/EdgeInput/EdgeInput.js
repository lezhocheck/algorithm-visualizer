import Component from "../../Component";
import Input from "../Input/Input";
import {EdgeValidator, InvalidField} from "../utils/graph/EdgeValidator";
import classes from './EdgeInput.module.scss';
import Button from "../Button/Button";
import {Edge} from "../utils/graph/AdjacencyTable";
import UtilsError from "../utils/UtilsError";

const EdgeInput = function (properties) {

    let index = properties.index;
    let validationData;

    properties.setSetIndexFunction((value) => {
        index = value;
        const id = object.getChild(0);
        id.update({
            children:  [`${value + 1}:`]
        });
    });

    properties.setAbleFunction((value) => {
        if (typeof value !== 'boolean') {
            throw new UtilsError(`Expected boolean value`);
        }
        startInput.setValid(value);
        endInput.setValid(value);
        weightInput.setValid(value);
    });

    properties.setSetValidationDataFunction((value) => {
        validationData = value;
    });

    properties.setGetEdgeFunction(() => {
        const validator = new EdgeValidator(validationData.start,
            validationData.vertexCount, Edge.MIN_WEIGHT, Edge.MAX_WEIGHT + 1);

        const inputStartValue = startInput.input.getChild(0).value;
        const inputEndValue = endInput.input.getChild(0).value;
        const inputWeightValue = weightInput.input.getChild(0).value;

        const {result, errors} = validator.isValid(inputStartValue, inputEndValue, inputWeightValue);
        if (result === true) {
            return validator.get();
        } else {
            startInput.setValid(!errors.has(InvalidField.Start));
            endInput.setValid(!errors.has(InvalidField.End));
            weightInput.setValid(!errors.has(InvalidField.Weight));
            return null;
        }
    });

    function getInput(text, color = null) {
        let setValid;
        let props = {
            name: text,
            width: '5rem',
            type: 'number',
            setSetValidFunction: (value) => setValid = value
        };
        if (color != null) {
            props['color'] = color;
        }
        return {input: new Input(props), setValid: setValid};
    }

    const startInput = getInput('Start');
    const endInput = getInput('End');
    const weightInput = getInput('Weight');

    const object = new Component('div', {
        attributes: {
            className: classes.container
        },
        children: [
            new Component('span', {
                attributes: {
                    className: classes.text
                },
                children: [
                    (index + 1).toString() + ':'
                ]
            }),
            startInput.input,
            endInput.input,
            weightInput.input,
            new Button({
                width: '1.5rem',
                height: '1.5rem',
                onClick: () => properties.onDeleteButtonClick(index),
                children: [
                    new Component('span', {
                        attributes: {
                            style: 'font-size: 16px',
                            className: 'material-icon',
                        },
                        children: [
                            'delete'
                        ]
                    })
                ]
            })
        ]
    });
    return object;
}

export default EdgeInput;