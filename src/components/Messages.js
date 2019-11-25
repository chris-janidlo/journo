import React, { Fragment } from 'react';
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
  const bottomBarHeight = 112;

  return {
    message: {
      margin: theme.spacing(1),
      width: '100%'
    },
    messages: {
      height: `calc(100vh - ${topBarHeight}px - ${bottomBarHeight}px)`
    },
    typingIndicator: {
      position: 'absolute',
      left: 0,
      bottom: bottomBarHeight
    }
  }
});

function Message (props) {
  const classes = useStyles();
    
  return (
    <ListItem>
      <Typography
        className={classes.message}
        align={props.line.fromPlayer ? 'right' : 'left'}
      >
        {props.line.text}
      </Typography>
    </ListItem>
  )
}

function TypingIndicator (props) {
  const classes = useStyles();

  if (!props.active) return null;

  return (
    <Typography className={classes.typingIndicator} color='secondary'>
      <i>Travis is typing...</i>
    </Typography>
  )
}

export function Messages (props) {
  const classes = useStyles();

  const { lines } = props;

  if (!Array.isArray(lines) || !lines.length) return null;

  const firstLine = lines[0];
  const otherLines = lines.slice(1);
  
  let index = 0;

  return (
    <Fragment>
      <ScrollableFeed className={classes.messages}>
        <Message key={index++} line={firstLine} />
        {otherLines.map(l => {
          return (
            <Fragment key={index++}>
              <Divider />
              <Message line={l} />
            </Fragment>
          );
        })}
      </ScrollableFeed>
      <TypingIndicator active={props.isTyping} />
    </Fragment>
  );
}
