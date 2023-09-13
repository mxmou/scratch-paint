import React from 'react';
import PropTypes from 'prop-types';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import messages from '../../lib/messages.js';
import brushIcon from './brush.svg';
import brushIconWhite from './brush-white.svg';
import brushIconBlack from './brush-black.svg';

const BrushModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.brush}
        imgSrc={props.darkTheme ? brushIconWhite : brushIcon}
        selectedImgSrc={props.darkTheme ? brushIconBlack : brushIconWhite}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BrushModeComponent.propTypes = {
    darkTheme: PropTypes.bool,
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BrushModeComponent;
