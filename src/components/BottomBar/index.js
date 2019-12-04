import React, { useState } from 'react';
import { Prompts } from './Prompts';
import {
	Paper,
	TextField,
	Typography,
	makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(theme => {
	const inputMargin = theme.spacing(2);

  return {
		bottomBar: {
			width: '100vw',
			position: 'fixed',
			bottom: 0
		},
		input: {
			width: `calc(100vw - ${2 * inputMargin}px)`,
			margin: inputMargin,
			marginTop: theme.spacing(.5),
			marginBottom: theme.spacing(4),
			borderRadius: theme.shape.borderRadius,
			backgroundColor: '#f2f2f2',
		},
    typingIndicator: {
      position: 'absolute',
      left: inputMargin,
      bottom: theme.spacing(.5)
    }
	}
});

function TypingIndicator (props) {
	const classes = useStyles();

  if (!props.active) return null;

  return (
    <Typography className={classes.typingIndicator} color='secondary'>
      <i>{props.chatPartner} is typing...</i>
    </Typography>
  )
}

export function BottomBar (props) {
	const classes = useStyles();
	
	const [inputText, setInputText] = useState('');
	const [typo, setTypo] = useState(false);
	
	const choices = props.choices;

	// if the user hits enter while there are no prompts, then the textfield will remain in an error state until new prompts come in. this function checks if we're in such a state, and if we are, clears the typo state. should only be called where the user is modifying text but not hitting the enter key
	function clearEmptyEnterTypo () {
		if (typo && choices.length === 0) setTypo(false);
	}

	function onKeyDown (e) {
		if (e.key === 'Backspace') clearEmptyEnterTypo();
	}
	
	function onKeyPress (e) {
		if (e.key !== 'Enter') {
			clearEmptyEnterTypo();
			return;
		}
		
		if (choices.includes(inputText)) {
			props.makeChoice(inputText);
			setInputText('');
		}
		else {
			setTypo(true);
		}

		e.preventDefault();
	}

  return (
    <Paper className={classes.bottomBar} elevation={2} square>
			<Prompts
				choices={choices}
				inputText={inputText}
				setTypo={setTypo}
			/>
			<form autoCapitalize='none' autoComplete='off' autoCorrect='off'>
				<TextField
					className={classes.input}
					variant='outlined'
					margin='dense'
					placeholder='Say something...'
					autoFocus
					error={typo}
					value={inputText}
					onKeyPress={onKeyPress}
					onKeyDown={onKeyDown}
					onPaste={e => e.preventDefault()} // disable paste
					onChange={e => setInputText(e.target.value)}
				/>
			</form>
      <TypingIndicator active={props.isTyping} chatPartner={props.chatPartner} />
    </Paper>
  );
}
