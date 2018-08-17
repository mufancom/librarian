declare module '@opuscapita/react-markdown' {
  interface InputItem {
    _objectLabel: string;
  }

  interface MarkdownExtension {
    objectClassName: string;
    specialCharacter: string;
    color: string;
    termRegex: RegExp;
    searchItems(term: string): Promise<InputItem[]>;
    markdownText(item: InputItem, term: string): string;
    renderItem?(args: {
      item: InputItem;
      isSelected: boolean;
    }): React.ReactElement<any>;
  }

  interface AdditionalButton {
    iconElement: React.ReactElement<any>;
    label?: string;
    handleButtonPress?(
      value: string,
      insertAtCursorPosition: (object: object) => void,
    ): void;
  }

  interface MarkdownInputProps {
    value: string;
    locale: string;
    extensions: MarkdownExtension[];
    additionalButtons: AdditionalButton[];
    autoFocus?: boolean;
    readOnly: boolean;
    hideToolbar?: boolean;

    onChange(value: string): void;
    onFullScreen?(isFullScreen: boolean): void;
  }

  export default class MarkdownInput extends React.Component<
    MarkdownInputProps
  > {}
}
