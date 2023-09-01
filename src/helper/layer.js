import paper from '@scratch/paper';
import log from '../log/log';
import {ART_BOARD_BOUNDS, ART_BOARD_WIDTH, ART_BOARD_HEIGHT, CENTER, MAX_WORKSPACE_BOUNDS} from './view';
import {isGroupItem} from './item';
import {isBitmap, isVector} from '../lib/format';

const CHECKERBOARD_SIZE = 8;
const CROSSHAIR_SIZE = 16;
const CROSSHAIR_FULL_OPACITY = 0.75;

const WORKSPACE_BACKGROUND_LIGHT = '#ECF1F9';
const ART_BOARD_BACKGROUND_LIGHT = '#FFFFFF';
const CHECKERBOARD_COLOR_LIGHT = '#D9E3F2';
const OUTLINE_COLOR_LIGHT = '#FFFFFF';
const OUTLINE_COLOR_ACCENT = '#4280d7';

const WORKSPACE_BACKGROUND_DARK = '#2B2F3B';
const ART_BOARD_BACKGROUND_DARK = '#363B49';
const CHECKERBOARD_COLOR_DARK = '#272A35';
const OUTLINE_COLOR_DARK = '#363B49';

const _getLayer = function (layerString) {
    for (const layer of paper.project.layers) {
        if (layer.data && layer.data[layerString]) {
            return layer;
        }
    }
};

const _getPaintingLayer = function () {
    return _getLayer('isPaintingLayer');
};

/**
 * Creates a canvas with width and height matching the art board size.
 * @param {?number} width Width of the canvas. Defaults to ART_BOARD_WIDTH.
 * @param {?number} height Height of the canvas. Defaults to ART_BOARD_HEIGHT.
 * @return {HTMLCanvasElement} the canvas
 */
const createCanvas = function (width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = width ? width : ART_BOARD_WIDTH;
    canvas.height = height ? height : ART_BOARD_HEIGHT;
    canvas.getContext('2d').imageSmoothingEnabled = false;
    return canvas;
};

const clearRaster = function () {
    const layer = _getLayer('isRasterLayer');
    layer.removeChildren();
    
    // Generate blank raster
    const raster = new paper.Raster(createCanvas());
    raster.canvas.getContext('2d').imageSmoothingEnabled = false;
    raster.parent = layer;
    raster.guide = true;
    raster.locked = true;
    raster.position = CENTER;
};

const getRaster = function () {
    const layer = _getLayer('isRasterLayer');
    // Generate blank raster
    if (layer.children.length === 0) {
        clearRaster();
    }
    return _getLayer('isRasterLayer').children[0];
};

const getDragCrosshairLayer = function () {
    return _getLayer('isDragCrosshairLayer');
};

const getBackgroundGuideLayer = function () {
    return _getLayer('isBackgroundGuideLayer');
};

const _convertLayer = function (layer, format) {
    layer.bitmapBackground.visible = isBitmap(format);
    layer.vectorBackground.visible = isVector(format);
};

const convertBackgroundGuideLayer = function (format) {
    _convertLayer(getBackgroundGuideLayer(), format);
};

const _makeGuideLayer = function () {
    const guideLayer = new paper.Layer();
    guideLayer.data.isGuideLayer = true;
    return guideLayer;
};

const getGuideLayer = function () {
    let layer = _getLayer('isGuideLayer');
    if (!layer) {
        layer = _makeGuideLayer();
        _getPaintingLayer().activate();
    }
    return layer;
};

const setGuideItem = function (item) {
    item.locked = true;
    item.guide = true;
    if (isGroupItem(item)) {
        for (let i = 0; i < item.children.length; i++) {
            setGuideItem(item.children[i]);
        }
    }
};

/**
 * Removes the guide layers, e.g. for purposes of exporting the image. Must call showGuideLayers to re-add them.
 * @param {boolean} includeRaster true if the raster layer should also be hidden
 * @return {object} an object of the removed layers, which should be passed to showGuideLayers to re-add them.
 */
