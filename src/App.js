import React, { Fragment } from 'react';
import { TopBar } from './components/TopBar';
import { Messages } from './components/Messages';
import { BottomBar } from './components/BottomBar';

export function App (props) {
  const startTime = new Date();
  props.story.BindExternalFunction("get_elapsed_seconds", () => {
    const currentTime = new Date();
    return Math.floor((currentTime - startTime) / 1000);
  });

  return (
    <Fragment>
      <TopBar story={props.story}/>
      <Messages story={props.story}/>
      <BottomBar story={props.story}/>
    </Fragment>
  );
}
