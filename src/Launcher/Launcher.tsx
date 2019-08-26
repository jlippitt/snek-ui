import React from 'react';
import { connect } from 'react-redux';

import { Dispatch, launchGame } from 'actions';
import { State } from 'reducer';

import FileSelector from './FileSelector';
import { Container } from './Launcher.styles';

interface StateProps {
  viewportWidth: number;
}

interface DispatchProps {
  launchGame(file: File): void;
}

type Props = StateProps & DispatchProps;

const Launcher = (props: Props) => (
  <Container viewportWidth={props.viewportWidth}>
    <FileSelector onFileSelected={props.launchGame} />
  </Container>
);

const mapStateToProps = (state: State): StateProps => ({
  viewportWidth: state.viewportSize.width,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  launchGame: (payload) => dispatch(launchGame(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Launcher);
