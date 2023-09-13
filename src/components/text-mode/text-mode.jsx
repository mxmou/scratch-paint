import React from 'react';
import PropTypes from 'prop-types';
import messages from '../../lib/messages.js';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import textIcon from './text.svg';
import textIconWhite from './text-white.svg';
import textIconBlack from './text-black.svg';

const TextModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.text}
        imgSrc={props.darkTheme ? textIconWhite : textIcon}
        selectedImgSrc={props.darkTheme ? textIconBlack : textIconWhite}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

TextModeComponent.propTypes = {
    darkTheme: PropTypes.bool,
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default TextModeComponent;
