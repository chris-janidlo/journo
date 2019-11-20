import React, { Fragment } from 'react';
import {
	Box,
	Container,
	Typography,
	Table,
	TableBody,
	TableRow,
	TableCell,
	makeStyles
} from '@material-ui/core';

const useStyles = makeStyles(theme => {
  return {
		promptList: {
			overflowX: 'scroll',
			paddingBottom: theme.spacing(2),
			marginTop: theme.spacing(1.5)
		},
		tableCell: {
			whiteSpace: 'nowrap',
			padding: 0
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
			style={{userSelect:'none'}} // make unselectable (TODO: might not work in all browsers)
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

	if (inputSymbols.length === 0 || targetSymbols.length < n) {
		greyed = true;
	}
	else {
		for (let i = 0; i < targetSymbols.length; i++) {
			if (i < inputSymbols.length && arrayStartsWith(targetSymbols, inputSymbols.slice(0, i + 1))) {
				sharedLength++;
				textElements.push(<ColoredText key={i} text={inputSymbols[i]} color='initial' />);
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
					textElements.push(<ColoredText key={i} text={inputSymbols[i]} color='error' />);
					props.setTypo(true);
				}
				else {
					// this prompt has the most shared characters with the input, and we've exhausted the input but still have more target characters. color those in grey since we still need to type them
					textElements.push(<ColoredText key={i} text={targetSymbols[i]} color='secondary' />);
				}
			}
		}

		if (!greyed) {
			// handle any extra input characters
			for (let i = targetSymbols.length; i < inputSymbols.length; i++) {
				textElements.push(<ColoredText key={i} text={inputSymbols[i]} color='error' />);
				props.setTypo(true);
			}
		}
	}

	return (
		<TableCell className={classes.tableCell}>
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

export function Prompts (props) {
	const classes = useStyles();

	const choices = props.choices;
	if (!Array.isArray(choices) || !choices.length) return null;

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

	// creates break in line underneath prompts
	const spacer = (
		<TableCell style={{borderBottom:'none'}} className={classes.tableCell}>
			&ensp;
		</TableCell>
	);

	return (
		<Container>
			<Box className={classes.promptList}>
				{/* use table for auto spacing and for the nice lines underneath */}
				<Table>
					<TableBody>
						<TableRow>
							{choices.map(c =>
								<Fragment key={index++}>
									{ c === choices[0] ? null : spacer }
									<Prompt
										longestStartsWithLength={longestStartsWithLength}
										inputSymbols={inputSymbols}
										targetSymbols={[...c]}
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