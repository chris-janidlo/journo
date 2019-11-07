import React, { Fragment } from 'react';
import { TopBar } from './components/TopBar';
import { Messages } from './components/Messages';
import { BottomBar } from './components/BottomBar';

export const App = props =>
  <Fragment>
    <TopBar story={props.story}/>
    <Messages story={props.story}/>
    <BottomBar story={props.story}/>
  </Fragment>
