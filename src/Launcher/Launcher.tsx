import React from 'react';
import { connect } from 'react-redux';

import { Dispatch, launchGame } from 'actions';
import { State } from 'reducer';

import Runner from '../Runner';
import FileSelector from './FileSelector';
import { Container } from './Launcher.styles';

interface OwnProps {
  runner: Runner;
}

interface StateProps {
  viewportWidth: number;
}

interface DispatchProps {
  launchGame(file: File): void;
}

type Props = OwnProps & StateProps & DispatchProps;

const Launcher = (props: Props) => (
  <Container viewportWidth={props.viewportWidth}>
    <FileSelector onFileSelected={props.launchGame} />
  </Container>
);

const mapStateToProps = (
  state: State,
  props: OwnProps,
): OwnProps & StateProps => ({
  runner: props.runner,
  viewportWidth: state.viewportSize.width,
});

const mapDispatchToProps = (
  dispatch: Dispatch,
  props: OwnProps,
): DispatchProps => ({
  launchGame: (payload) => dispatch(launchGame(props.runner, payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Launcher);
