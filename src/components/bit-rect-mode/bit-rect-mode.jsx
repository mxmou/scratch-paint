import React from 'react';
import PropTypes from 'prop-types';

import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import messages from '../../lib/messages.js';
import rectIcon from './rectangle.svg';
import rectIconWhite from './rectangle-white.svg';
import rectIconBlack from './rectangle-black.svg';

const BitRectComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.rect}
        imgSrc={props.darkTheme ? rectIconWhite : rectIcon}
        selectedImgSrc={props.darkTheme ? rectIconBlack : rectIconWhite}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitRectComponent.propTypes = {
    darkTheme: PropTypes.bool,
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BitRectComponent;
