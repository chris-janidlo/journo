import React, { useState } from 'react';
import { Prompts } from './Prompts';
import {
	Paper,
	TextField,
	makeStyles
} from '@material-ui/core';

// TODO: clear error out when prompts become empty

const useStyles = makeStyles(theme => {
	const margin = theme.spacing(2);
  return {
		bottomBar: {
			width: '100vw',
			position: 'fixed',
			bottom: 0
		},
		input: {
			width: `calc(100vw - ${2 * margin}px)`,
			margin: margin,
			marginTop: theme.spacing(.5),
			borderRadius: theme.shape.borderRadius,
			backgroundColor: '#f2f2f2',
		}
	}
});

export function BottomBar (props) {
	const classes = useStyles();
	
	const [inputText, setInputText] = useState('');
	const [typo, setTypo] = useState(false);
	
	function onKeyPress (e) {
		if (e.key !== 'Enter') return;
		
		if (props.choices.includes(inputText)) {
			props.makeChoice(inputText);
			setInputText('');
		}
		else {
			setTypo(true);
		}
	}

  return (
    <Paper className={classes.bottomBar} elevation={4} square>
			<Prompts
				choices={props.choices}
				inputText={inputText}
				setTypo={setTypo}
			/>
			<TextField
				className={classes.input}
				variant='outlined'
				margin='dense'
				autoFocus
				placeholder='Say something...'
				error={typo}
				onKeyPress={onKeyPress}
				value={inputText}
				onPaste={e => e.preventDefault()} // disable paste
				onChange={o => {
					setInputText(o.target.value);
				}}
			/>
    </Paper>
  );
}
