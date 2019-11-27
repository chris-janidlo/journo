import React, { Fragment } from 'react';
import {
  AppBar,
  Toolbar,
  Typography
} from '@material-ui/core';

export function TopBar (props) {
  let title = 'Journo - Newspaper';
  if (props.chatPartner !== '') title = `Connected with ${props.chatPartner} - ${title}`;
  return (
    <Fragment>
      <AppBar position="fixed" elevation={0}>
        <Toolbar>
          <Typography style={{width: '100%'}} variant="h6" align='center' noWrap>
            {title}
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* so that app bar doesn't cover top of content */}
    </Fragment>
  );
}
