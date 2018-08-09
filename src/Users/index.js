import React from 'react';
import PropTypes from 'prop-types';
import User from './components/User.js';
import AddUser from './components/AddUser.js';

export class Users extends React.Component {
  static propTypes = {
    firebaseApp: PropTypes.object,
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      addUserDialogOpen: false,
    };
  }
  openAddWorkshopDialog = e => {
    e.preventDefault();
    this.setState({
      addUserDialogOpen: true,
    });
  };
  closeAddWorkshopDialog = e => {
    this.setState({
      addUserDialogOpen: false,
    });
  };
  render() {
    const {firebaseApp, users} = this.props;
    const {addUserDialogOpen} = this.state;
    return (
      <div className="row">
        <div className="col-12 mb-3">
          <div className="row">
            <h2 className="col-4">Users</h2>
            <div className="offset-5 col-3">
              <button
                onClick={this.openAddWorkshopDialog}
                className="btn btn-primary float-right">
                <i className="fas fa-user-plus" />
              </button>
            </div>
          </div>
          <div className="list-group mt-2">
            {users.map(user => {
              return <User firebaseApp={firebaseApp} key={user.id} {...user} />;
            })}
          </div>
        </div>
        {addUserDialogOpen ? (
          <AddUser
            mode="add"
            onClose={this.closeAddWorkshopDialog}
            firebaseApp={firebaseApp}
            rid={this.props.User ? this.props.User.uid : null}
          />
        ) : null}
      </div>
    );
  }
}

export default Users;
