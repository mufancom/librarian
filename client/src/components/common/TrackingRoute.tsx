import * as _ from 'lodash';
import React, {Component} from 'react';
import {
  Route,
  RouteComponentProps,
  RouteProps,
  match,
  withRouter,
} from 'react-router';

import {observer} from 'utils/mobx';

interface RouteTrackerProps<T> extends RouteComponentProps<T> {
  onChange(match: match<T>): void;
}

class RouteTracker<T> extends Component<RouteTrackerProps<T>> {
  componentWillMount() {
    let {match, onChange} = this.props;

    onChange(match);
  }

  componentWillUpdate(props: RouteTrackerProps<T>) {
    let {match, onChange} = props;
    let previousMatch = this.props.match;

    if (!_.isEqual(match, previousMatch)) {
      onChange(match);
    }
  }

  render() {
    return this.props.children;
  }
}

export const RouteTrackerWithRouter = withRouter(RouteTracker);

export interface TrackingRouteProps<T> extends RouteProps {
  onChange(match: match<T>): void;
}

@observer
export class TrackingRoute<T> extends Component<TrackingRouteProps<T>> {
  render() {
    let {onChange, children, ...props} = this.props;

    return (
      <Route {...props}>
        <RouteTrackerWithRouter onChange={onChange} children={children} />
      </Route>
    );
  }
}