const hideGuideLayers = function (includeRaster) {
    const backgroundGuideLayer = getBackgroundGuideLayer();
    const dragCrosshairLayer = getDragCrosshairLayer();
    const outlineLayer = _getLayer('isOutlineLayer');
    const guideLayer = getGuideLayer();
    dragCrosshairLayer.remove();
    outlineLayer.remove();
    guideLayer.remove();
    backgroundGuideLayer.remove();
    let rasterLayer;
    if (includeRaster) {
        rasterLayer = _getLayer('isRasterLayer');
        rasterLayer.remove();
    }
    return {
        dragCrosshairLayer: dragCrosshairLayer,
        outlineLayer: outlineLayer,
        guideLayer: guideLayer,
        backgroundGuideLayer: backgroundGuideLayer,
        rasterLayer: rasterLayer
    };
};

/**
 * Add back the guide layers removed by calling hideGuideLayers. This must be done before any editing operations are
 * taken in the paint editor.
 * @param {!object} guideLayers object of the removed layers, which was returned by hideGuideLayers
 */
const showGuideLayers = function (guideLayers) {
    const backgroundGuideLayer = guideLayers.backgroundGuideLayer;
    const dragCrosshairLayer = guideLayers.dragCrosshairLayer;
    const outlineLayer = guideLayers.outlineLayer;
    const guideLayer = guideLayers.guideLayer;
    const rasterLayer = guideLayers.rasterLayer;
    if (rasterLayer && !rasterLayer.index) {
        paper.project.addLayer(rasterLayer);
        rasterLayer.sendToBack();
    }
    if (!backgroundGuideLayer.index) {
        paper.project.addLayer(backgroundGuideLayer);
        backgroundGuideLayer.sendToBack();
    }
    if (!dragCrosshairLayer.index) {
        paper.project.addLayer(dragCrosshairLayer);
        dragCrosshairLayer.bringToFront();
    }
    if (!outlineLayer.index) {
        paper.project.addLayer(outlineLayer);
        outlineLayer.bringToFront();
    }
    if (!guideLayer.index) {
        paper.project.addLayer(guideLayer);
        guideLayer.bringToFront();
    }
    if (paper.project.activeLayer !== _getPaintingLayer()) {
        log.error(`Wrong active layer`);
        log.error(paper.project.activeLayer.data);
    }
};

const _makePaintingLayer = function () {
    const paintingLayer = new paper.Layer();
    paintingLayer.data.isPaintingLayer = true;
    return paintingLayer;
};

const _makeRasterLayer = function () {
    const rasterLayer = new paper.Layer();
    rasterLayer.data.isRasterLayer = true;
    clearRaster();
    return rasterLayer;
};

const _makeBackgroundPaper = function (width, height, color, opacity) {
    // creates a checkerboard path of width * height squares in color on white
    let x = 0;
    let y = 0;
    const pathPoints = [];
    while (x < width) {
        pathPoints.push(new paper.Point(x, y));
        x++;
        pathPoints.push(new paper.Point(x, y));
        y = y === 0 ? height : 0;
    }
    y = height - 1;
    x = width;
    while (y > 0) {
        pathPoints.push(new paper.Point(x, y));
        x = (x === 0 ? width : 0);
        pathPoints.push(new paper.Point(x, y));
        y--;
    }
    const vRect = new paper.Shape.Rectangle(
        new paper.Point(0, 0),
        new paper.Point(ART_BOARD_WIDTH / CHECKERBOARD_SIZE, ART_BOARD_HEIGHT / CHECKERBOARD_SIZE));
    vRect.fillColor = ART_BOARD_BACKGROUND_LIGHT;
    vRect.guide = true;
    vRect.locked = true;
    vRect.position = CENTER;
    const vPath = new paper.Path(pathPoints);
    vPath.fillRule = 'evenodd';
    vPath.fillColor = color;
    vPath.opacity = opacity;
    vPath.guide = true;
    vPath.locked = true;
    vPath.position = CENTER;
    const mask = new paper.Shape.Rectangle(MAX_WORKSPACE_BOUNDS);
    mask.position = CENTER;
    mask.guide = true;
    mask.locked = true;
    mask.scale(1 / CHECKERBOARD_SIZE);
    const vGroup = new paper.Group([vRect, vPath, mask]);
    vGroup.rect = vRect;
    vGroup.path = vPath;
    mask.clipMask = true;
    return vGroup;
};

