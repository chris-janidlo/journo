import { Story } from 'inkjs';
import storyContent from './content.json';

const story = new Story(storyContent);

const _startTime = new Date();
story.BindExternalFunction("get_elapsed_seconds", () => {
  const currentTime = new Date();
  return Math.floor((currentTime - _startTime) / 1000);
});

export function getLines () {
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

export function getChoices () {
  return story.currentChoices.map(c => c.text);
}

export function makeChoice (index) {
	story.ChooseChoiceIndex(index);
}
