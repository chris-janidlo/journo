import React, { Fragment } from 'react';
import { TopBar } from './components/TopBar';
import { Messages } from './components/Messages';
import { BottomBar } from './components/BottomBar';
import {
  getLines,
  getChoices,
  makeChoice
} from './story';

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
    makeChoice(choiceIndex);

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
