import type { GlobalThemeOverrides } from "naive-ui";
export const overrideTheme: GlobalThemeOverrides = {
    common: {
        modalColor: 'rgb(22,25,37)',
        fontFamily: '"Poppins", sans-serif',
        textColor1: 'var(--theme-color)',
        textColor2: 'var(--theme-color)',
    },
    Button: {
        colorPrimary: '#3a6df0',
        colorHoverPrimary: '#1e59f1',
        borderPrimary: '',
        borderHoverPrimary: '',
        borderRadiusSmall: '20px',
        paddingSmall :'6px 24px',
    },
    Card: {
        borderRadius: '6px'
    },
    Input:{
        color: 'var(--search-bg)',
        colorFocus: 'var(--search-bg)',
        border: '1px solid rgba(194, 194, 194, 0.34)',
        borderFocus: '1px solid rgba(194, 194, 194, 0.65)',
        borderHover: '1px solid rgba(194, 194, 194, 0.65)',
        boxShadowFocus: '0 0 0 2px rgba(134, 140, 160, 0.02)'
    },
    Message: {
        colorError: 'rgb(22,25,37)',
        colorSuccess: 'rgb(22,25,37)'
    },
    Popover:{
        color: 'var(--popup-bg)'
    },
    Menu: {
        itemColorHover: 'var(--dropdown-hover)',
        itemColorActive: 'var(--dropdown-active)',
        itemTextColorActive: '',
        itemTextColorActiveHover: '',
    }
};
