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
import Colors from "./main/utils/Colors";
import {Edge} from "./main/utils/graph/AdjacencyTable";
import UtilsError from "./main/utils/UtilsError";

const App = function () {

    let findFunction;
    let scene;
    let grid;
    let baseObjectContainer;
    let showPopup;
    let closePopup;

    let setEnableFunction;
    let showInformationFunction;
    let setFindButtonEnabled;
    let setLeftButtonEnabled;
    let setRightButtonEnabled;

    let minCut = null;
    let states = null;
    let currentState = 0;

    const COLORS = {
        bfs: new Colors('rgba(0,255,0,0.5)'),
        flow: new Colors('rgba(255,255,0,0.5)'),
        minCut: new Colors('rgba(255,80,6,0.5)')
    };

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

        if (minCut != null) {
            graph.updateEdges((edgeView) => {
                return minCut.cutEdges.find(x => x.equals(edgeView.edge));
            }, COLORS.minCut);
        }

        showPopup(getPopupRandomPosition(), `Minimum S-T cut for the graph: ${minCut.value}`);
    }

    function updateArrowsState() {
        if (currentState + 1 < states.length) {
            setRightButtonEnabled(true);
        } else {
            setRightButtonEnabled(false);
        }

        if (currentState - 1 >= 0) {
            setLeftButtonEnabled(true);
        } else {
            setLeftButtonEnabled(false);
        }

        if (currentState === states.length - 1) {
            showPopup(getPopupRandomPosition(), `Minimum S-T cut for the graph: ${minCut.value}`);
        } else {
            closePopup();
        }
    }

    function left() {
        const graph = getGraph();
        if (graph == null || minCut == null) { return; }
        currentState--;

        const state = states[currentState];
        const color = COLORS[state.title];
        const save = state.title === 'minCut';
        graph.updateEdges((edgeView) => {
            Validator.checkInstance(UtilsError, Object, {value: state.value});
            Validator.checkInstance(UtilsError, Number, {start: state.value.start}, {end: state.value.end});
            return edgeView.edge.equals(new Edge(state.value.start, state.value.end));
        }, color, save);
        updateArrowsState();
    }

    function right() {
        const graph = getGraph();
        if (graph == null || minCut == null) { return; }
        currentState++;

        const state = states[currentState];
        const color = COLORS[state.title];
        const save = state.title === 'minCut';
        graph.updateEdges((edgeView) => {
            const state = states[currentState];
            Validator.checkInstance(UtilsError, Object, {value: state.value});
            Validator.checkInstance(UtilsError, Number, {start: state.value.start}, {end: state.value.end});
            return edgeView.edge.equals(new Edge(state.value.start, state.value.end));
        }, color, save);
        updateArrowsState();
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
                setLeftButtonEnabled: (value) => setLeftButtonEnabled = value,
                setRightButtonEnabled: (value) => setRightButtonEnabled = value
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
                        setFindButtonEnabled: setFindButtonEnabled,
                        calculateMinCut: () => {
                            const graph = getGraph();
                            if (graph == null) { return; }
                            minCut = graph.calculateMinCut();
                            states = graph.observer.getAllStates();
                        }
                    })
                ]
            }),
        ]
    });
}

export default App;