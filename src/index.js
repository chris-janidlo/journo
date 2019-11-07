import React from 'react';
import ReactDOM from 'react-dom';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './theme';
import { App } from './App';
import { Story } from 'inkjs';
import storyContent from './story.json';

ReactDOM.render(
  <ThemeProvider theme={theme}>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline />
    <App story={new Story(storyContent)} />
  </ThemeProvider>,
  document.querySelector('#root')
);
