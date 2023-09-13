import React from 'react';
import PropTypes from 'prop-types';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';
import messages from '../../lib/messages.js';
import ovalIcon from './oval.svg';
import ovalIconWhite from './oval-white.svg';
import ovalIconBlack from './oval-black.svg';

const BitOvalComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.oval}
        imgSrc={props.darkTheme ? ovalIconWhite : ovalIcon}
        selectedImgSrc={props.darkTheme ? ovalIconBlack : ovalIconWhite}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

BitOvalComponent.propTypes = {
    darkTheme: PropTypes.bool,
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default BitOvalComponent;
