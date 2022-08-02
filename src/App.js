import Component from "./Component";
import Canvas from "./main/Canvas/Canvas";
import Header from "./main/Header/Header";
import InputData from "./main/InputData/InputData";
import {Graph} from "./main/utils/graph/Graph";
import Popup from "./main/Popup/Popup";
import Vector2 from "./main/utils/Vector2";
import Menu from "./main/Menu/Menu";
import Information from "./main/Information/Information";
import Validator from "./Validator";
import LayoutError from "./main/LayoutError";

const App = function () {

    let findFunction;
    let scene;
    let grid;
    let baseObjectContainer;
    let showPopup;
    let closePopup;

    let isFirstClick = false;
    let setEnableFunction;
    let showInformationFunction;
    let setFindButtonEnabled;

    const canvas = new Canvas({
        adaptive: true,
        setFindFunction: (value) => findFunction = value,
        setScene: (value) => scene = value,
        setGrid: (value) => grid = value,
        setBaseObjectContainer: (value) => baseObjectContainer = value,
        size: {width: 1200, height: 700}
    });

    const popupDefaultPosition = new Vector2(300, 250);
    const RANDOM_POPUP_OFFSET = 200;

    function onFindButtonClick() {
        Validator.checkInstance(LayoutError, Function, {findFunction: findFunction});
        findFunction();
    }

    function getPopupRandomPosition() {
        const x = -RANDOM_POPUP_OFFSET / 2 + Math.random() * RANDOM_POPUP_OFFSET;
        const y = -RANDOM_POPUP_OFFSET / 2 + Math.random() * RANDOM_POPUP_OFFSET;
        const offset = new Vector2(x, y);
        return popupDefaultPosition.add(offset);
    }

    function getGraph() {
        const data = baseObjectContainer.findOfType(Graph);
        if (data.length === 0) {
            showPopup(getPopupRandomPosition(), 'Enter graph data first!');
            return null;
        }
        return data[0];
    }

    function run() {
        const graph = getGraph();
        if (graph == null) { return; }
        graph.enableObserver = false;
        const minCut = graph.calculateMinCut();
        showPopup(getPopupRandomPosition(), `Minimum S-T cut for the graph: ${minCut}`);
    }

    function left() {
        const graph = getGraph();
        if (graph == null) { return; }
        graph.enableObserver = true;
        const observer = graph.observer;

        if (observer.hasPrevious('bfs')) {
            observer.previous('bfs');
        }
    }

    function right() {
        const graph = getGraph();
        if (graph == null) { return; }
        graph.enableObserver = true;
        if (!isFirstClick) {
            graph.calculateMinCut();
            isFirstClick = true;
        }
        const observer = graph.observer;

        if (observer.hasNext('bfs')) {
            observer.next('bfs');
        }
    }

    function menu() {
        setEnableFunction();
    }

    return new Component('div', {
        children: [
            new Popup({
                setShowFunction: (value) => showPopup = value,
                closePopupFunction: (value) => closePopup = value
            }),
            new Information({
                showInformationFunction: (value) => showInformationFunction = value
            }),
            new Menu({
                setEnableFunction: (value) => setEnableFunction = value
            }),
            new Header({
                onFindButtonClick: onFindButtonClick,
                run: run,
                left: left,
                right: right,
                menu: menu,
                showInformationFunction: showInformationFunction,
                setFindButtonEnabled: (value) => setFindButtonEnabled = value,
            }),
            new Component('div', {
                attributes: {
                  style: 'display: flex;'
                },
                children: [
                    canvas,
                    new InputData({
                        scene: scene,
                        grid: grid,
                        baseObjectContainer: baseObjectContainer,
                        closePopup: closePopup,
                        setFindButtonEnabled: setFindButtonEnabled
                    })
                ]
            }),
        ]
    });
}

export default App;