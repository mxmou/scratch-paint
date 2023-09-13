import React from 'react';
import PropTypes from 'prop-types';

import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import messages from '../../lib/messages.js';
import fillIcon from './fill.svg';
import fillIconWhite from './fill-white.svg';
import fillIconBlack from './fill-black.svg';

const BitFillComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.fill}
        imgSrc={props.darkTheme ? fillIconWhite : fillIcon}
        selectedImgSrc={props.darkTheme ? fillIconBlack : fillIconWhite}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitFillComponent.propTypes = {
    darkTheme: PropTypes.bool,
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BitFillComponent;
