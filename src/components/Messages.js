import React, { Fragment } from 'react';
import {
  List,
  ListItem,
  Divider,
  Typography,
  makeStyles,
} from '@material-ui/core';

const useStyles = makeStyles(theme => {
  return {
    message: {
      margin: theme.spacing(1)
    },
    messages: {
      marginLeft: theme.spacing(3),
      marginRight: theme.spacing(3),
      marginTop: theme.spacing(2),
      marginBottom: 80 // manually adjust this so that the bottom bar doesn't cover the content
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

  const firstLine = props.story.Continue();
  const lines = [];

  while (props.story.canContinue) {
    lines.push(props.story.Continue());
  }

  return (
    <List className={classes.messages}>
      <Message>{firstLine}</Message>
      {lines.map(l => {
        return (
          <Fragment>
            <Divider />
            <Message>{l}</Message>
          </Fragment>
        );
      })}
    </List>
  );
}
