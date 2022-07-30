import Component from "../../Component";
import classes from './MenuItem.module.scss';

const MenuItem = function (properties) {

    const active = properties.active;

    const arrow = new Component('span', {
        attributes: {
            className: 'material-icon ' + classes.arrow
        },
        children: [
            'arrow_back'
        ]
    });

    const component = new Component('div', {
        attributes: {
            className: active === true ? classes.container : classes.disabled
        },
        children: [
            new Component('span', {
                attributes: {
                    className: active === true ? classes.nameText : classes.nameTextDisabled
                },
                children: [
                    properties.text
                ]
            }),
            arrow
        ]
    });

    if (active !== true) {
        component.removeChild(arrow);
    }

    return component;

}

export default MenuItem;