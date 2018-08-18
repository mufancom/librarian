import {Button} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div`
  .add-category-button {
    color: ${props => props.theme.text.placeholder};

    @keyframes showAddButton {
      0% {
        opacity: 0;
      }

      100% {
        opacity: 1;
      }
    }

    &.show {
      opacity: 1;
      animation: showAddButton 0.3s;
    }

    &.hide {
      opacity: 0;
      display: none;
    }
  }
`;

export interface ConventionSideNavAddCategoryButtonProps {
  className?: string;
  show: boolean;
  onClick?(): void;
}

@observer
export class ConventionSideNavAddCategoryButton extends Component<
  ConventionSideNavAddCategoryButtonProps
> {
  render(): JSX.Element {
    let {className, show, onClick} = this.props;

    return (
      <Wrapper
        className={classNames(
          'convention-side-nav-add-category-button',
          className,
        )}
      >
        <Button
          className={`add-category-button ${show ? 'show' : 'hide'}`}
          type="dashed"
          icon="plus"
          onClick={onClick}
        >
          添加分组
        </Button>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
