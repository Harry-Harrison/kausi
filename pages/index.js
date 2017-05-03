import React, { Component } from "react";
import Router from "next/router";
import firebase from "firebase";
import moment from "moment";
import List from "react-virtualized/dist/commonjs/List";
import AutoSizer from "react-virtualized/dist/commonjs/AutoSizer";

import Head from "../components/Head.js";
import WeekContainer from "../components/WeekContainer";

import initializeFirebase from "../helpers/initializeFirebase.js";
import initializeRollbar from "../helpers/initializeRollbar.js";

export default class Timeline extends Component {
  constructor(props) {
    super(props);

    this.startIndex = 400;

    this.state = {
      today: moment().startOf("day"),
      uid: null,
      anonymous: null,
      connected: false,
      haveConnectedOnce: false,
      error: null,
      clientSide: false,
    };
  }

  componentDidMount() {
    const updateTodayHandler = setTimeout(
      this.updateToday,
      moment(this.state.today).add(1, "days").diff(this.state.today)
    );

    this.setState({
      updateTodayHandler: updateTodayHandler,
      clientSide: true,
    });

    initializeFirebase();

    firebase.auth().onAuthStateChanged(
      function(user) {
        if (user) {
          this.setState({
            uid: user.uid,
            anonymous: user.isAnonymous,
          });
        } else {
          this.setState({
            uid: null,
            anonymous: null,
          });

          firebase.auth().signInAnonymously().catch(function(error) {
            console.log(error);
          });
        }
      }.bind(this)
    );

    firebase.database().ref(".info/connected").on(
      "value",
      function(online) {
        if (online.val() === true) {
          this.setState({
            connected: true,
            haveConnectedOnce: true,
          });
        } else {
          this.setState({ connected: false });
        }
      }.bind(this)
    );

    this.scrollToToday();
  }

  componentWillUnmount() {
    clearTimeout(this.state.updateTodayHandler);
  }

  updateToday = () => {
    const newToday = moment().startOf("day");

    if (window && !this.state.today.isSame(newToday)) {
      console.log("Reloading because date has changed");
      window.location.reload();
    }
  };

  getIndexFromDay = (today, day) => {
    return (
      this.startIndex +
      moment(day)
        .startOf("isoweek")
        .diff(moment(today).startOf("isoweek"), "weeks")
    );
  };

  setUrlToDay = day => {
    const url = moment().startOf("day").isSame(day)
      ? "/"
      : `/?${moment(day).format("YYYY-MM-DD")}`;
    Router.replace(url, url, { shallow: true });
    this.list &&
      this.list.scrollToRow(this.getIndexFromDay(this.state.today, day));
  };

  scrollToToday = () => {
    this.setUrlToDay(this.state.today);
  };

  focusDay = day => {
    this.setUrlToDay(day);
  };

  rowRenderer = ({ key, index, isScrolling, isVisible, style }) => {
    return (
      <WeekContainer
        key={key}
        index={index}
        weekOf={moment(this.state.today)
          .startOf("isoweek")
          .subtract(this.startIndex - index, "weeks")}
        url={this.props.url}
        query={this.props.url.query}
        anonymous={this.state.anonymous}
        uid={this.state.uid}
        focusDay={this.focusDay}
        scrollToToday={this.scrollToToday}
        today={this.state.today}
        style={style}
      />
    );
  };

  render() {
    const query = this.props.url.query && Object.keys(this.props.url.query)[0];
    const scrollToIndex = query
      ? this.getIndexFromDay(this.state.today, moment(query))
      : this.startIndex;

    return (
      <div className="timeline">
        <Head />
        <style jsx>
          {`
          .timeline {
            width: 100%;
            height: 100vh;
          }
          `}
        </style>

        {this.state.clientSide
          ? <AutoSizer>
              {({ height, width }) => (
                <List
                  ref={c => (this.list = c)}
                  width={width}
                  height={height}
                  rowCount={this.startIndex * 2}
                  estimatedRowSize={height * 0.91}
                  rowHeight={height * 0.91}
                  rowRenderer={this.rowRenderer}
                  scrollToIndex={scrollToIndex}
                  scrollToAlignment="start"
                  overscanRowCount={0}
                  uid={this.state.uid}
                  query={this.props.url.query}
                />
              )}
            </AutoSizer>
          : <div>
              {this.rowRenderer({
                key: scrollToIndex + 0,
                index: scrollToIndex + 0,
              })}
              {this.rowRenderer({
                key: scrollToIndex + 1,
                index: scrollToIndex + 1,
              })}
            </div>}
      </div>
    );
  }
}
