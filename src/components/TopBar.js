import React, { Fragment } from 'react';
import {
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Tooltip
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  Lock as LockIcon
} from '@material-ui/icons';

const useStyles = makeStyles(theme => {
  return {
    menuButton: {
      marginRight: theme.spacing(2)
    }
  };
});

function LockDisplay (props) {
  return (
    <Fragment>
      <span>&ensp;</span>
      <Tooltip title="This session is secured with end-to-end encryption.">
        <LockIcon fontSize='small' />
      </Tooltip>
    </Fragment>
  );
}

export function TopBar (props) {
  const classes = useStyles();

  const { chatPartner } = props;

  const partnerConnected = chatPartner !== '';
  const title = partnerConnected ? `Connected with ${chatPartner}` : 'Inbox';

  return (
    <Fragment>
      <AppBar position="fixed" elevation={0}>
        <Toolbar>
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
          >
            <MenuIcon /> {/* TODO: menu with accessibility mode here */}
          </IconButton>
          <Typography variant="h6" noWrap>
            {title}
          </Typography>
          {partnerConnected ? <LockDisplay /> : null}
        </Toolbar>
      </AppBar>
      <Toolbar /> {/* so that app bar doesn't cover top of content */}
    </Fragment>
  );
}
