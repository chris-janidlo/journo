import { createMuiTheme } from '@material-ui/core/styles';

export const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#212121',
      light: '#484848',
      dark: '#000000'
    },
    secondary: {
      main: '#c5cae9',
      light: '#f8fdff',
      dark: '#9499b7'
    }
  },
  shape: {
    borderRadius: Number.MAX_SAFE_INTEGER // round the hell out of those corners
  }
});
