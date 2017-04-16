import React, { PureComponent } from "react";
import moment from "moment";

import Day from "./Day";
import Navigation from "../components/Navigation";

export default class Week extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      aDayIsFocused: false,
    };
  }

  onFocus = day => {
    this.setState({ aDayIsFocused: true });
    this.props.focusDay(day);
  };

  onBlur = day => {
    this.setState({ aDayIsFocused: false });
  };

  render() {
    const days = this.props.lists
      ? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
      : [0, 1, 2, 3, 4, 5, 6];

    return (
      <div className="week padding" style={this.props.style} role="row">
        <style jsx>
          {`
          .week {
            height: 85.4vh;
            display: flex;
            align-items: stretch;
            position: relative;
            overflow: hidden;
          }

          .weekStamp {
            position: absolute;
            font-size: 0.625rem;
            line-height: 0.625rem;
            text-transform: uppercase;
          }
          `}
        </style>

        <Navigation
          url={this.props.url}
          uid={this.props.uid}
          anonymous={this.props.anonymous}
          replaceActiveLinkWith={
            !this.props.lists &&
              <button
                onClick={this.props.scrollToToday}
                className="active"
                key="today"
              >
                Timeline
              </button>
          }
        />

        <h1 className="weekStamp">
          {this.props.lists
            ? "Static lists"
            : <span>W{this.props.weekOf.format("WW MMM YYYY")}</span>}
        </h1>

        {days.map(day => (
          <Day
            key={day}
            day={moment(this.props.weekOf).add(day, "days")}
            uid={this.props.uid}
            focusDay={this.props.focusDay}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            aDayIsFocused={this.state.aDayIsFocused}
            isList={this.props.lists}
          />
        ))}
      </div>
    );
  }
}
