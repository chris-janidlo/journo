import React, { Component } from 'react';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './theme';
import { TopBar } from './components/TopBar';
import { Messages } from './components/Messages';
import { BottomBar } from './components/BottomBar';
import {
  getNextLineAndChoices,
  makeChoice,
  getChatPartner
} from './story';

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
    this.continueStory = this.continueStory.bind(this);
  }

  componentDidMount () {
    this.continueStory();
  }

  continueStory () {
    const next = getNextLineAndChoices();

    if (next === null) return;

    const { line, choices } = next;
    const interruptible = line.tags.interruptible;
    const canWait = choices.includes('.wait');

    const typingTimeout = setTimeout(() => {
      this.setState(
        state => ({
          lines: state.lines.concat(line),
          // if we were interruptible, then we no longer care about the old choices since we've hit the timeout and are about to choose the .wait option. safe to clear choices out
          // otherwise, set choices to the list we get at the end of Travis content, or the empty list we get in the middle of Travis content
          choices: interruptible && canWait ? [] : choices,
          typing: false,
          timeout: null
        }),
        // (function called after setState has happened, since React can actually set the state whenever it wants)
        () => {
          if (interruptible) {
            if (canWait) this.makeChoiceAndUpdateState('.wait');
          }
          else {
            this.continueStory();
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
        if (!state.interruptible) return null;

        state.timeouts.forEach(t => clearTimeout(t));
        return {
          interruptible: false,
          timeouts: []
        };
      },
      () => {
        makeChoice(choiceText);
        this.continueStory();
      }
    );
  }

  render () {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TopBar chatPartner={getChatPartner()} />
        <Messages chatPartner={getChatPartner()} lines={this.state.lines} isTyping={this.state.typing} />
        <BottomBar choices={this.state.choices} makeChoice={this.makeChoiceAndUpdateState} />
      </ThemeProvider>
    );
  }

}
