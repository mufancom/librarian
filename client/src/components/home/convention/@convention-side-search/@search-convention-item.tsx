import classNames from 'classnames';
import React, {Component} from 'react';

import {ConventionItem} from 'stores/convention-store';
import {styled} from 'theme';
import {observer} from 'utils/mobx';
import {
  filterHTMLTags,
  getMarkdownTitle,
  replacePunctuation,
} from 'utils/regex';

const Wrapper = styled.div``;

const Title = styled.div`
  font-weight: bold;
  width: 170px;
  white-space: normal;
`;

const MatchingDescription = styled.div`
  font-size: 12px;
  width: 170px;
  color: ${props => props.theme.text.secondary};
  white-space: normal;
`;

export interface SearchConventionItemProps {
  className?: string;
  item: ConventionItem;
  segments: string[];
}

@observer
export class SearchConventionItem extends Component<SearchConventionItemProps> {
  render(): JSX.Element {
    let {className, item, segments} = this.props;

    let {content} = item;

    let title = getMarkdownTitle(content);

    return (
      <Wrapper className={classNames('search-convention-item', className)}>
        {title ? <Title>{title}</Title> : undefined}
        <MatchingDescription
          dangerouslySetInnerHTML={{
            __html: extractAndHighlightKeywords(content, segments),
          }}
        />
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}

interface SegmentPosition {
  segment: string;
  position: number;
}

function sortSegmentPositions(positions: SegmentPosition[]): SegmentPosition[] {
  return positions.sort(
    (pos1, pos2): number => {
      return pos1.position - pos2.position;
    },
  );
}

interface Description {
  text: string;
  keywords: string[];
}

function extractDescription(
  content: string,
  positions: SegmentPosition[],
): Description {
  let text = '';

  let keywords: string[] = [];

  let lastPosition = -1;

  for (let segmentWithPos of positions) {
    let {segment, position} = segmentWithPos;

    let endPosition = position + segment.length;

    if (position - lastPosition <= 16) {
      if (lastPosition === -1) {
        let startPosition = position - 8 >= 0 ? position - 8 : 0;

        text += content.slice(startPosition, endPosition);
      } else {
        text += content.slice(position, endPosition);
      }
    } else {
      if (lastPosition !== -1) {
        text += content.slice(lastPosition, lastPosition + 8);
      }

      text += '...';
      text += content.slice(position - 8, endPosition);
    }

    keywords.push(segment);

    lastPosition = endPosition;

    if (text.length + segment.length > 60) {
      break;
    }
  }

  if (lastPosition !== -1) {
    text += content.slice(lastPosition, lastPosition + 8);
    text += '...';
  }

  return {text, keywords};
}

function highlightDescription(desc: Description): string {
  let {text, keywords} = desc;

  if (!keywords.length) {
    return text;
  }

  let regexSource = keywords.join('|');

  let regex = new RegExp(regexSource, 'ig');

  return text.replace(regex, '<span style="color: #F56C6C">$&</span>');
}

function extractAndHighlightKeywords(
  content: string,
  segments: string[],
): string {
  content = filterHTMLTags(content);

  content = replacePunctuation(content);

  let positions: SegmentPosition[] = [];

  for (let segment of segments) {
    let regex = new RegExp(segment, 'i');

    let result = content.match(regex);

    if (result && typeof result.index === 'number') {
      let position = result.index;

      positions.push({position, segment});
    }
  }

  positions = sortSegmentPositions(positions);

  let description = extractDescription(content, positions);

  if (!description.text.length) {
    description.text = content.slice(0, 20);
  }

  return highlightDescription(description);
}
