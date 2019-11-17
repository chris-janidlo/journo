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
    const fromPlayer = text.trim() === lastChoiceText.trim();

    const line = { text, fromPlayer, tags: {} };

    if (story.currentTags.length !== 0) {
      line.tags = parseTags(story.currentTags);
    }

    lines.push(line);
  }
  return lines;
}

function parseTags (tags) {
  let parsed = {};
  tags.forEach(t => {
    const split = t.split(' ');
    parsed[split[0]] = split[1];
  });
  return parsed;
}

export function getChoices () {
  return story.currentChoices.map(c => c.text);
}

export function makeChoice (index) {
  lastChoiceText = story.currentChoices[index].text;
	story.ChooseChoiceIndex(index);
}

let lastChoiceText = '';

export function millisecondsToType (line) {
  if (line.fromPlayer) return 0;

  const millisecondsPerCharacter = 12000 / story.variablesState['TRAVIS_WPM'];
  const scale = ('timescale' in line.tags) ? line.tags.timescale : 1;

  return millisecondsPerCharacter * line.text.length * scale;
}
