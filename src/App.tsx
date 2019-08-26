import React from 'react';

import { Container } from './App.styles';
import Launcher from './Launcher';
import Runner from './Runner';
import Viewport from './Viewport';

interface Props {
  runner: Runner;
}

export default ({ runner }: Props) => (
  <Container>
    <Launcher runner={runner} />
    <Viewport />
  </Container>
);
