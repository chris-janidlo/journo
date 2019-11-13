import React, { Fragment } from 'react';
import storyContent from './story.json';
import { Story } from 'inkjs';
import { TopBar } from './components/TopBar';
import { Messages } from './components/Messages';
import { BottomBar } from './components/BottomBar';

const story = new Story(storyContent);

function getLines () {
  const lines = [];
  while (story.canContinue) {
    const text = story.Continue();
    lines.push({
      text,
      tags: story.currentTags
    });
  }
  return lines;
}

function getChoices () {
  return story.currentChoices.map(c => c.text);
}

const _startTime = new Date();
story.BindExternalFunction("get_elapsed_seconds", () => {
  const currentTime = new Date();
  return Math.floor((currentTime - _startTime) / 1000);
});



export class App extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      lines: getLines(),
      choices: getChoices()
    }

    this.makeChoice = this.makeChoice.bind(this);
  }

  makeChoice (choiceIndex) {
    story.ChooseChoiceIndex(choiceIndex);

    this.setState((state) => {
      return {
        lines: state.lines.concat(getLines()),
        choices: getChoices()
      };
    });
  }

  render () {
    return (
      <Fragment>
        <TopBar />
        <Messages lines={this.state.lines} />
        <BottomBar choices={this.state.choices} makeChoice={this.makeChoice} />
      </Fragment>
    );
  }

}
