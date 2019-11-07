import React from 'react';
import {
  Box,
  Paper,
  InputBase,
  Typography,
  makeStyles,
} from '@material-ui/core';
import storyContent from './story.json';
import { Story } from 'inkjs';

const useStyles = makeStyles(theme => {
  const margin = theme.spacing(2);
  const widthMinusMargin = `calc(100vw - ${margin * 2}px)`;

  return {
    app: {
      height: '100vh'
    },
    bottomBar: {
      width: '100vw',
      position: 'fixed',
      bottom: 0
    },
    mainInput: {
      backgroundColor: theme.palette.primary.main,
      width: widthMinusMargin,
      margin: 'auto', // left and right
      marginBottom: margin,
      marginTop: margin
    }
  }
});

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

export default function App () {
  const classes = useStyles();
  return (
    <Box className={classes.app}>
      <Typography variant="h4" component="h1" gutterBottom>
        {new Story(storyContent).ContinueMaximally()}
      </Typography>
      <BottomBar />
    </Box>
  );
}
