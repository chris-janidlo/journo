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

const timeWarnings = [
  { 'minutes': 10, 'warning': "Also don't forget that I have to leave in 10 minutes." },
  { 'minutes':  5, 'warning': "Oh, and 5 minute warning." },
  { 'minutes':  3, 'warning': "And are we almost done? Only have 3 more minutes." },
  { 'minutes':  2, 'warning': "(2 minute warning.)" },
  { 'minutes':  1, 'warning': "(1 minute warning!!)" }
];
let currentTimeMilestone = 0; // for tracking

const story = new Story(storyContent);

const getVariable = varName => story.variablesState[varName];
const setVariable = (varName, value) => story.variablesState[varName] = value;

let startTime = null;

function elapsedSeconds () {
  const currentTime = new Date();
  const origTime = startTime === null ? currentTime : startTime;
  return Math.floor((currentTime - origTime) / 1000);
}

function totalSeconds () { return getVariable('MAX_INTERVIEW_TIME'); }

function remainingSeconds () { return totalSeconds() - elapsedSeconds(); }

function timeDurationToString (seconds) {
  if (seconds <= 45) return seconds + " seconds";

  let minutes = Math.floor(seconds / 60)
  const extra_seconds = seconds - (minutes * 60)
  
  const about_string = (extra_seconds <= 10 || extra_seconds >= 50 || (extra_seconds >= 20 && extra_seconds <= 40)) ? "" : "about "
  const and_a_half_string = (extra_seconds >= 15 && extra_seconds < 45) ? " and a half" : "";

  // round up
  if (extra_seconds >= 45) minutes++;

  if (minutes === 1) {
    return about_string + "a minute" + and_a_half_string;
  }
  else {
    return about_string + minutes + and_a_half_string + " minutes";
  }
}

function remainingTimeToString () { return timeDurationToString(remainingSeconds()); }

story.BindExternalFunction("get_elapsed_seconds", elapsedSeconds);
// atm this is so you can capitalize any given string in ink. might want to just *always* capitalize every travis string, though, since that makes stringing content together more flexible
story.BindExternalFunction("capitalize", string => string[0].toUpperCase() + string.slice(1));
story.BindExternalFunction("time_duration_to_string", timeDurationToString);
story.BindExternalFunction("remaining_time_to_string", remainingTimeToString);
story.BindExternalFunction("total_time_to_string", () => timeDurationToString(totalSeconds()));

function continueStory () {
  const line = getLine();

  if (line === null) return null;
  
  const choices = getChoices();

  if (line.tags.startTimer) startTime = new Date();
  line.canWait = choices.includes('.wait');

  return { line, choices };
}

function getLine () {
  const warning = story.canContinue ? null : getTimeWarning();
  if (!story.canContinue && warning === null) return null;

  const text = story.canContinue ? story.Continue().trim() : warning;
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

function getTimeWarning () {
  if (currentTimeMilestone >= timeWarnings.length) return null;

  const remaining = remainingSeconds();

  // get the latest warning that applies
  let warning = null;
  while (remaining <= timeWarnings[currentTimeMilestone].minutes * 60) {
    warning = timeWarnings[currentTimeMilestone++].warning;
  }

  return warning;
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
  
  const typingMSPerCharacter = 12000 / getVariable('TRAVIS_WPM');
  const typingChars = line.text.length;

  const thinkingMSPerCharacter = 12000 / getVariable('TRAVIS_TPM');
  const thinkingChars = (line.text.length + (justResponded ? lastChoiceText.length : 0)) * (justResponded ? 1 : getVariable('FOLLOW_UP_TPM_SCALE'));
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

export {
  continueStory,
  makeChoice,
  getVariable as getStoryVariable,
  setVariable as setStoryVariable,
};
