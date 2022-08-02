import Component from "../../Component";
import classes from './Menu.module.scss';
import Button from "../Button/Button";
import EventComponent from "../../EventComponent";

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
                    new Button({
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
                    new Button({
                        attributes: {
                            style: 'height: 3rem;'
                        },
                        children: [
                            'S-T minimum cut'
                        ]
                    }),
                    new Button({
                        attributes: {
                            style: 'height: 3rem;',
                            disabled: true
                        },
                        children: [
                            'To be continued...'
                        ]
                    }),
                    new Button({
                        attributes: {
                            style: 'height: 3rem;',
                            disabled: true
                        },
                        children: [
                            'To be continued...'
                        ]
                    }),
                    new Button({
                        attributes: {
                            style: 'height: 3rem;',
                            disabled: true
                        },
                        children: [
                            'To be continued...'
                        ]
                    }),
                ]
            })
        ]
    });

    return component;

}

export default Menu;