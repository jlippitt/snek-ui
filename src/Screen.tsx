import React, { PureComponent } from 'react';

import { Container } from './Screen.styles';

const CONTAINER_ID_PREFIX = 'snek-screen-';
const DEFAULT_WIDTH = 256;
const DEFAULT_HEIGHT = 240;

export interface Canvas {
  element: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
}

interface Props {
  innerCanvas?: Canvas;
}

interface State {
  containerId: string;
  outerCanvas: Canvas;
}

const randomId = (): string => Math.random().toString(16).substr(2);

export default class Screen extends PureComponent<Props, State> {
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
      containerId: CONTAINER_ID_PREFIX + randomId(),
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

    outerCanvas.element.width = innerWidth * scaleFactor;
    outerCanvas.element.height = innerHeight * scaleFactor;
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
