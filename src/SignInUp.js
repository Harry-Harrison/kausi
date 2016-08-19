import React, { Component } from "react";

import Form from "./Form";
import Button from "./Button";

class SignInUp extends Component {
  constructor(props) {
    super(props);

    this.state = {
      error: null,
      view: "signIn"
    };

    this.signIn = this.signIn.bind(this);
    this.signUp = this.signUp.bind(this);
    this.showSignIn = this.showSignIn.bind(this);
    this.showSignUp = this.showSignUp.bind(this);
  }

  signIn(fields) {
    this.props.signIn(fields.emailIn.value, fields.passwordIn.value);
  }

  signUp(fields) {
    this.props.signUp(fields.emailUp.value, fields.passwordUp.value);
  }

  showSignIn() {
    this.setState({view: "signIn"})
  }

  showSignUp() {
    this.setState({view: "signUp"})
  }

  render() {
    let error, view;

    if (this.props.error) {
      error = (
        <p className="color-bright-6">{this.props.error}</p>
      );
    }

    if (this.state.view === "signIn") {
      view = (
        <div className="flex vertical align-center child-margins-y-1">
          <Form
            onSubmit={this.signIn}
            fields={[
              {
                id: "emailIn",
                type: "email",
                label: "Email",
              },
              {
                id: "passwordIn",
                type: "password",
                label: "Password",
              },
            ]}
            buttonLabel="Sign in"
          />

          <Button className="rounded" disabled={true} label="Reset password" onClick={this.props.resetPassword}/>
        </div>
      );
    }
    else {
      view = (
        <div className="flex vertical align-center child-margins-y-1">
          <p className="wide-max-width">
            <strong className="color-5">You are currently using a temporary account.</strong> If you sign up, entries from this account will carry over to your new account.
          </p>
          <p className="wide-max-width">
            Entries are stored in <a className="border-bottom" href="http://firebase.google.com/">Firebase</a>, unencrypted. Authentication is securely handled by Firebase.
          </p>
          <Form
            onSubmit={this.signUp}
            fields={[
              {
                id: "emailUp",
                type: "email",
                label: "Email",
              },
              {
                id: "passwordUp",
                type: "password",
                label: "Password",
              },
            ]}
            buttonLabel="Sign up"
          />
        </div>
      );
    }

    return (
      <div className="grow bg-1 color-4 overflow-auto flex vertical">
        <div className="grow flex vertical align-center justify-center child-margins-y-1 padding-0-5">
          {view}
          {error}
        </div>
        <div className="flex even-children bg-5 color-1">
          <Button
            label="Sign in"
            onClick={this.showSignIn}
            disabled={this.state.view === "signIn"}
          />
          <Button
            label="Sign up"
            onClick={this.showSignUp}
            disabled={this.state.view === "signUp"}
          />
        </div>
      </div>
    );
  }
}

export default SignInUp;