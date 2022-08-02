import EventComponent from "../../EventComponent";
import Component from "../../Component";
import classes from './Input.module.scss';
import LayoutError from "../LayoutError";

const Input = function (properties) {

    if (!['text', 'number'].includes(properties.type)) {
        throw new LayoutError(`Unsupported input type`);
    }

    function isValid(value) {
        if (value === true) {
            invalidSign.update({
                attributes: { style: 'display: none' }
            });
        } else {
            invalidSign.update({
                attributes: { style: 'display: block' }
            });
        }
    }

    if (properties.hasOwnProperty('setSetValidFunction')) {
        properties.setSetValidFunction((value) => isValid(value));
    }

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const name = capitalize(properties.name);

    const invalidSign = new Component('span', {
        attributes: {
            className: 'material-icon ' + classes.sign
        },
        children: [
            'error'
        ]
    });

    return new Component('div', {
        attributes: {
            className: classes.container,
            style: `width: ${properties.width};`
        },
        children: [
            new EventComponent('input', {
                eventHandlers: [
                    {
                        name: 'input',
                        handler: () => isValid(true)
                    }
                ],
                attributes: {
                    className: classes.input,
                    type: properties.type,
                    placeholder: name,
                    required: '',
                    style: (properties.hasOwnProperty('color') ? `color: ${properties.color};` : '')
                }
            }),
            new Component('label', {
                attributes: {
                    className: classes.label
                },
                children: [
                    name
                ]
            }),
           invalidSign
        ]
    });
}

export default Input;