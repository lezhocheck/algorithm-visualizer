import EventComponent from "../../EventComponent";
import styles from "./Button.module.scss";

const Button = function (properties) {

    function onButtonClick() {
        if (properties.hasOwnProperty('onClick')) {
            properties.onClick();
        }
    }

    return new EventComponent('button', {
        eventHandlers: {
            name: 'click',
            handler: onButtonClick
        },
        attributes: {
            className: styles.button,
            style: 'width: ' + properties.width + '; height: ' + properties.height,
            ...properties.attributes
        },
        children: [
            ...properties.children
        ]
    });

};

export default Button;