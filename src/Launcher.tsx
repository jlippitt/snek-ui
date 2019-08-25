import React from 'react';
import { connect } from 'react-redux';

import FileSelector from './FileSelector';
import { Container } from './Launcher.styles';
import { State } from './reducer';

interface Props {
  viewportWidth: number;
}

const Launcher = (props: Props) => (
  <Container viewportWidth={props.viewportWidth}>
    <FileSelector />
  </Container>
);

const mapStateToProps = (state: State): Props => ({
  viewportWidth: state.viewportSize.width,
});

export default connect(mapStateToProps)(Launcher);
