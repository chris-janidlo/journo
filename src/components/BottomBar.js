import React, { Fragment, useState } from 'react';
import {
	Paper,
	TextField,
	Box,
	Table,
	TableBody,
	TableRow,
	TableCell,
	Container,
	Typography,
	makeStyles
} from '@material-ui/core';

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
		},
		promptList: {
			overflowX: 'scroll',
			paddingBottom: margin,
			marginTop: theme.spacing(1.5)
		},
		prompt: {
			whiteSpace: 'nowrap',
			padding: 0
		}
	}
});

function arrayStartsWith (first, second) {
	for (let i = 0; i < second.length; i++) {
		if (first[i] !== second[i]) return false;
	}
	return true;
}

// takes text and color
// text can be either a string or array of strings
// color is the Material UI Typography color attribute
function ColoredText (props) {
	let text = '';

	if (props.text.isArray) {
		text = props.text.join('');
	}
	else {
		text = props.text;
	}

	return (
		<Typography
			component='span'
			color={props.color}
		>
			{text}
		</Typography>
	)
}

function Prompt (props) {
	const classes = useStyles();

	const inputSymbols = props.inputSymbols; // player input
	const targetSymbols = props.targetSymbols; // text for this prompt

	const n = props.longestStartsWithLength;

	let textElements = [];
	let sharedLength = 0;
	let greyed = false;

	if (inputSymbols.length === 0) {
		greyed = true;
	}
	else {
		for (let i = 0; i < targetSymbols.length; i++) {
			if (i < inputSymbols.length && arrayStartsWith(targetSymbols, inputSymbols.slice(0, i + 1))) {
				sharedLength++;
				textElements.push(<ColoredText text={inputSymbols[i]} color='initial' />);
				props.setTypo(false);
			}
			else {
				if (sharedLength !== n) {
					if (sharedLength > n) {
						throw new Error('target should not share more characters with the input than we\'ve already calculated as the max');
					}
					// another prompt starts with more characters from the input, so we can assume the player isn't trying to type this prompt out
					greyed = true;
					break;
				}
				else if (inputSymbols.length > i) {
					// this prompt has the most shared characters with the input, but the input has some amount of additional characters that aren't shared; those must be typos
					textElements.push(<ColoredText text={inputSymbols[i]} color='error' />);
					props.setTypo(true);
				}
				else {
					// this prompt has the most shared characters with the input, and we've exhausted the input but still have more target characters. color those in grey since we still need to type them
					textElements.push(<ColoredText text={targetSymbols[i]} color='secondary' />);
				}
			}
		}
		// handle any extra input characters
		for (let i = targetSymbols.length; i < inputSymbols.length; i++) {
			textElements.push(<ColoredText text={inputSymbols[i]} color='error' />);
			props.setTypo(true);
		}
	}

	return (
		<TableCell className={classes.prompt}>
			<Typography align='center'>
				{
					greyed
						? <ColoredText text={targetSymbols} color='secondary' />
						: textElements
				}
			</Typography>
		</TableCell>
	);
}

// FIXME: case where one prompt is a strict substring of another. ie if one is 'open' and another is 'opened', typing 'opened' will result in appending a red 'ed' to the 'open'
// prompt highlighting algorithm:
	// if inputLength is 0: color every prompt in grey.
	// else:
		// determine which prompt(s) starts with the most characters from the input - call that number n.
		// for the prompt(s) that share the first n characters with the input:
			// color the first n characters in black.
			// if the input is exactly n characters: color the rest of the characters grey.
			// else: color the next (inputLength - n) characters red.
		// for the prompt(s) that do not share the first n characters, color every character grey.

function Prompts (props) {
	const classes = useStyles();

	const choices = props.choices;
	if (!Array.isArray(choices) || !choices.length) return null;

	const firstPrompt = choices[0];
	const prompts = choices.slice(1);

	const inputSymbols = [...props.inputText]; // in case input contains unicode (https://stackoverflow.com/q/46157867/5931898)

	let longestStartsWithLength = 0;

	if (inputSymbols.length !== 0) {
		for (let i = 0; i < inputSymbols.length; i++) {
			if (choices.some(p => arrayStartsWith([...p], inputSymbols.slice(0, i + 1)))) {
				longestStartsWithLength = i + 1;
			}
		}
	}
	else {
		props.setTypo(false);
	}

	return (
		<Container>
			<Box className={classes.promptList}>
				{/* use table for auto spacing and for the nice lines underneath */}
				<Table>
					<TableBody>
						<TableRow>
							<Prompt
								longestStartsWithLength={longestStartsWithLength}
								inputSymbols={inputSymbols}
								targetSymbols={[...firstPrompt]}
								setTypo={props.setTypo}
							/>
							{prompts.map(p =>
								<Fragment>
									&emsp; {/* tab character for spacing */}
									<Prompt
										longestStartsWithLength={longestStartsWithLength}
										inputSymbols={inputSymbols}
										targetSymbols={[...p]}
										setTypo={props.setTypo}
										/>
								</Fragment>
							)}
						</TableRow>
					</TableBody>
				</Table>
			</Box>
		</Container>
	);
}

function Input (props) {
	const classes = useStyles();
	return (
		<TextField
			className={classes.input}
			variant='outlined'
			margin='dense'
			placeholder='Say something...'
			error={props.typo}
			onKeyPress={props.onKeyPress}
			onChange={o => props.onChange(o.target.value)}
		/>
	);
}

export function BottomBar (props) {
	const classes = useStyles();
	
	const [inputText, setInputText] = useState('');
	const [typo, setTypo] = useState(false);

	function onKeyPress (e) {
		if (e.key !== 'Enter') return;

		if (props.choices.includes(inputText)) {
			props.makeChoice(props.choices.indexOf(inputText));
		}
		else {
			setTypo(true);
		}
	}

  return (
    <Paper className={classes.bottomBar} elevation={4} square>
			<Prompts choices={props.choices} inputText={inputText} setTypo={setTypo} />
			<Input onChange={setInputText} onKeyPress={onKeyPress} typo={typo} />
    </Paper>
  );
}
