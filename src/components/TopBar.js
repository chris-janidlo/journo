import React, { Fragment } from 'react';
import {
  AppBar,
  Toolbar,
  Typography
} from '@material-ui/core';

export function TopBar (props) {
  const { chatPartner } = props;

  const title = (chatPartner === '') ? 'Inbox' : `Connected with ${chatPartner}`;

  return (
    <Fragment>
      <AppBar position="fixed" elevation={0}>
        <Toolbar>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* so that app bar doesn't cover top of content */}
    </Fragment>
  );
}
