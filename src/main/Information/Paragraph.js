import Component from "../../Component";
import classes from "./Paragraph.module.scss";

const Paragraph = function (properties) {

    return new Component('div', {
        attributes: {
            className: classes.container
        },
        children: [
            new Component('div', {
                attributes: {
                    className: classes.text
                },
                children: [
                    new Component('span', {
                        children: [
                            properties.text
                        ]
                    })
                ]
            })
        ]
    });

}

export default Paragraph;