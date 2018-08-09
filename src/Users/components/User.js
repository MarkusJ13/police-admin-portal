import React from 'react';
import AddUser from './AddUser';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';

export class Job extends React.Component {
  static propTypes = {
    firebaseApp: PropTypes.object,
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      isDeleting: false,
      isEditing: false,
      users: [], //can get this from props
    };
  }
  componentDidMount() {
    const {firebaseApp} = this.props;
    const usersRef = firebaseApp.database().ref('users');
    usersRef.on('value', snapshot => {
      const snapshotVal = snapshot.val();
      let users = [];
      for (var key in snapshotVal) {
        users.push({
          ...snapshotVal[key],
        });
      }
      this.setState({users});
    });
  }
  enableEditMode = e => {
    e.preventDefault();
    this.setState({isEditing: true});
  };
  disableEditMode = e => {
    this.setState({isEditing: false});
  };

  deleteJob = () => {
    this.db = this.props.firebaseApp
      .database()
      .ref()
      .child('users')
      .child(this.props.id)
      .remove();
    // this.db.orderByKey().equalTo(this.props.id).remove()
  };

  render() {
    const {id, name, phone, badge, firebaseApp} = this.props;
    const {users} = this.state;
    const {isEditing} = this.state;
    if (isEditing) {
      return (
        <AddUser
          mode="edit"
          onClose={this.disableEditMode}
          id={id}
          name={name}
          phone={phone}
          badge={badge}
          firebaseApp={firebaseApp}
        />
      );
    }
    return (
      <div className="list-group-item d-flex justify-content-between align-items-center">
        <div>
          {name} <span className="badge badge-secondary">{phone}</span>
        </div>
        <div>
          <a
            onClick={function() {
              this.setState({isDeleting: true});
            }.bind(this)}
            className="btn btn-danger"
            style={{display: '', color: '#fff', marginRight: 10}}>
            <i className="fas fa-trash" />
          </a>
          <a
            onClick={this.enableEditMode}
            tabIndex={0}
            className="btn btn-dark">
            <i className="fas fa-pencil-alt" />
          </a>
        </div>
        <ReactModal
          isOpen={this.state.isDeleting}
          onRequestClose={function() {
            this.setState({isDeleting: false});
          }.bind(this)}
          shouldCloseOnOverlayClick
          shouldCloseOnEsc
          style={{
            overlay: {
              zIndex: 100000,
              backgroundColor: 'rgba(0,0,0,0.6)',
            },
            content: {
              top: '40%',
              left: '30%',
              right: '30%',
              bottom: 'auto',
            },
          }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-evenly',
            }}>
            <div>Are you sure you want to delete this user?</div>
            <button onClick={this.deleteJob} className="btn btn-danger">
              Yes
            </button>
          </div>
        </ReactModal>
      </div>
    );
  }
}

export default Job;
