import Component from "../../Component";
import * as information from "../../assets/information.jpg";
import classes from "./Image.module.scss";

const Image = function () {

    return new Component('div', {
        attributes: {
            className: classes.container
        },
        children: [
            new Component('img', {
                attributes: {
                    src: information.default,
                    className: classes.image
                }
            })
        ]
    })

}

export default Image;