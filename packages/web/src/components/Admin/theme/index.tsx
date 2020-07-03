// Material helpers
import { createMuiTheme } from '@material-ui/core';
import palette from './palette';
import typography from './typography';
import overrides from './overrides';

declare module '@material-ui/core/styles/createPalette' {
  interface Palette {
    success: PaletteColor;
    info: PaletteColor;
    danger: PaletteColor;
    warning: PaletteColor;
    border: string;
  }

  interface PaletteOptions {
    success?: PaletteColorOptions;
    info?: PaletteColorOptions;
    danger?: PaletteColorOptions;
    warning?: PaletteColorOptions;
    border?: string;
  }

  interface TypeBackground {
    dark: string;
  }
}

const theme = createMuiTheme({
  palette,
  typography,
  overrides,
  zIndex: {
    appBar: 1200,
    drawer: 1100,
  },
});

export default theme;
