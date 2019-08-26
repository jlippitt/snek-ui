import React from 'react';
import { connect } from 'react-redux';

import { Dispatch, launchGame, resetGame } from 'actions';
import { State } from 'reducer';

import Runner from '../Runner';
import FileSelector from './FileSelector';
import { Container } from './Launcher.styles';

interface OwnProps {
  runner: Runner;
}

interface StateProps {
  viewportWidth: number;
  isRunning: boolean;
}

interface DispatchProps {
  launchGame(file: File): void;
  resetGame(): void;
}

type Props = OwnProps & StateProps & DispatchProps;

const Launcher = (props: Props) => (
  <Container viewportWidth={props.viewportWidth}>
    <FileSelector onFileSelected={props.launchGame} />
    <button onClick={props.resetGame} disabled={!props.isRunning}>
      Reset
    </button>
  </Container>
);

const mapStateToProps = (
  state: State,
  props: OwnProps,
): OwnProps & StateProps => ({
  runner: props.runner,
  viewportWidth: state.viewportSize.width,
  isRunning: !!state.canvas,
});

const mapDispatchToProps = (
  dispatch: Dispatch,
  props: OwnProps,
): DispatchProps => ({
  launchGame: (payload) => dispatch(launchGame(props.runner, payload)),
  resetGame: () => dispatch(resetGame(props.runner)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Launcher);
