import {Icon} from 'antd';
import classNames from 'classnames';
import React, {Component} from 'react';

import {styled} from 'theme';
import {observer} from 'utils/mobx';

const Wrapper = styled.div`
  width: 400px;
  padding-top: 39vh;
  margin: auto;
`;

const Box = styled.div`
  display: flex;
`;

const SuccessSign = styled.div`
  font-size: 50px;
  color: ${props => props.theme.greenAccent()};
  animation: fadeUpIn 0.3s;
`;

const SuccessInfo = styled.div`
  margin-left: 30px;
`;

const Title = styled.div`
  font-size: 30px;
  animation: fadeUpIn 0.4s;
`;

const Subtitle = styled.div`
  margin-top: 5px;
  animation: fadeUpIn 0.5s;
`;

const HomeLink = styled.a`
  color: ${props => props.theme.text.secondary};
`;

export interface RegisterInvitationFinishedProps {
  className?: string;
}

@observer
export class RegisterInvitationFinished extends Component<
  RegisterInvitationFinishedProps
> {
  render(): JSX.Element {
    let {className} = this.props;

    return (
      <Wrapper
        className={classNames('register-invitation-finished', className)}
      >
        <Box>
          <SuccessSign>
            <Icon type="check-circle" />
          </SuccessSign>
          <SuccessInfo>
            <Title>注册成功</Title>
            <Subtitle>
              <HomeLink href="/">
                访问 Librarian <Icon type="arrow-right" />
              </HomeLink>
            </Subtitle>
          </SuccessInfo>
        </Box>
      </Wrapper>
    );
  }

  static Wrapper = Wrapper;
}
