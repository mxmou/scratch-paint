import React from 'react';
import PropTypes from 'prop-types';

import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import messages from '../../lib/messages.js';
import textIcon from './text.svg';
import textIconWhite from './text-white.svg';
import textIconBlack from './text-black.svg';

const BitTextComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.text}
        imgSrc={props.darkTheme ? textIconWhite : textIcon}
        selectedImgSrc={props.darkTheme ? textIconBlack : textIconWhite}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitTextComponent.propTypes = {
    darkTheme: PropTypes.bool,
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BitTextComponent;