// Helper function for drawing a crosshair
const _makeCrosshair = function (opacity, parent) {
    const crosshair = new paper.Group();

    const vLine2 = new paper.Path.Line(new paper.Point(0, -7), new paper.Point(0, 7));
    vLine2.strokeWidth = 6;
    vLine2.strokeColor = 'white';
    vLine2.strokeCap = 'round';
    crosshair.addChild(vLine2);
    const hLine2 = new paper.Path.Line(new paper.Point(-7, 0), new paper.Point(7, 0));
    hLine2.strokeWidth = 6;
    hLine2.strokeColor = 'white';
    hLine2.strokeCap = 'round';
    crosshair.addChild(hLine2);
    const circle2 = new paper.Shape.Circle(new paper.Point(0, 0), 5.5);
    circle2.strokeWidth = 6;
    circle2.strokeColor = 'white';
    crosshair.addChild(circle2);

    const vLine = new paper.Path.Line(new paper.Point(0, -7), new paper.Point(0, 7));
    vLine.strokeWidth = 2;
    vLine.strokeColor = 'black';
    vLine.strokeCap = 'round';
    crosshair.addChild(vLine);
    const hLine = new paper.Path.Line(new paper.Point(-7, 0), new paper.Point(7, 0));
    hLine.strokeWidth = 2;
    hLine.strokeColor = 'black';
    hLine.strokeCap = 'round';
    crosshair.addChild(hLine);
    const circle = new paper.Shape.Circle(new paper.Point(0, 0), 5.5);
    circle.strokeWidth = 2;
    circle.strokeColor = 'black';
    crosshair.addChild(circle);

    setGuideItem(crosshair);
    crosshair.position = CENTER;
    crosshair.opacity = opacity;
    crosshair.parent = parent;
    crosshair.applyMatrix = false;
    parent.dragCrosshair = crosshair;
    crosshair.scale(CROSSHAIR_SIZE / crosshair.bounds.width / paper.view.zoom);
};

const _makeDragCrosshairLayer = function () {
    const dragCrosshairLayer = new paper.Layer();
    _makeCrosshair(CROSSHAIR_FULL_OPACITY, dragCrosshairLayer);
    dragCrosshairLayer.data.isDragCrosshairLayer = true;
    dragCrosshairLayer.visible = false;
    return dragCrosshairLayer;
};

const _makeOutlineLayer = function () {
    const outlineLayer = new paper.Layer();
    const whiteRect = new paper.Shape.Rectangle(ART_BOARD_BOUNDS.expand(1));
    whiteRect.strokeWidth = 2;
    whiteRect.strokeColor = OUTLINE_COLOR_LIGHT;
    outlineLayer.whiteRect = whiteRect;
    setGuideItem(whiteRect);
    const blueRect = new paper.Shape.Rectangle(ART_BOARD_BOUNDS.expand(5));
    blueRect.strokeWidth = 2;
    blueRect.strokeColor = OUTLINE_COLOR_ACCENT;
    blueRect.opacity = 0.25;
    setGuideItem(blueRect);
    outlineLayer.data.isOutlineLayer = true;
    return outlineLayer;
};

