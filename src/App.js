import React, { Component } from 'react';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './theme';
import { TopBar } from './components/TopBar';
import { Messages } from './components/Messages';
import { BottomBar } from './components/BottomBar';
import {
  continueStory,
  makeChoice,
  getStoryVariable,
  setStoryVariable
} from './story';
import { DevClock } from './components/DevClock';

export class App extends Component {

  constructor (props) {
    super(props);

    this.state = {
      lines: [],
      choices: [],
      typing: false,
      timeouts: [],
      interruptible: false
    }

    this.makeChoiceAndUpdateState = this.makeChoiceAndUpdateState.bind(this);
    this.continue = this.continue.bind(this);
  }

  componentDidMount () {
    this.continue();
  }

  continue () {
    const next = continueStory();

    if (next === null) return;

    const { line, choices } = next;
    const interruptible = line.tags.interruptible;

    if (global.devEnv) console.log(line.text, next);
    
    const typingTimeout = setTimeout(() => {
      this.setState(
        state => ({
          lines: state.lines.concat(line),
          // if we were interruptible, then we no longer care about the old choices since we've hit the timeout and are about to choose the .wait option. safe to clear choices out
          // otherwise, set choices to the list we get at the end of Travis content, or the empty list we get in the middle of Travis content
          choices: interruptible && line.canWait ? [] : choices,
          typing: false,
          timeouts: []
        }),
        // (function called after setState has happened, since React can actually set the state whenever it wants)
        () => {
          if (interruptible) {
            if (line.canWait) this.makeChoiceAndUpdateState('.wait');
          }
          else {
            this.continue();
          }
        }
      );
    }, line.thinkingTime + line.typingTime);

    const thinkingTimeout = setTimeout(() => {
      this.setState({typing: !line.tags.suppressTypingIndicator && !line.fromPlayer})
    }, line.thinkingTime);    
    
    this.setState({
      choices : interruptible ? choices.filter(c => c !== '.wait') : [],
      typing: false,
      interruptible: interruptible,
      timeouts: [typingTimeout, thinkingTimeout]
    });
  }

  makeChoiceAndUpdateState (choiceText) {
    this.setState(
      state => {
        setStoryVariable('just_interrupted', state.interruptible && state.timeouts.length !== 0);
        if (!state.interruptible) return null;

        state.timeouts.forEach(t => clearTimeout(t));
        return {
          interruptible: false,
          timeouts: []
        };
      },
      () => {
        makeChoice(choiceText);
        this.continue();
      }
    );
  }

  render () {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TopBar chatPartner={getStoryVariable('connected_user')} />
        <Messages chatPartner={getStoryVariable('connected_user')} lines={this.state.lines} />
        <BottomBar chatPartner={getStoryVariable('connected_user')} isTyping={this.state.typing} choices={this.state.choices} makeChoice={this.makeChoiceAndUpdateState} />
        {global.devEnv ? <DevClock /> : null}
      </ThemeProvider>
    );
  }

}
