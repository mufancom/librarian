import classNames from 'classnames';
import React, {Component} from 'react';

import {styled} from 'theme';
import {Section, mark} from 'utils/markdown';
import {observer} from 'utils/mobx';
import {ConventionBodySectionFooter} from './@convention-body-section-footer';

const Wrapper = styled.div`
  padding-bottom: 1.9rem;

  ${ConventionBodySectionFooter.Wrapper} {
    margin-bottom: 5px;
  }
`;

export interface ConventionBodySectionProps {
  className?: string;
  section: Section;
}

@observer
export class ConventionBodySection extends Component<
  ConventionBodySectionProps
> {
  render() {
    let {
      className,
      section: {source, annotation},
    } = this.props;

    return (
      <Wrapper className={classNames('convention-body-section', className)}>
        <div dangerouslySetInnerHTML={{__html: mark(source)}} />
        {annotation && annotation.type === 'section' ? (
          <ConventionBodySectionFooter uuid={annotation.uuid} />
        ) : (
          undefined
        )}
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
