import React, { Fragment, PureComponent, createRef, forwardRef } from 'react';
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

// takes text and color
// text is a string
// color is one of 'regular', 'grey', and 'error'
const ColoredText = forwardRef(({ text, color }, ref) => {
	const classes = useStyles();

	const colorMap = {
		'correct': 'initial',
		'grey': 'secondary',
		'error': 'error'
	};

	if (!(color in colorMap)) {
		throw new Error(`unexpected color value ${color} (expected one of ${Object.keys(colorMap)})`);
	}

	return (
		<Typography
			component='span'
			color={colorMap[color]}
			className={classes.coloredText}
			style={{backgroundColor: color === 'error' ? '#ffdddd' : 'inherit'}}
			ref={ref}
		>
			{text}
		</Typography>
	);
});

function PromptWrapper ({ children }) {
	const classes = useStyles();

	return (
		<TableCell className={classes.promptTableCell} align='center'>
			{children}
		</TableCell>
	);
}

// break in underline to visually space out prompts
function PromptSpacer () {
	const classes = useStyles();
	return (
		<TableCell className={classes.promptTableCell} style={{borderBottom:'none'}}>
			&emsp;&ensp;
		</TableCell>
	);
}

// prompt for a choice that definitely is not being typed out
function GreyPrompt ({ text }) {
	return (
		<PromptWrapper>
			<ColoredText text={text} color='grey' />
		</PromptWrapper>
	);
}

// prompt for a choice that may or may not be in the process of being typed out
const InteractivePrompt = React.forwardRef(({ inputSymbols, targetSymbols, longestSharedLength, setTypo }, ref) => {
	// check if we know before doing anything else that the user isn't trying to type this choice out, and if so grey it
	if (inputSymbols.length === 0 || targetSymbols.length < longestSharedLength) return <GreyPrompt text={targetSymbols.join('')} />;

	const coloredSymbols = [];
	let sharedLength = 0; // number of symbols shared between the start of input and target symbols
	let shareEverySymbolSoFar = true; // true if the first i members of inputSymbols and targetSymbols are the same
	let haveSentRef = false;

	for (let i = 0; i < targetSymbols.length; i++) {
		// check for parsing errors first
		if (sharedLength > longestSharedLength) {
			throw new Error('target should not share more characters with the input than we\'ve already calculated as the max');
		}

		shareEverySymbolSoFar = shareEverySymbolSoFar && (inputSymbols[i] === targetSymbols[i]);

		if (!shareEverySymbolSoFar && sharedLength < longestSharedLength) {
			// another prompt's choice starts with more characters from the input, so we can assume the player isn't trying to type this choice out
			return <GreyPrompt text={targetSymbols.join('')} />;
		}
		
		const processingInput = i < inputSymbols.length;

		if (processingInput) {
			if (shareEverySymbolSoFar) sharedLength++;
			setTypo(!shareEverySymbolSoFar);
		}

		// if we're on a grey symbol and haven't set the ref yet, it's time to set the ref
		const shouldSendRef = !haveSentRef && !processingInput;

		coloredSymbols.push(
			<ColoredText
				key={i}
				text={(processingInput ? inputSymbols : targetSymbols)[i]}
				color={processingInput ? (shareEverySymbolSoFar ? 'correct' : 'error') : 'grey'}
				ref={shouldSendRef ? ref : null}
			/>
		);

		if (!haveSentRef) haveSentRef = shouldSendRef;
	}

	// handle any additional symbols beyond the target length. every one of these additional symbols must be a typo
	for (let i = targetSymbols.length; i < inputSymbols.length; i++) {
		const shouldSendRef = !haveSentRef && i === inputSymbols.length - 1;

		coloredSymbols.push(
			<ColoredText
				key={i}
				text={inputSymbols[i]}
				color='error'
				ref={shouldSendRef ? ref : null}
			/>
		);

		setTypo(true);
	}

	return (
		<PromptWrapper>
			{coloredSymbols}
		</PromptWrapper>
	);
});

function PromptsWrapper ({ children }) {
	const classes = useStyles();

	return (
		<Box className={classes.promptBox}>
			{/* use table for auto spacing and for the nice lines underneath */}
			<Table className={classes.promptTable}>
				<TableBody>
					<TableRow>
						{children}
					</TableRow>
				</TableBody>
			</Table>
		</Box>
	);
}

function arrayStartsWith (first, second) {
	for (let i = 0; i < second.length; i++) {
		if (first[i] !== second[i]) return false;
	}
	return true;
}

// PureComponent is necessary here because if the component re-renders it will call setTypo, which is often not wanted (for instance, if the player hits enter on an incomplete but otherwise typo-free input. BottomBar will setTypo to true, but the InteractivePrompt in here will setTypo to false)
export class Prompts extends PureComponent {

	numNonGreyPrompts = 0; // use a class variable instead of state because we need to change this in the render method

	constructor (props) {
		super(props);

		this.leadingCharacterRef = createRef();
		this.scrollToLatestCharacter = this.scrollToLatestCharacter.bind(this);
	}

	scrollToLatestCharacter () {
		if (this.numNonGreyPrompts === 1 && this.leadingCharacterRef.current !== null) {
			this.leadingCharacterRef.current.scrollIntoView();
		}
	}

	render () {
		const { choices, inputText, setTypo } = this.props;

		this.numNonGreyPrompts = 0;

		if (!Array.isArray(choices) || !choices.length) {
			return (
				<PromptsWrapper>
					<GreyPrompt text='&ensp;' />
				</PromptsWrapper>
			);
		}

		const inputSymbols = [...inputText]; // in case input contains unicode (https://stackoverflow.com/q/46157867/5931898)
		const choiceSymbols = choices.map(c => [...c]);

		let longestSharedLength = 0;

		if (inputSymbols.length !== 0) {
			for (let i = 0; i < inputSymbols.length; i++) {
				const n = choiceSymbols.filter(c => arrayStartsWith(c, inputSymbols.slice(0, i + 1))).length;
				if (n !== 0) {
					longestSharedLength++;
					this.numNonGreyPrompts = n; // only set this when n isn't 0 because we don't want to lose the value when we get past all the shared characters
				}
			}
		}
		else {
			setTypo(false);
		}

		let index = 0;

		return (
			<PromptsWrapper>
				{choiceSymbols.map(c =>
					<Fragment key={index++}>
						{ c === choiceSymbols[0] ? null : <PromptSpacer /> }
						<InteractivePrompt
							longestSharedLength={longestSharedLength}
							inputSymbols={inputSymbols}
							targetSymbols={c}
							setTypo={setTypo}
							ref={this.leadingCharacterRef}
						/>
					</Fragment>
				)}
			</PromptsWrapper>		
		);
	}

	componentDidUpdate () {
		this.scrollToLatestCharacter();
	}

}
