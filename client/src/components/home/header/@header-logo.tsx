import classNames from 'classnames';
import React, {Component} from 'react';

import logoImg from 'assets/images/librarian.svg';
import {styled} from 'theme';

const Wrapper = styled.div`
  float: left;
  height: 70px;
`;

const LoginIconWrapper = styled.div`
  float: left;
  img {
    height: 38px;
    width: 38px;
  }
`;

const LoginTextWrapper = styled.div`
  float: left;
  padding-left: 10px;
  font-size: 23px;
  font-weight: lighter;
  color: #409eff;
`;

export interface HeaderLogoProps {
  className?: string;
}

export class HeaderLogo extends Component<HeaderLogoProps> {
  render(): JSX.Element {
    let {className} = this.props;

    return (
      <Wrapper className={classNames('header-logo', className)}>
        <LoginIconWrapper>
          <img src={logoImg} />
        </LoginIconWrapper>
        <LoginTextWrapper>Librarian</LoginTextWrapper>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
