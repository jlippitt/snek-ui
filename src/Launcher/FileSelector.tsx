import React, { PureComponent } from 'react';

import randomId from 'helpers/randomId';

const ID_PREFIX = 'snek-file-selector-';

interface Props {
  onFileSelected(file: File): void;
}

interface State {
  id: string;
}

export default class FileSelector extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { id: randomId(ID_PREFIX) };
  }

  public render = () => (
    <input id={this.state.id} type='file' onChange={this.onChange} />
  )

  private onChange = (): void => {
    const element = document.getElementById(this.state.id) as HTMLInputElement;
    const files = element.files;

    if (files!.length > 0) {
      this.props.onFileSelected(files![0]);
    }
  }
}