const _makeBackgroundGuideLayer = function (format) {
    const guideLayer = new paper.Layer();
    guideLayer.locked = true;
    
    const vWorkspaceBounds = new paper.Shape.Rectangle(MAX_WORKSPACE_BOUNDS);
    vWorkspaceBounds.fillColor = WORKSPACE_BACKGROUND_LIGHT;
    vWorkspaceBounds.position = CENTER;

    // Add 1 to the height because it's an odd number otherwise, and we want it to be even
    // so the corner of the checkerboard to line up with the center crosshair
    const vBackground = _makeBackgroundPaper(
        MAX_WORKSPACE_BOUNDS.width / CHECKERBOARD_SIZE,
        (MAX_WORKSPACE_BOUNDS.height / CHECKERBOARD_SIZE) + 1,
        CHECKERBOARD_COLOR_LIGHT, 0.55);
    vBackground.position = CENTER;
    vBackground.scaling = new paper.Point(CHECKERBOARD_SIZE, CHECKERBOARD_SIZE);

    const vectorBackground = new paper.Group();
    vectorBackground.addChild(vWorkspaceBounds);
    vectorBackground.addChild(vBackground);
    vectorBackground.workspaceBounds = vWorkspaceBounds;
    vectorBackground.background = vBackground;
    setGuideItem(vectorBackground);
    guideLayer.vectorBackground = vectorBackground;

    const bitmapBackground = _makeBackgroundPaper(
        ART_BOARD_WIDTH / CHECKERBOARD_SIZE,
        ART_BOARD_HEIGHT / CHECKERBOARD_SIZE,
        CHECKERBOARD_COLOR_LIGHT, 0.55);
    bitmapBackground.position = CENTER;
    bitmapBackground.scaling = new paper.Point(CHECKERBOARD_SIZE, CHECKERBOARD_SIZE);
    bitmapBackground.guide = true;
    bitmapBackground.locked = true;
    guideLayer.bitmapBackground = bitmapBackground;

    _convertLayer(guideLayer, format);
    
    _makeCrosshair(0.16, guideLayer);

    guideLayer.data.isBackgroundGuideLayer = true;
    return guideLayer;
};

const setupLayers = function (format) {
    const backgroundGuideLayer = _makeBackgroundGuideLayer(format);
    _makeRasterLayer();
    const paintLayer = _makePaintingLayer();
    const dragCrosshairLayer = _makeDragCrosshairLayer();
    const outlineLayer = _makeOutlineLayer();
    const guideLayer = _makeGuideLayer();
    backgroundGuideLayer.sendToBack();
    dragCrosshairLayer.bringToFront();
    outlineLayer.bringToFront();
    guideLayer.bringToFront();
    paintLayer.activate();
};

const toggleDarkTheme = function (dark) {
    const backgroundGuideLayer = getBackgroundGuideLayer();
    const outlineLayer = _getLayer('isOutlineLayer');
    if (dark) {
        backgroundGuideLayer.vectorBackground.workspaceBounds.fillColor = WORKSPACE_BACKGROUND_DARK;
        backgroundGuideLayer.vectorBackground.background.rect.fillColor = ART_BOARD_BACKGROUND_DARK;
        backgroundGuideLayer.vectorBackground.background.path.fillColor = CHECKERBOARD_COLOR_DARK;
        backgroundGuideLayer.bitmapBackground.rect.fillColor = ART_BOARD_BACKGROUND_DARK;
        backgroundGuideLayer.bitmapBackground.path.fillColor = CHECKERBOARD_COLOR_DARK;
        outlineLayer.whiteRect.strokeColor = OUTLINE_COLOR_DARK;
    } else {
        backgroundGuideLayer.vectorBackground.workspaceBounds.fillColor = WORKSPACE_BACKGROUND_LIGHT;
        backgroundGuideLayer.vectorBackground.background.rect.fillColor = ART_BOARD_BACKGROUND_LIGHT;
        backgroundGuideLayer.vectorBackground.background.path.fillColor = CHECKERBOARD_COLOR_LIGHT;
        backgroundGuideLayer.bitmapBackground.rect.fillColor = ART_BOARD_BACKGROUND_LIGHT;
        backgroundGuideLayer.bitmapBackground.path.fillColor = CHECKERBOARD_COLOR_LIGHT;
        outlineLayer.whiteRect.strokeColor = OUTLINE_COLOR_LIGHT;
    }
};

export {
    CROSSHAIR_SIZE,
    CROSSHAIR_FULL_OPACITY,
    createCanvas,
    hideGuideLayers,
    showGuideLayers,
    getDragCrosshairLayer,
    getGuideLayer,
    getBackgroundGuideLayer,
    convertBackgroundGuideLayer,
    clearRaster,
    getRaster,
    setGuideItem,
    setupLayers,
    toggleDarkTheme
};
