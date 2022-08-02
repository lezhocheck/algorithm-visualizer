import EventComponent from "../../EventComponent";
import classes from "./Button.module.scss";
import Validator from "../../Validator";
import LayoutError from "../LayoutError";

const Button = function (properties) {

    if (properties.hasOwnProperty('setEnabled')) {
        properties.setEnabled((value) => {
            Validator.checkInstance(LayoutError, Boolean, {value: value});
            component.update({
                attributes: {
                    disabled: !value
                }
            });
            if (value === true) {
                component.removeAttribute('disabled');
            }
        });
    }

    function onButtonClick() {
        if (properties.hasOwnProperty('disabled') &&
            properties.disabled === true) {
            return;
        }
        if (properties.hasOwnProperty('onClick')) {
            properties.onClick();
        }
    }

    const component = new EventComponent('button', {
        eventHandlers: {
            name: 'click',
            handler: onButtonClick
        },
        attributes: {
            className: classes.button,
            ...properties.attributes
        },
        children: [
            ...properties.children
        ]
    });

    if (properties.hasOwnProperty('disabled') && properties.disabled === true) {
        component.update({
            attributes: {
                disabled: ''
            }
        });
    }

    return component;

};

export default Button;