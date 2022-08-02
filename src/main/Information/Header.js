import Component from "../../Component";
import classes from "./Header.module.scss";

const Header = function () {

    return new Component('div', {
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
    });

}

export default Header;