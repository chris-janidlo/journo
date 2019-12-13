import React, { useState, useEffect } from 'react';
import {
	elapsedSeconds,
	remainingSeconds
} from '../story';

export function DevClock (props) {
	const [elapsed, setElapsed] = useState(elapsedSeconds());
	const [remaining, setRemaining] = useState(remainingSeconds());

	useEffect(() => {
		setInterval(() => {
			setElapsed(elapsedSeconds());
			setRemaining(remainingSeconds());
		}, 1000);
	});

	return (
		<div style={{
			position: 'fixed',
			top: 0,
			right: 0,
			backgroundColor: 'white',
			zIndex: '99999'
		}}>
			e:{elapsed}&ensp;r:{remaining}&ensp;({(remaining / 60).toFixed(2)})
		</div>
	)
}
