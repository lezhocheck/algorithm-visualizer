import EventComponent from "../../EventComponent";
import classes from "./Button.module.scss";
import Validator from "../../Validator";
import LayoutError from "../LayoutError";

const Button = function (properties) {

    let disabled = false;

    if (properties.hasOwnProperty('disabled') && properties.disabled === true) {
        disabled = true;
    }

    if (properties.hasOwnProperty('setEnabled')) {
        properties.setEnabled((value) => {
            Validator.checkInstance(LayoutError, Boolean, {value: value});
            disabled = !value;
            component.update({
                attributes: {
                    disabled: disabled
                }
            });
            if (disabled === false) {
                component.removeAttribute('disabled');
            }
        });
    }

    function onButtonClick() {
        if (disabled === true) {
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

    if (disabled === true) {
        component.update({
            attributes: {
                disabled: disabled
            }
        });
    }

    return component;

};

export default Button;