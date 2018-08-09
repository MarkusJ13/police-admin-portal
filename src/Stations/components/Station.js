import React from 'react';
import AddStation from './AddStation';
import PropTypes from 'prop-types';
import ReactModal from 'react-modal';
import {ListItem} from './styled-components';
import Chauki from './Chauki';

export class Station extends React.Component {
  static propTypes = {
    firebaseApp: PropTypes.object,
    child: PropTypes.array,
    databasePath: PropTypes.string,
  };
  static defaultProps = {
    databasePath: 'stations',
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      isDeleting: false,
      isEditing: false,
      isExpanded: false,
      isAddingChild: false,
      stations: [],
      newChildName: '',
    };
  }
  componentDidMount() {
    const {firebaseApp} = this.props;
    const stationsRef = firebaseApp.database().ref('stations');
    stationsRef.on('value', snapshot => {
      const snapshotVal = snapshot.val();
      let stations = [];
      for (var key in snapshotVal) {
        stations.push({
          ...snapshotVal[key],
        });
      }
      this.setState({stations});
    });
  }
  enableEditMode = e => {
    e.preventDefault();
    this.setState({isEditing: true});
  };
  disableEditMode = e => {
    this.setState({isEditing: false});
  };

  deleteStation = () => {
    this.db = this.props.firebaseApp
      .database()
      .ref()
      .child('stations')
      .child(this.props.id)
      .remove();
    // this.db.orderByKey().equalTo(this.props.id).remove()
  };
  toggleExpand = e => {
    this.setState({isExpanded: !this.state.isExpanded});
  };
  toggleAddChild = e => {
    if (this.state.isAddingChild) {
      this.setState({
        isAddingChild: false,
        newChildName: '',
      });
    } else {
      this.setState({
        isAddingChild: true,
      });
    }
  };
  showConfirmDeleteDialog = e => {
    this.setState({
      isDeleting: true,
    });
  };
  handleNewChildNameChange = e => {
    this.setState({
      newChildName: e.target.value,
    });
  };
  updateChild = (key, data) => {
    const {firebaseApp, databasePath} = this.props;
    const stationId = this.props.id;
    const updates = {
      [`${databasePath}/${stationId}/child/${key}`]: data,
    };
    console.log(updates);
    this.setState({error: {}, success: {}, isUpdating: true});
    firebaseApp
      .database()
      .ref()
      .update(updates)
      .then(snapshot => {
        this.setState({
          success: {
            message: 'Updated',
            hasSuccess: true,
          },
          error: {},
          isUpdating: false,
        });
      })
      .catch(error => {
        this.setState({
          error: {
            hasError: true,
            message: 'Some error',
          },
          success: {},
          isUpdating: false,
        });
      });
  };
  addNewChild = e => {
    const {firebaseApp, databasePath, id} = this.props;
    const path = `${databasePath}/${id}/child`;
    const {newChildName: name} = this.state;
    firebaseApp
      .database()
      .ref()
      .child(path)
      .push()
      .set({name, child: []})
      .then(snapshot => {
        console.log('Added');
      })
      .catch(err => {
        console.log('some error', err);
      });
  };
  addChildOfChild = (key, name) => {
    const {firebaseApp, databasePath, id} = this.props;
    const path = `${databasePath}/${id}/child/${key}/child`;
    firebaseApp
      .database()
      .ref()
      .child(path)
      .push()
      .set({name})
      .then(snapshot => {
        this.toggleAddChild();
      })
      .catch(err => {
        console.log('some error', err);
      });
  };
  render() {
    const {id, firebaseApp, child, name} = this.props;
    const {
      stations,
      isExpanded,
      isEditing,
      isAddingChild,
      newChildName,
    } = this.state;
    if (isEditing) {
      return (
        <AddStation
          mode="edit"
          child={child}
          onClose={this.disableEditMode}
          id={id}
          name={name}
          firebaseApp={firebaseApp}
        />
      );
    }
    return (
      <ListItem
        isExpanded={isExpanded}
        style={{height: isExpanded ? '250px' : undefined}}>
        <div className="title-container">
          <div className="title" onClick={this.toggleExpand}>
            {name}
          </div>
          <div className="actions">
            <button
              className="btn btn-primary mr-2"
              onClick={this.toggleAddChild}>
              Add Chauki
            </button>
            <button
              onClick={this.showConfirmDeleteDialog}
              className="btn btn-danger mr-2">
              <i className="fas fa-trash" />
            </button>
            <button onClick={this.enableEditMode} className="btn btn-dark">
              <i className="fas fa-pencil-alt" />
            </button>
          </div>
        </div>
        <div
          style={{paddingLeft: '8px'}}
          className={`add-new-child ${isAddingChild ? 'visible' : 'hidden'}`}>
          <input
            type="text"
            value={newChildName}
            onChange={this.handleNewChildNameChange}
          />
          <button className="btn btn-primary mr-2" onClick={this.addNewChild}>
            Save
          </button>
          <button className="btn btn-dark" onClick={this.toggleAddChild}>
            Cancel
          </button>
        </div>
        <div className="child-list">
          {isExpanded
            ? child
              ? Object.keys(child).map(key => {
                  const handleUpdate = (data, keySuffix = '') => {
                    this.updateChild(`${key}${keySuffix}`, data);
                  };
                  const addChild = name => {
                    this.addChildOfChild(key, name);
                  };
                  return (
                    <Chauki
                      addChild={addChild}
                      onUpdate={handleUpdate}
                      key={key}
                      {...child[key]}
                    />
                  );
                })
              : 'No child'
            : null}
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
            <div>Are you sure you want to delete this station?</div>
            <button onClick={this.deleteStation} className="btn btn-danger">
              Yes
            </button>
          </div>
        </ReactModal>
      </ListItem>
    );
  }
}

export default Station;
