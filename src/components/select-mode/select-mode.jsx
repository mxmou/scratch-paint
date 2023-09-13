import React from 'react';
import PropTypes from 'prop-types';
import messages from '../../lib/messages.js';
import ToolSelectComponent from '../tool-select-base/tool-select-base.jsx';

import selectIcon from './select.svg';
import selectIconWhite from './select-white.svg';
import selectIconBlack from './select-black.svg';

const SelectModeComponent = props => (
    <ToolSelectComponent
        imgDescriptor={messages.select}
        imgSrc={props.darkTheme ? selectIconWhite : selectIcon}
        selectedImgSrc={props.darkTheme ? selectIconBlack : selectIconWhite}
        isSelected={props.isSelected}
        onMouseDown={props.onMouseDown}
    />
);

SelectModeComponent.propTypes = {
    darkTheme: PropTypes.bool,
    isSelected: PropTypes.bool.isRequired,
    onMouseDown: PropTypes.func.isRequired
};

export default SelectModeComponent;
