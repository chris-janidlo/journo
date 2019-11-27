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
    },
    background: {
      default: '#fff'
    }
  },
  shape: {
    borderRadius: 20
  },
  overrides: {
    MuiCssBaseline: {
      // default properties taken from https://stackoverflow.com/q/7855590/5931898
      '@global': {
        '*::-webkit-scrollbar': {
          WebkitAppearance: 'none' // to make horizontal and vertical scrollbars consistent with how macos hides them based on mouse/trackpad status
        },
        '*::-webkit-scrollbar:vertical': {
          width: 11
        },
        '*::-webkit-scrollbar:horizontal': {
          height: 11
        },
        '*::-webkit-scrollbar-thumb': {
          borderRadius: Number.MAX_SAFE_INTEGER,
          border: '2px solid white',
          backgroundColor: 'rgba(0, 0, 0, .25)'
        },
        '*::-webkit-scrollbar-track': {
          backgroundColor: '#fff'
        }
      }
    }
  }
});
