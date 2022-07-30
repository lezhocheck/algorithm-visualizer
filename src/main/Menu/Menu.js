import Component from "../../Component";
import classes from './Menu.module.scss';
import Button from "../Button/Button";
import EventComponent from "../../EventComponent";
import MenuItem from "./MenuItem";

const Menu = function (properties) {

    function enable() {
        component.update({
            attributes: {
                style: 'display: flex;'
            }
        });
    }

    properties.setEnableFunction(enable);

    function disable() {
        component.update({
            attributes: {
                className: classes.closing
            }
        });
        component.addEventHandler({
            name: 'animationend',
            handler: () => {
                component.update({
                    attributes: {
                        className: classes.container,
                        style: 'display: none'
                    }
                });
                component.removeEventHandler('animationend');
            }
        });
    }

    const component = new EventComponent('div', {
        attributes: {
            className: classes.container
        },
        eventHandlers: [],
        children: [
            new Component('div', {
                attributes: {
                    className: classes.header
                },
                children: [
                    new Component('span', {
                        attributes: {
                            className: classes.nameText
                        },
                        children: [
                            'Algorithm visualizer'
                        ]
                    }),
                    new Button({width: 'auto',
                        height: 'auto',
                        onClick: disable,
                        children: [
                            new Component('span', {
                                attributes: {
                                    className: 'material-icon'
                                },
                                children: [
                                    'arrow_back'
                                ]
                            })
                        ]
                    })
                ]
            }),
            new Component('div', {
                attributes: {
                    className: classes.elementsContainer
                },
                children: [
                    new MenuItem({
                        text: 'S-T minimum cut',
                        active: true
                    }),
                    new MenuItem({
                        text: 'To be continued...',
                        active: false
                    }),
                    new MenuItem({
                        text: 'To be continued...',
                        active: false
                    }),
                    new MenuItem({
                        text: 'To be continued...',
                        active: false
                    })
                ]
            })
        ]
    });

    return component;

}

export default Menu;