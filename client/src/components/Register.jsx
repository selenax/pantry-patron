import React from 'react';
import {Link} from 'react-router-dom'
import $ from 'jquery';

class Register extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username:'',
      entry: '',
      reEntry: ''
    }
    this.timer;
    this.delay = 300;
  } // end constructor

  checkPasswords(callback) {
    // check to see if passwords are the same
    let match = this.state.entry === this.state.reEntry && (this.state.entry !== '' && this.state.reEntry !== '') ;

    if(match){
      $('.register-error').hide();
      // send username and pasword information to callback  to be processed later
      callback({username: this.state.username, password: this.state.entry}, (loc)  => {
        this.props.history.push('/login');
      });
    } else {
      // figure out how to display a div of color red
      $('.register-error').text('Passwords do not match').show();
    }
  }

  // changes state on change of values
  handleUsername(e) {
    this.setState({username: e.target.value});

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      $.ajax({
        url: '/search/users',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({'username': this.state.username}),
        success: (data) => {
          data = JSON.parse(data);

          if(data.error) {
            $('.register-success').hide();
            $('.register-error').text(data.message).show();
          } else {
            $('.register-error').hide();
            $('.register-success').text(data.message).show();
          }

        },
        error: (err) => {
          console.error(err);
        }
      })
    }, this.delay);
  }

  handleEntryChange(e) {
    this.setState({entry: e.target.value});
  }

  handleReEntryChange(e) {
    this.setState({reEntry: e.target.value});
  }

  render() {
    return (
      <div className="wrapper">
        <div className="register-error form-error" hidden>Error</div>
        <div className="register-success form-success" hidden>Success</div>
        <form className="form-signin" onSubmit={(e) => { e.preventDefault()}}>
          <Link to="/login">
            <button
              className="btn btn-lg btn-primary btn-sm btn-block"
              type="submit"
              type="button">
              Back to Login
            </button>
          </Link>
          <h3 className="form-signin-heading">Register</h3>
          <div>
            <input type="text"
              className="form-control"
              placeholder="username"
              name="register-username"
              value={this.state.username}
              onChange={this.handleUsername.bind(this)}/>
          </div>
          <div>
            <input type="password"
              className="form-control"
              placeholder="password"
              name="register-password"
              value={this.state.password}
              onChange={this.handleEntryChange.bind(this)}/>
          </div>
          <div>
            <input type="password" className="form-control" placeholder="re-enter password"  value={this.state.reEntry}
              onChange={this.handleReEntryChange.bind(this)} name="register-password-reentry"/>
          </div>
          <div className="text-align">
            <button
              type="button"
              className="btn btn-lg btn-primary btn-block"
              type="submit"
              onClick={() => (this.checkPasswords(this.props.grabUserCredentials))}>Register
            </button>
          </div>
        </form>
      </div>
    );
  } // end render
} // end component

export default Register;