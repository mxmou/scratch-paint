import React from 'react';
import PropTypes from 'prop-types';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import messages from '../../lib/messages.js';
import lineIcon from './line.svg';
import lineIconWhite from './line-white.svg';
import lineIconBlack from './line-black.svg';

const BitLineComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.line}
        imgSrc={props.darkTheme ? lineIconWhite : lineIcon}
        selectedImgSrc={props.darkTheme ? lineIconBlack : lineIconWhite}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitLineComponent.propTypes = {
    darkTheme: PropTypes.bool,
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BitLineComponent;
