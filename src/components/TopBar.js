import React, { Fragment } from 'react';
import {
  AppBar,
  Toolbar,
  Typography
} from '@material-ui/core';

export function TopBar (props) {
  let title = 'Journo - Newspaper';
  if (props.chatPartner !== '') title += ` - connected with ${props.chatPartner}`;
  return (
    <Fragment>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6">
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* so that app bar doesn't cover top of content */}
    </Fragment>
  );
}
