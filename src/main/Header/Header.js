import Component from "../../Component";
import classes from "./Header.module.scss";
import Button from "../Button/Button";
import Menu from "../Menu/Menu";

const Header = function (properties) {

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
                        new Button({width: 'auto',
                            height: 'auto',
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
                                new Button({width: 'auto',
                                    height: 'auto',
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
                                new Button({width: 'auto',
                                    height: 'auto',
                                    onClick: properties.left,
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
                                }),
                                new Button({width: 'auto',
                                    height: 'auto',
                                    onClick: properties.right,
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
                                })
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
                                new Button({width: 'auto',
                                    height: 'auto',
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
                                new Button({width: 'auto',
                                    height: 'auto',
                                    onClick: properties.onFindButtonClick,
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
                                })
                            ]
                        })
                    ]
                })
            ]
        }
    );
}

export default Header;