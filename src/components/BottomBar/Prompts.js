import React, { Fragment } from 'react';
import {
	Box,
	Typography,
	Table,
	TableBody,
	TableRow,
	TableCell,
	makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(theme => {
	const alignmentMargin = theme.spacing(3.5); // left-right margin needed for prompts to align properly with input

  return {
		promptBox: {
			overflowX: 'scroll',
			marginTop: theme.spacing(1.5),
			marginLeft: alignmentMargin,
			marginRight: alignmentMargin
		},
		promptTable: {
			marginBottom: theme.spacing(.5)
		},
		promptTableCell: {
			whiteSpace: 'nowrap',
			padding: 0
		},
		coloredText: {
			userSelect: 'none', // make unselectable (might not work in all browsers)
			fontFamily: "'Roboto Mono', monospace",
			whiteSpace: 'pre'
		}
	}
});

// prompt highlighting algorithm:
	// if inputLength is 0: color every prompt in grey.
	// else:
		// determine which prompt(s) starts with the most characters from the input - call that number n.
		// for the prompt(s) that share the first n characters with the input:
			// color the first n characters in black.
			// if the input is exactly n characters: color the rest of the characters grey.
			// else: color the next (inputLength - n) characters red.
		// for the prompt(s) that do not share the first n characters, color every character grey.

function arrayStartsWith (first, second) {
	for (let i = 0; i < second.length; i++) {
		if (first[i] !== second[i]) return false;
	}
	return true;
}

// takes text and color
// text is a string
// color is the Material UI Typography color attribute
function ColoredText (props) {
	const classes = useStyles();

	return (
		<Typography
			component='span'
			color={props.color}
			className={classes.coloredText}
		>
			{props.text}
		</Typography>
	)
}

function PromptWrapper (props) {
	const classes = useStyles();
	return (
		<TableCell className={classes.promptTableCell} align='center'>
			{props.children}
		</TableCell>
	);
}

function PromptSpacer (props) {
	const classes = useStyles();
	return (
		<TableCell className={classes.promptTableCell} style={{borderBottom:'none'}}>
			&emsp;&ensp;
		</TableCell>
	);
}

function GreyPrompt (props) {
	return (
		<PromptWrapper>
			<ColoredText text={props.text} color='secondary' />
		</PromptWrapper>
	);
}

function InteractivePrompt (props) {
	const inputSymbols = props.inputSymbols; // player input
	const targetSymbols = props.targetSymbols; // text for this prompt

	const n = props.longestStartsWithLength;

	if (inputSymbols.length === 0 || targetSymbols.length < n) return <GreyPrompt text={targetSymbols.join('')} />;
	
	let textElements = [];
	let sharedLength = 0;

	for (let i = 0; i < targetSymbols.length; i++) {
		if (i < inputSymbols.length && arrayStartsWith(targetSymbols, inputSymbols.slice(0, i + 1))) {
			sharedLength++;
			textElements.push(<ColoredText key={i} text={inputSymbols[i]} color='initial' />);
			props.setTypo(false);
		}
		else {
			if (sharedLength < n) {
				// another prompt starts with more characters from the input, so we can assume the player isn't trying to type this prompt out
				return <GreyPrompt text={targetSymbols.join('')} />;
			}
			else if (i < inputSymbols.length) {
				// this prompt has the most shared characters with the input, but the input has some amount of additional characters that aren't shared; those must be typos
				textElements.push(<ColoredText key={i} text={inputSymbols[i]} color='error' />);
				props.setTypo(true);
			}
			else if (sharedLength === n) {
				// this prompt has the most shared characters with the input, and we've exhausted the input but still have more target characters. color those in grey since we still need to type them
				textElements.push(<ColoredText key={i} text={targetSymbols[i]} color='secondary' />);
			}
			else if (sharedLength > n) {
				throw new Error('target should not share more characters with the input than we\'ve already calculated as the max');
			}
		}
	}

	// handle any extra input characters
	for (let i = targetSymbols.length; i < inputSymbols.length; i++) {
		textElements.push(<ColoredText key={i} text={inputSymbols[i]} color='error' />);
		props.setTypo(true);
	}

	return (
		<PromptWrapper>
			{textElements}
		</PromptWrapper>
	);
}

function PromptsWrapper (props) {
	const classes = useStyles();

	return (
		<Box className={classes.promptBox}>
			{/* use table for auto spacing and for the nice lines underneath */}
			<Table className={classes.promptTable}>
				<TableBody>
					<TableRow>
						{props.children}
					</TableRow>
				</TableBody>
			</Table>
		</Box>
	);
}

export function Prompts (props) {
	const choices = props.choices;
	if (!Array.isArray(choices) || !choices.length) {
		return (
			<PromptsWrapper>
				<GreyPrompt text='&ensp;' />
			</PromptsWrapper>
		);
	}

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

	let index = 0;

	return (
		<PromptsWrapper>
			{choices.map(c =>
				<Fragment key={index++}>
					{ c === choices[0] ? null : <PromptSpacer /> }
					<InteractivePrompt
						longestStartsWithLength={longestStartsWithLength}
						inputSymbols={inputSymbols}
						targetSymbols={[...c]}
						setTypo={props.setTypo}
					/>
				</Fragment>
			)}
		</PromptsWrapper>		
	);
}