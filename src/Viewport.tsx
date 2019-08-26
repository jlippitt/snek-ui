import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Size } from 'snek-client';

import { setViewportSize } from './actions';
import randomId from './helpers/randomId';
import { State as AppState } from './reducer';
import { Container, Placeholder } from './Viewport.styles';

const CONTAINER_ID_PREFIX = 'snek-screen-';
const DEFAULT_WIDTH = 256;
const DEFAULT_HEIGHT = 240;

interface StateProps {
  screenSize: Size;
  viewportSize: Size;
  canvas?: HTMLCanvasElement;
}

interface DispatchProps {
  setViewportSize(payload: Size): void;
}

type Props = StateProps & DispatchProps;

interface State {
  containerId: string;
}

class Viewport extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      containerId: randomId(CONTAINER_ID_PREFIX),
    };
  }

  private resizeViewport = (): void => {
    const { screenSize } = this.props;
    const { containerId } = this.state;

    const container = document.getElementById(containerId);
    const maxWidthScale = Math.floor(container!.offsetWidth / screenSize.width);
    const maxHeightScale = Math.floor(container!.offsetHeight / screenSize.height);
    const scaleFactor = Math.min(maxWidthScale, maxHeightScale);

    const outerWidth = innerWidth * scaleFactor;
    const outerHeight = innerHeight * scaleFactor;

    this.props.setViewportSize({
      width: screenSize.width * scaleFactor,
      height: screenSize.height * scaleFactor,
    });
  };

  public componentDidMount(): void {
    const { viewportSize, canvas } = this.props;
    const { containerId } = this.state;

    if (canvas) {
      const container = document.getElementById(containerId);
      canvas.width = viewportSize.width;
      canvas.height = viewportSize.height;
      container!.appendChild(canvas);
    }

    this.resizeViewport();

    window.addEventListener('resize', this.resizeViewport);
  }

  public componentDidUpdate(prevProps: Props): void {
    const { screenSize, viewportSize, canvas } = this.props;
    const { containerId } = this.state;

    if (canvas !== prevProps.canvas) {
      const container = document.getElementById(containerId);

      if (prevProps.canvas) {
        container!.removeChild(prevProps.canvas);
      }

      if (canvas) {
        canvas.width = viewportSize.width;
        canvas.height = viewportSize.height;
        container!.appendChild(canvas);
      }
    } else if (canvas && viewportSize !== prevProps.viewportSize) {
      canvas.width = viewportSize.width;
      canvas.height = viewportSize.height;
    }

    if (screenSize !== prevProps.screenSize) {
      this.resizeViewport();
    }
  }

  public componentWillUnmount(): void {
    window.removeEventListener('resize', this.resizeViewport);
  }

  public render() {
    const { viewportSize: { width, height }, canvas } = this.props;
    const { containerId } = this.state;

    return (
      <Container id={containerId}>
        {canvas ? null : <Placeholder width={width} height={height} />}
      </Container>
    );
  }
}

const mapStateToProps = (state: AppState): StateProps => ({
  screenSize: state.screenSize,
  viewportSize: state.viewportSize,
  canvas: state.canvas,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  setViewportSize: (payload) => dispatch(setViewportSize(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Viewport);
