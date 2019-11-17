import React, { Fragment, useState, useEffect } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import { millisecondsToType } from '../story';
import {
  ListItem,
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

const useStyles = makeStyles(theme => {
  // update these if you ever change the top or bottom bars
  const topBarHeight = 64;
  const bottomBarHeight = 113;

  return {
    message: {
      margin: theme.spacing(1),
      width: '100%'
    },
    messages: {
      height: `calc(100vh - ${topBarHeight}px - ${bottomBarHeight}px)`
    }
  }
});

function MText (props) {
  const classes = useStyles();

  return (
    <Typography className={classes.message} align={props.fromPlayer ? 'right' : 'left'}>
      {props.text}
    </Typography>
  );
}

function Message (props) {
  const [isTyping, setTypingState] = useState(true);

  useEffect(() => {
    setTimeout(() => setTypingState(false), millisecondsToType(props.line));
  });

  return (
    <ListItem>
      { props.line.fromPlayer
        ? <MText text={props.line.text} fromPlayer />
        : isTyping
          ? <MoreHorizIcon />
          : <MText text={props.line.text} />
      }
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
      <Message key={index++} line={firstLine} />
      {lines.map(l => {
        return (
          <Fragment key={index++}>
            <Divider />
            <Message line={l} />
          </Fragment>
        );
      })}
    </ScrollableFeed>
  );
}
