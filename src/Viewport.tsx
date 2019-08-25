import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { setViewportSize, Size } from './actions';
import randomId from './helpers/randomId';
import { State as AppState } from './reducer';
import { Container } from './Viewport.styles';

const CONTAINER_ID_PREFIX = 'snek-screen-';
const DEFAULT_WIDTH = 256;
const DEFAULT_HEIGHT = 240;

export interface Canvas {
  element: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

interface StateProps {
  innerCanvas?: Canvas;
}

interface DispatchProps {
  setViewportSize(payload: Size): void;
}

type Props = StateProps & DispatchProps;

interface State {
  containerId: string;
  outerCanvas: Canvas;
}

class Viewport extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);

    const { innerCanvas } = props;

    const element = document.createElement('canvas');
    element.width = this.getInnerWidth();
    element.height = this.getInnerHeight();
    element.style.display = 'block';
    element.style.margin = 'auto';

    const context = element.getContext('2d');

    if (!context) {
      throw new Error('2D rendering context unavailable');
    }

    // We want our sharp pixels!
    context.imageSmoothingEnabled = false;

    this.state = {
      containerId: randomId(CONTAINER_ID_PREFIX),
      outerCanvas: {
        element,
        context,
      },
    };
  }

  private getInnerWidth = (): number =>
    this.props.innerCanvas ? this.props.innerCanvas.element.width : DEFAULT_WIDTH;

  private getInnerHeight = (): number =>
    this.props.innerCanvas ? this.props.innerCanvas.element.height : DEFAULT_HEIGHT;

  private updateOuterCanvasSize = (): void => {
    const { containerId, outerCanvas } = this.state;

    const innerWidth = this.getInnerWidth();
    const innerHeight = this.getInnerHeight();

    const container = document.getElementById(containerId);
    const maxWidthScale = Math.floor(container!.offsetWidth / innerWidth);
    const maxHeightScale = Math.floor(container!.offsetHeight / innerHeight);
    const scaleFactor = Math.min(maxWidthScale, maxHeightScale);

    const outerWidth = innerWidth * scaleFactor;
    const outerHeight = innerHeight * scaleFactor;

    outerCanvas.element.width = outerWidth;
    outerCanvas.element.height = outerHeight;

    this.props.setViewportSize({
      width: outerWidth,
      height: outerHeight,
    });
  };

  public componentDidMount(): void {
    const { containerId, outerCanvas } = this.state;
    const container = document.getElementById(containerId);
    container!.appendChild(outerCanvas.element);

    this.updateOuterCanvasSize();

    window.addEventListener('resize', this.updateOuterCanvasSize);
  }

  public componentDidUpdate(prevProps: Props): void {
    if (this.props.innerCanvas !== prevProps.innerCanvas) {
      this.updateOuterCanvasSize();
    }
  }

  public componentWillUnmount(): void {
    window.removeEventListener('resize', this.updateOuterCanvasSize);
  }

  public render = () => <Container id={this.state.containerId} />;
}

const mapStateToProps = (state: AppState): StateProps => ({
  innerCanvas: undefined,
});

const mapDispatchToProps = (dispatch: Dispatch): DispatchProps => ({
  setViewportSize: (payload) => dispatch(setViewportSize(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Viewport);
