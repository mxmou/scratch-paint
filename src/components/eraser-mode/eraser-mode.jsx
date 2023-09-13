import React from 'react';
import PropTypes from 'prop-types';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import messages from '../../lib/messages.js';
import eraserIcon from './eraser.svg';
import eraserIconWhite from './eraser-white.svg';
import eraserIconBlack from './eraser-black.svg';

const EraserModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.eraser}
        imgSrc={props.darkTheme ? eraserIconWhite : eraserIcon}
        selectedImgSrc={props.darkTheme ? eraserIconBlack : eraserIconWhite}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

EraserModeComponent.propTypes = {
    darkTheme: PropTypes.bool,
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default EraserModeComponent;
