import React from 'react';
import Container from '@material-ui/core/Container';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import storyContent from './story.json';
import { Story } from 'inkjs';

export default function App() {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          {new Story(storyContent).ContinueMaximally()}
        </Typography>
      </Box>
    </Container>
  );
}
