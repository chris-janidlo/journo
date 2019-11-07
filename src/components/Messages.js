import React from 'react';
import {
  Box,
  Typography,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(theme => {
  return {
    messages: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      marginTop: theme.spacing(2),
      marginBottom: 80 // manually adjust this so that the bottom bar doesn't cover the content
    }
  }
});

export function Messages (props) {
  const classes = useStyles();
  return (
    <Box className={classes.messages}>
      <Typography>
        {props.story.ContinueMaximally()}
      </Typography>
    </Box>
  );
}
