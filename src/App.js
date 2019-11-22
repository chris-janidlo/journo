import React, { Component } from 'react';
import { CssBaseline } from '@material-ui/core';
import { ThemeProvider } from '@material-ui/core/styles';
import { theme } from './theme';
import { TopBar } from './components/TopBar';
import { Messages } from './components/Messages';
import { BottomBar } from './components/BottomBar';
import {
  getNextLineAndChoices,
  makeChoice
} from './story';

export class App extends Component {

  constructor (props) {
    super(props);

    this.state = {
      lines: [],
      choices: [],
      typing: false,
      timeout: null,
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
    const int = line.tags.interruptible;

    // timeout for Travis to type his shit out
    const timeout = setTimeout(() => {
      this.setState(
        state => ({
          lines: line.text === '.wait'
            ? state.lines // suppress .wait since the player didn't type it out
            : state.lines.concat(line),
          // if we were interruptible, then we no longer care about the old choices since we've hit the timeout and are about to choose the .wait option. safe to clear choices out
          // otherwise, set choices to the list we get at the end of Travis content, or the empty list we get in the middle of Travis content
          choices: int ? [] : choices,
          typing: false,
          timeout: null
        }),
        // (function called after setState has happened, since React can actually set the state whenever it wants)
        () => {
          if (int) {
            this.makeChoiceAndUpdateState('.wait');
          }
          else {
            this.continueStory();
          }
        }
      );
    }, line.typingTime);
    
    this.setState({
      choices : int ? choices.filter(c => c !== '.wait') : [],
      typing: !line.tags.suppressTypingIndicator,
      interruptible: int,
      timeout
    });
  }

  makeChoiceAndUpdateState (choiceText) {
    this.setState(
      state => {
        if (state.interruptible) {
          clearTimeout(state.timeout);
          return {
            interruptible: false,
            timeout: null
          };
        }
        return null;
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
        <TopBar />
        <Messages lines={this.state.lines} isTyping={this.state.typing} />
        <BottomBar choices={this.state.choices} makeChoice={this.makeChoiceAndUpdateState} />
      </ThemeProvider>
    );
  }

}
