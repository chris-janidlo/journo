import React, { Fragment } from 'react';
import {
  AppBar,
  Toolbar,
  Typography
} from '@material-ui/core';

export function TopBar (props) {
  return (
    <Fragment>
      {/* TODO: do something other than sticky with more cross compatibility? */}
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">
            Journo - Newspaper
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* so that app bar doesn't cover top of content */}
    </Fragment>
  );
}
