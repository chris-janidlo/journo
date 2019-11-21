import { Story } from 'inkjs';
import storyContent from './content.json';

const story = new Story(storyContent);

const _startTime = new Date();
story.BindExternalFunction("get_elapsed_seconds", () => {
  const currentTime = new Date();
  return Math.floor((currentTime - _startTime) / 1000);
});

function getNextLineAndChoices () {
  if (!story.canContinue) return null;

  const line = getLine();
  const choices = getChoices();

  return {
    line,
    choices
  };
}

function getLine () {
  const text = story.Continue().trim();
  const fromPlayer = text === lastChoiceText;

  const line = { text, fromPlayer, tags: {}, typingTime: null };

  if (story.currentTags.length !== 0) {
    line.tags = parseTags(story.currentTags);
  }

  line.typingTime = millisecondsToType(line);

  return line;
}

function parseTags (tags) {
  let parsed = {};
  tags.forEach(t => {
    const split = t.split(' ');
    if (tagsToIgnore.includes(split[0])) return; // skip ignored tags
    // if the tag has an argument, set the key's value to that argument. otherwise, treat the tag as a flag
    parsed[split[0]] = split.length === 2 ? split[1] : true;
  });
  return parsed;
}

function millisecondsToType (line) {
  if (line.fromPlayer) return 0;
  
  const millisecondsPerCharacter = 12000 / story.variablesState['TRAVIS_WPM'];
  const scale = ('timescale' in line.tags) ? line.tags.timescale : 1;
  
  return millisecondsPerCharacter * line.text.length * scale;
}

const tagsToIgnore = ['author:', 'title:'];

const getChoices = () => story.currentChoices.map(c => c.text);

function makeChoice (choiceText) {
  lastChoiceText = choiceText;
  story.ChooseChoiceIndex(getChoices().indexOf(choiceText));
}

let lastChoiceText = '';

export { getNextLineAndChoices, makeChoice };
