const SET_DARK_THEME = 'scratch-paint/theme/SET_DARK_THEME';
const initialState = {darkTheme: false};

const reducer = function (state, action) {
    if (typeof state === 'undefined') state = initialState;
    switch (action.type) {
    case SET_DARK_THEME:
        return {darkTheme: action.darkTheme};
    default:
        return state;
    }
};

// Action creators ==================================
const setDarkTheme = function (darkTheme) {
    return {
        type: SET_DARK_THEME,
        darkTheme
    };
};


export {
    reducer as default,
    setDarkTheme,
    SET_DARK_THEME
};
