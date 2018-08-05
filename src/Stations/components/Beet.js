import React from 'react';
import PropTypes from 'prop-types';

export class Beet extends React.Component {
  static propTypes = {
    name: PropTypes.string,
    id: PropTypes.string,
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
    const {onUpdate, id} = this.props;
    const {name} = this.state;
    this.setState({isEditing: false});
    onUpdate({
      name,
      id,
    });
  };
  handleNameChange = e => {
    const newValue = e.target.value;
    this.setState({name: newValue});
  };
  render() {
    const {name, isEditing} = this.state;
    return (
      <div className="beet-items">
        {isEditing ? (
          <div>
            <input onChange={this.handleNameChange} type="text" value={name} />
            <button className="btn btn-primary mr-2" onClick={this.save}>
              Save
            </button>
            <button className="btn btn-dark" onClick={this.toggleEditMode}>
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
            <button className="btn btn-dark" onClick={this.toggleEditMode}>
              Edit
            </button>
          </div>
        )}
      </div>
    );
  }
}

export default Beet;
