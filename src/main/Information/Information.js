import classes from "./Information.module.scss";
import Component from "../../Component";
import Button from "../Button/Button";
import * as information from '../../assets/information.jpg';

const Information = function (properties) {

    function show() {
        component.update({
            attributes: {
                style: 'display: flex;'
            }
        });
    }

    properties.showInformationFunction(show);

    function onCloseButtonClick() {
        component.update({
            attributes: {
                style: 'display: none;'
            }
        });
    }

    const component = new Component('div', {
        attributes: {
            className: classes.container,
        },
        children: [
            new Component('div', {
                attributes: {
                    className: classes.header
                },
                children: [
                    new Button({width: 'auto',
                        height: 'auto',
                        onClick: onCloseButtonClick,
                        children: [
                            new Component('span', {
                                attributes: {
                                    className: 'material-icon'
                                },
                                children: [
                                    'clear'
                                ]
                            })
                        ]
                    })
                ]
            }),
            new Component('div', {
                attributes: {
                  className: classes.title
                },
                children: [
                    new Component('span', {
                        children: [
                            'S-T minimum cut'
                        ]
                    })
                ]
            }),
            new Component('div', {
                attributes: {
                    className: classes.textArea
                },
                children: [
                    new Component('span', {
                        children: [
                            'An S-T cut is a cut that requires the source ‘S’ and the sink ‘T’ to be in different ' +
                            'subsets, and it consists of edges going from the source’s side to the sink’s side. ' +
                            'The goal is to find minimum capacity S-T cut of the given network. ' +
                            'Expected output is all edges of the minimum cut. '
                        ]
                    })
                ]
            }),
            new Component('img', {
                attributes: {
                    src: information.default,
                    className: classes.image
                }
            }),
            new Component('div', {
                attributes: {
                    className: classes.textArea
                },
                children: [
                    new Component('span', {
                        children: [
                            'The max-flow min-cut theorem states that in a flow network, the amount of maximum flow ' +
                            'is equal to capacity of the minimum cut. With Ford-Fulkerson algorithm, we get capacity ' +
                            'of the minimum cut following next steps: 1) Run Ford-Fulkerson algorithm and consider ' +
                            'the final residual graph.' + '2) Find the set of vertices that are reachable from the ' +
                            'source in the residual graph. 3) All edges which are from a reachable vertex to ' +
                            'non-reachable vertex are minimum cut edges.'
                        ]
                    })
                ]
            })
        ]
    });

    return component;

};

export default Information;