import React, { Fragment } from 'react';
import ScrollableFeed from 'react-scrollable-feed';
import {
  ListItem,
  Typography,
  makeStyles,
  Divider,
} from '@material-ui/core';
import ReactMarkdown from 'react-markdown';

const useStyles = makeStyles(theme => {
  // update these if you ever change the top or bottom bars
  const topBarHeight = 64;
  const bottomBarHeight = 128;

  return {
    fromIndicator: {
      width: '100%',
      flex: '0 0 4em'
    },
    messageText: {
      width: '100%',
      flex: 1
    },
    systemMessage: {
      width: '100%'
    },
    messages: {
      height: `calc(100vh - ${topBarHeight}px - ${bottomBarHeight}px)`
    }
  }
});

function SystemMessage (props) {
  const classes = useStyles();

  return (
    <ListItem>
      <Typography className={classes.systemMessage} component='div' color='textSecondary' align='center' >
        <ReactMarkdown source={'**JournoBot**: ' + props.line.text} />
      </Typography>
    </ListItem>
  );
}

function NormalMessage (props) {
  const classes = useStyles();

  const { line, chatPartner } = props;

  const player = line.fromPlayer;
  const hidden = line.tags.hideUsername;

  const fromName = player ? 'you' : chatPartner;
  const fromIndicator = (
    <Typography
      className={classes.fromIndicator}
      variant='body1'
      color='textSecondary'
    >
      <strong>{fromName}</strong>
    </Typography>
  );

  return (
    <Fragment>
      <Divider light variant='middle' />
      <ListItem style={{paddingTop:0, paddingBottom:0}}>
        {hidden ? null : fromIndicator}
        <Typography
          className={classes.messageText}
          variant='body1'
          component='div'
        >
          <ReactMarkdown source={line.text} />
        </Typography>
      </ListItem>
    </Fragment>
  );
}

export function Messages (props) {
  const classes = useStyles();

  const { lines } = props;

  if (!Array.isArray(lines) || !lines.length) return null;

  let i = 0;

  return (
    <Fragment>
      <ScrollableFeed className={classes.messages} forceScroll >
        {lines.map(l => l.tags.system
          ? <SystemMessage key={i++} line={l} />
          : <NormalMessage key={i++} line={l} chatPartner={props.chatPartner} />)}
      </ScrollableFeed>
    </Fragment>
  );
}
