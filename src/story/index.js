import { Story } from 'inkjs';
import storyContent from './content.json';

// these tags are never included in a line's metadata
const tagsToIgnore = [
  'author:',
  'title:'
];

// any time a line's tag matches one of the keys here, we also add every tag in the object associated with that key to the line's metadata
const impliedTags = {
  'system': { timescale: 0, suppressTypingIndicator: true }
}

const story = new Story(storyContent);

const getVariable = varName => story.variablesState[varName];
const setVariable = (varName, value) => story.variablesState[varName] = value;

let startTime = null;
story.BindExternalFunction("get_elapsed_seconds", () => {
  const currentTime = new Date();
  const origTime = startTime === null ? currentTime : startTime;
  return Math.floor((currentTime - origTime) / 1000);
});

function continueStory () {
  if (!story.canContinue) return null;

  const line = getLine();
  const choices = getChoices();

  if (line.tags.startTimer) startTime = new Date();
  line.canWait = choices.includes('.wait');

  return { line, choices };
}

function getLine () {
  const text = story.Continue().trim();
  const fromPlayer = text === lastChoiceText;

  // we put placeholder values here so that vs code knows what members line has
  const line = { text, fromPlayer, tags: {}, typingTime: null, thinkingTime: null, canWait: null };

  if (story.currentTags.length !== 0) {
    line.tags = parseTags(story.currentTags);
  }

  const { typingTime, thinkingTime } = timings(line);
  line.typingTime = typingTime;
  line.thinkingTime = thinkingTime;

  return line;
}

function parseTags (tags) {
  let parsed = {};
  tags.forEach(t => {
    const [tag, argument] = t.split(' ');
    if (tagsToIgnore.includes(tag)) return; // skip ignored tags
    parsed[tag] = argument === undefined ? true : argument; // if the tag has an argument, set the key's value to that argument. otherwise, treat the tag as a flag
    Object.assign(parsed, impliedTags[tag]); // copy subTags
  });
  return parsed;
}

function timings (line) {
  if (line.fromPlayer) return { typingTime: 0, thinkingTime: 0 };
  
  const typingMSPerCharacter = 12000 / story.variablesState['TRAVIS_WPM'];
  const typingChars = line.text.length;

  const thinkingMSPerCharacter = 12000 / story.variablesState['TRAVIS_TPM'];
  const thinkingChars = (line.text.length + (justResponded ? lastChoiceText.length : 0)) * (justResponded ? 1 : story.variablesState['FOLLOW_UP_TPM_SCALE']);
  justResponded = false;

  const flatDelay = ('delay' in line.tags) ? line.tags.delay * 1000 : 0;
  const scale = ('timescale' in line.tags) ? line.tags.timescale : 1;

  return {
    typingTime: typingMSPerCharacter * typingChars * scale,
    thinkingTime: thinkingMSPerCharacter * thinkingChars * scale + flatDelay
  };
}

const getChoices = () => story.currentChoices.map(c => c.text);

let lastChoiceText = '';
let justResponded = false;

function makeChoice (choiceText) {
  lastChoiceText = choiceText;
  justResponded = true;
  story.ChooseChoiceIndex(getChoices().indexOf(choiceText));
}

export { continueStory, makeChoice, getVariable as getStoryVariable, setVariable as setStoryVariable };
