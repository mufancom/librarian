import {Icon} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';

import {styled} from 'theme';
import {formatWhenDayAgo} from 'utils/date';
import {observer} from 'utils/mobx';

const Wrapper = styled.div`
  font-size: 13px;
  display: inline-block;
  margin-right: 14px;
  color: ${props => props.theme.text.placeholder};
`;

const TimeText = styled.span`
  margin-left: 3px;
`;

const RestoreButton = styled.a`
  margin-left: 6px;
}
`;

export interface ConventionBodyItemDraftHintProps {
  className?: string;
  loading?: boolean;
  savedAt: string;
  restoreOnclick?(): void;
}

@observer
export class ConventionBodyItemDraftHint extends Component<
  ConventionBodyItemDraftHintProps
> {
  render(): JSX.Element {
    let {className, savedAt, restoreOnclick, loading} = this.props;

    return (
      <Wrapper
        className={classNames('convention-body-item-draft-hint', className)}
      >
        {!loading ? (
          <span>
            草稿保存于
            <TimeText>{formatWhenDayAgo(savedAt)}</TimeText>
            <RestoreButton onClick={restoreOnclick}>恢复</RestoreButton>
          </span>
        ) : (
          <span>
            <Icon type="loading" spin={true} />
          </span>
        )}
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
