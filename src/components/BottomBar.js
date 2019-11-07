import React from 'react';
import {
	Box,
	Paper,
	InputBase,
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
		mainInput: {
			backgroundColor: theme.palette.secondary.main,
			marginLeft: margin,
			marginRight: margin,
			marginTop: margin,
			marginBottom: margin
		}
	}
});

export function BottomBar (props) {
  const classes = useStyles();
  return (
    <Paper elevation={4} square className={classes.bottomBar}>
      <Paper elevation={0} className={classes.mainInput}>
        <Box m={1.2}>
          <InputBase fullWidth placeholder='Say something...'/>
        </Box>
      </Paper>
    </Paper>
  );
}
