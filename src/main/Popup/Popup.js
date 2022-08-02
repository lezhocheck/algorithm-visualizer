import EventComponent from "../../EventComponent";
import classes from './Popup.module.scss';
import Component from "../../Component";
import Vector2 from "../utils/Vector2";
import Validator from "../../Validator";
import LayoutError from "../LayoutError";

const Popup = function (properties) {

    function close() {
        component.update({
            attributes: {
                style: `display: none;`
            }
        });
    }

    properties.closePopupFunction(close);

    properties.setShowFunction((position, text) => {
        Validator.checkInstance(LayoutError, Vector2, {position: position});
        component.update({
            attributes: {
                style: `display: inline-block; top: ${position.y}px; left: ${position.x}px;`
            }
        });
        component.getChild(0).update({
            children: [
                text
            ]
        });
    });

    const component = new EventComponent('div', {
        eventHandlers: {
            name: 'click',
            handler: close
        },
        attributes: {
            className: classes.popup
        },
        children: [
            new Component('span', {
                attributes: {
                    className: classes.popupText
                },
                children: [
                    'Hello!'
                ]
            })
        ]
    });

    return component;
}

export default Popup;