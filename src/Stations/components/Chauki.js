import React from 'react';
import PropTypes from 'prop-types';
import Beet from './Beet';

export class Chauki extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.string,
    child: PropTypes.array,
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      isEditing: false,
      name: props.name,
    };
  }
  toggleEditMode = e => {
    const {isEditing} = this.state;
    if (isEditing) {
      this.setState({isEditing: false, name: this.props.name});
    } else {
      this.setState({isEditing: true});
    }
  };
  save = e => {
    const {onUpdate, id, child} = this.props;
    const {name} = this.state;
    console.log('save', this.state.name);
    this.setState({isEditing: false});
    onUpdate({
      name,
      child,
      id,
    });
  };
  updateChild = (key, data) => {
    const {onUpdate} = this.props;
    onUpdate(data, `/child/${key}`);
  };
  handleNameChange = e => {
    const newValue = e.target.value;
    this.setState({name: newValue});
  };
  addNewChild = e => {
    const {addChild} = this.props;
    const {newChildName: name} = this.state;
    addChild(name);
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
  handleNewChildNameChange = e => {
    this.setState({
      newChildName: e.target.value,
    });
  };
  render() {
    const {child} = this.props;
    const {name, isEditing, newChildName, isAddingChild} = this.state;
    return (
      <div>
        {isEditing ? (
          <div>
            <input type="text" value={name} onChange={this.handleNameChange} />
            <button className="btn btn-primary mr-2" onClick={this.save}>
              Save
            </button>
            <button className="btn" onClick={this.toggleEditMode}>
              Cancel
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <span>{this.props.name}</span>
            <div>
              <button
                className="btn btn-primary mr-2"
                onClick={this.toggleAddChild}>
                Add Beat
              </button>
              <button className="btn btn-dark" onClick={this.toggleEditMode}>
                Edit
              </button>
            </div>
          </div>
        )}
        <div
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
        <div
          style={{
            padding: '10px 0 0 30px',
          }}>
          {child &&
            Object.keys(child).map(key => {
              const b = child[key];
              const handleUpdate = data => {
                this.updateChild(key, data);
              };
              return <Beet onUpdate={handleUpdate} key={b.id} {...b} />;
            })}
        </div>
      </div>
    );
  }
}

export default Chauki;
