import React, { Fragment } from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  InputBase,
  makeStyles,
} from '@material-ui/core';
import storyContent from './story.json';
import { Story } from 'inkjs';

const useStyles = makeStyles(theme => {
  const marginSmall = theme.spacing(2);
  const marginLarge = theme.spacing(3);

  return {
    content: {
      marginLeft: marginLarge,
      marginRight: marginLarge,
      marginTop: marginSmall,
      marginBottom: 80 // manually adjust this so that the bottom bar doesn't cover the content
    },
    bottomBar: {
      width: '100vw',
      position: 'fixed',
      bottom: 0
    },
    mainInput: {
      backgroundColor: theme.palette.secondary.main,
      marginLeft: marginSmall,
      marginRight: marginSmall,
      marginTop: marginSmall,
      marginBottom: marginSmall
    }
  }
});

function TopBar () {
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

function Content () {
  const classes = useStyles();
  return (
    <Box className={classes.content}>
      <Typography>
        {new Story(storyContent).ContinueMaximally()}
      </Typography>
    </Box>
  );
}

function BottomBar () {
  const classes = useStyles();
  return (
    <Paper elevation={4} square className={classes.bottomBar}>
      <Paper elevation={0} className={classes.mainInput}>
        <Box m={1.2}>
          <InputBase fullWidth placeholder='Say something...'/>
        </Box>
      </Paper>
    </Paper>
  );
}

export default () =>
  <Fragment>
    <TopBar />
    <Content />
    <BottomBar />
  </Fragment>
