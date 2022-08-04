import Component from "../../Component";
import classes from "./Header.module.scss";
import Button from "../Button/Button";

const Header = function (properties) {

    const findButton = new Button({
        onClick: properties.onFindButtonClick,
        setEnabled: properties.setFindButtonEnabled,
        attributes: {
            disabled: true
        },
        children: [
            new Component('span', {
                attributes: {
                    className: 'material-icon'
                },
                children: [
                    'search'
                ]
            })
        ]
    });

    const leftButton = new Button({
        onClick: properties.left,
        setEnabled: properties.setLeftButtonEnabled,
        disabled: true,
        children: [
            new Component('span', {
                attributes: {
                    className: 'material-icon'
                },
                children: [
                    'arrow_left'
                ]
            })
        ]
    });

    const rightButton = new Button({
        onClick: properties.right,
        setEnabled: properties.setRightButtonEnabled,
        children: [
            new Component('span', {
                attributes: {
                    className: 'material-icon'
                },
                children: [
                    'arrow_right'
                ]
            })
        ]
    });

    return new Component('div', {
            attributes: {
                className: classes.header
            },
            children: [
                new Component('div', {
                    attributes: {
                        className: classes.container
                    },
                    children: [
                        new Button({
                            onClick: properties.menu,
                            children: [
                                new Component('span', {
                                    attributes: {
                                        className: 'material-icon'
                                    },
                                    children: [
                                        'list'
                                    ]
                            })
                            ]
                        }),
                        new Component('span', {
                            attributes: {
                                className: classes.nameText
                            },
                            children: [
                                'Algorithm visualizer'
                            ]
                        })
                    ]
                }),
                new Component('div', {
                    attributes: {
                        className: classes.container
                    },
                    children: [
                        new Component('div', {
                            attributes: {
                                className: classes.groupContainer
                            },
                            children: [
                                new Button({
                                    onClick: properties.run,
                                    children: [
                                        new Component('span', {
                                            attributes: {
                                                className: 'material-icon'
                                            },
                                            children: [
                                                'flag'
                                            ]
                                        })
                                    ]
                                }),
                                leftButton,
                                rightButton
                            ]
                        })
                    ]
                }),
                new Component('div', {
                    attributes: {
                        className: classes.container
                    },
                    children: [
                        new Component('div', {
                            attributes: {
                                className: classes.groupContainer,
                                style: 'margin-left: 40rem;'
                            },
                            children: [
                                new Button({
                                    onClick: properties.showInformationFunction,
                                    children: [
                                        new Component('span', {
                                            attributes: {
                                                className: 'material-icon'
                                            },
                                            children: [
                                                'question_mark'
                                            ]
                                        })
                                    ]
                                }),
                                findButton
                            ]
                        })
                    ]
                })
            ]
        }
    );
}

export default Header;