import classNames from 'classnames';
import React, {Component, createRef} from 'react';

import ReactDOM from 'react-dom';
import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.iframe`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 0;
  border: none;
  visibility: hidden;
`;

export interface ResizeListenerProps {
  className?: string;
  onResize(width: number): void;
}

@observer
export class ResizeListener extends Component<ResizeListenerProps> {
  wrapperRef: React.RefObject<any> = createRef();

  componentDidMount() {
    let wrapperIframe = ReactDOM.findDOMNode(
      this.wrapperRef.current,
    ) as HTMLIFrameElement;

    wrapperIframe.contentWindow!.onresize = this.onResize;
  }

  render() {
    let {className} = this.props;

    return (
      <Wrapper
        ref={this.wrapperRef}
        className={classNames('ResizeListener', className)}
      />
    );
  }

  onResize = () => {
    let wrapperIframe = ReactDOM.findDOMNode(
      this.wrapperRef.current,
    ) as HTMLIFrameElement;

    let {onResize} = this.props;
    onResize(wrapperIframe.clientWidth);
  };

  static Wrapper = Wrapper;
}
