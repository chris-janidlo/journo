import React from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import {
  ListItem,
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(theme => {
  // update these if you ever change the top or bottom bars
  const topBarHeight = 64;
  const bottomBarHeight = 129;

  return {
    message: {
      margin: theme.spacing(1)
    },
    messages: {
      height: `calc(100vh - ${topBarHeight}px - ${bottomBarHeight}px)`
    }
  }
});

function Message (props) {
  const classes = useStyles();
  return (
    <ListItem>
      <Typography className={classes.message}>
        {props.children}
      </Typography>
    </ListItem>
  )
}

export function Messages (props) {
  const classes = useStyles();

  const firstLine = props.lines[0];
  const lines = props.lines.slice(1);

  let index = 0;

  return (
    <ScrollableFeed className={classes.messages}>
      <Message key={index++}>{firstLine.text}</Message>
      {lines.map(l => {
        return (
          <div key={index++}>
            <Divider />
            <Message>{l.text}</Message>
          </div>
        );
      })}
    </ScrollableFeed>
  );
}
