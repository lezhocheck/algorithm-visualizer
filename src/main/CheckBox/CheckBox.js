import EventComponent from "../../EventComponent";
import Component from "../../Component";
import classes from './CheckBox.module.scss';

const CheckBox = function (properties) {

    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const name = capitalize(properties.name);

    const input = new EventComponent('input', {
        eventHandlers: [],
        attributes: {
            className: classes.checkbox,
            name: 'checkbox',
            type: 'checkbox',
        }
    });

    return new Component('div', {
        attributes: {
            className: classes.container
        },
        children: [
            input,
            new Component('label', {
                attributes: {
                    for: input.id
                },
                children: [
                    name
                ]
            })
        ]
    });
}

export default CheckBox;