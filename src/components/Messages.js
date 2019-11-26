import React, { Fragment } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import {
  ListItem,
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

  const player = props.line.fromPlayer;
  const system = props.line.tags.system;

  let align = 'left';
  if (player) align = 'right';
  if (system) align = 'center';

  let color = 'initial';
  if (system) color = 'secondary';

  return (
    <ListItem>
      <Typography
        className={classes.message}
        align={align}
        color={color}
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
      <i>{props.chatPartner} is typing...</i>
    </Typography>
  )
}

export function Messages (props) {
  const classes = useStyles();

  const { lines } = props;

  if (!Array.isArray(lines) || !lines.length) return null;

  let index = 0;

  return (
    <Fragment>
      <ScrollableFeed className={classes.messages}>
        {lines.map(l => (
          <Message key={index++} line={l} />
        ))}
      </ScrollableFeed>
      <TypingIndicator active={props.isTyping} chatPartner={props.chatPartner} />
    </Fragment>
  );
}
