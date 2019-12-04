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

// break in underline to visually space out prompts
function PromptSpacer (props) {
	const classes = useStyles();
	return (
		<TableCell className={classes.promptTableCell} style={{borderBottom:'none'}}>
			&emsp;&ensp;
		</TableCell>
	);
}

// prompt for a choice that definitely is not being typed out
function GreyPrompt (props) {
	return (
		<PromptWrapper>
			<ColoredText text={props.text} color='secondary' />
		</PromptWrapper>
	);
}

// prompt for a choice that may or may not be in the process of being typed out
function InteractivePrompt (props) {
	const inputSymbols = props.inputSymbols; // player input
	const targetSymbols = props.targetSymbols; // text for this prompt

	const n = props.longestStartsWithLength;

	// check if we know before doing anything else that the user isn't trying to type this choice out, and if so grey it
	if (inputSymbols.length === 0 || targetSymbols.length < n) return <GreyPrompt text={targetSymbols.join('')} />;
	
	const coloredSymbols = [];
	let sharedLength = 0; // number of symbols shared between the start of input and target symbols

	for (let i = 0; i < targetSymbols.length; i++) {
		if (i < inputSymbols.length && arrayStartsWith(targetSymbols, inputSymbols.slice(0, i + 1))) {
			// the happy path; every input symbol so far is shared with the target
			sharedLength++;
			coloredSymbols.push(<ColoredText key={i} text={inputSymbols[i]} color='initial' />);
			props.setTypo(false);
		}
		else if (sharedLength < n) {
			// another prompt's choice starts with more characters from the input, so we can assume the player isn't trying to type this choice out
			return <GreyPrompt text={targetSymbols.join('')} />;
		}
		else if (i < inputSymbols.length) {
			// this target has the most shared symbols but some of the input symbols are not accounted for and must be typos
			coloredSymbols.push(<ColoredText key={i} text={inputSymbols[i]} color='error' />);
			props.setTypo(true);
		}
		else if (sharedLength === n) {
			// this target has the most shared symbols with the input, and we've exhausted the input but still have more target characters. color those in grey since we still need to type them
			coloredSymbols.push(<ColoredText key={i} text={targetSymbols[i]} color='secondary' />);
		}
		else {
			// if sharedLength > n
			throw new Error('target should not share more characters with the input than we\'ve already calculated as the max');
		}
	}

	// handle any additional symbols beyond the target length. every one of these additional symbols must be a typo
	for (let i = targetSymbols.length; i < inputSymbols.length; i++) {
		coloredSymbols.push(<ColoredText key={i} text={inputSymbols[i]} color='error' />);
		props.setTypo(true);
	}

	return (
		<PromptWrapper>
			{coloredSymbols}
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