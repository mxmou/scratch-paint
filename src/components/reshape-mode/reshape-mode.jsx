import React from 'react';
import PropTypes from 'prop-types';
import messages from '../../lib/messages.js';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import reshapeIcon from './reshape.svg';
import reshapeIconWhite from './reshape-white.svg';
import reshapeIconBlack from './reshape-black.svg';

const ReshapeModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.reshape}
        imgSrc={props.darkTheme ? reshapeIconWhite : reshapeIcon}
        selectedImgSrc={props.darkTheme ? reshapeIconBlack : reshapeIconWhite}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

ReshapeModeComponent.propTypes = {
    darkTheme: PropTypes.bool,
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default ReshapeModeComponent;
