import React from 'react';
import PropTypes from 'prop-types';
import './style.css';
import ReactModal from 'react-modal';

class Height extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      feets: '',
      inches: '',
    };
  }
  get value() {
    const {feets, inches} = this.state;
    if (feets === '' && inches === '') {
      return '';
    }
    return feets * 12 + inches;
  }
  componentWillMount() {
    ReactModal.setAppElement('body');
  }
  componentDidMount() {
    const {customRef} = this.props;
    customRef && customRef(this);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.isEditing && !this.props.isEditing) {
      const {value = 70} = this.props;
      this.setState({feets: parseInt(value / 12), inches: value % 12});
    }
  }
  handleInchChange = e => {
    const value = e.target.value === '' ? '' : parseInt(e.target.value);
    this.setState({inches: isNaN(value) ? '' : value});
  };
  handleFeetChange = e => {
    const value = e.target.value === '' ? '' : parseInt(e.target.value);
    this.setState({feets: isNaN(value) ? '' : value});
  };
  render() {
    const {value, isEditing, isDisabled} = this.props;
    const {feets, inches} = this.state;
    return isEditing ? (
      <div>
        <input
          disabled={isDisabled}
          type="text"
          onChange={this.handleFeetChange}
          placeholder="feets"
          value={feets}
          className="half margin-right"
        />
        <input
          disabled={isDisabled}
          type="text"
          onChange={this.handleInchChange}
          placeholder="inches"
          className="half"
          value={inches}
        />
      </div>
    ) : (
      <div>
        {value ? (
          <div>
            {parseInt(value / 12)}′{value % 12}″
          </div>
        ) : (
          'NOT SET'
        )}
      </div>
    );
  }
}

function Error({error}) {
  return <div style={{fontSize: '14px', color: 'red'}}>{error}</div>;
}

class HairColor extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = {
      options: ['Brown', 'Black', 'White', 'Red', 'Blue', 'other'],
      selectedColor: 'Black',
      otherColor: '',
    };
  }
  componentDidMount() {
    const {customRef} = this.props;
    customRef(this);
  }
  componentWillUnmount() {
    const {customRef} = this.props;
    customRef(null);
  }
  handleSelectChange = e => {
    const color = e.target.value;
    this.setState({selcetedColor: color, otherSelected: color === 'other'});
  };
  get value() {
    const {otherSelected, otherColor, selectedColor} = this.state;
    return otherSelected ? otherColor : selectedColor;
  }
  render() {
    const {isEditing, isDisabled, value} = this.props;
    const {selectedColor, options, otherSelected, otherColor} = this.state;
    return isEditing ? (
      <div className="hair-color">
        <select
          disabled={isDisabled}
          onChange={this.handleSelectChange}
          value={selectedColor}>
          {options.map(option => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        {otherSelected ? (
          <input
            placeholder="Color"
            type="text"
            disabled={isDisabled}
            value={otherColor}
          />
        ) : null}
      </div>
    ) : (
      <div>{value}</div>
    );
  }
}
function randomString(length = 32) {
  var text = '';
  var possible =
    'ABCDEFGHIJHBbazdakbasbda8998127373599278732bggaiuBGAAjnjAGG_-___hHGAXXY';
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
class CriminalImage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {downloadURL: ''};
  }
  componentDidMount() {
    const {customRef} = this.props;
    customRef(this);
  }
  afterUpload = downloadURL => {
    this.setState({uploadSuccess: true, isUploading: false, downloadURL});
  };
  onUploadFail = reason => {
    this.setState({isUploading: false, error: reason});
  };
  get value() {
    return this.state.downloadURL;
  }
  handleChange = e => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    this.setState({isUploading: true, error: null});
    this.props.onUpload(
      randomString(32) + '_-_-_-_-' + Date.now() + '.jpg',
      file,
      this.afterUpload,
      this.onUploadFail,
    );
  };
  render() {
    const {isEditing, value} = this.props;
    const {
      uploadSuccess,
      downloadURL,
      isUploading,
      error: uploadError,
    } = this.state;
    return isEditing ? (
      <div className="upload-image">
        {uploadSuccess ? (
          <div className="image-container">
            <img src={downloadURL} />
          </div>
        ) : null}
        <label>
          <input
            style={{visibility: 'hidden'}}
            type="file"
            accept="image/*"
            onChange={this.handleChange}
          />
          <div className="upload-button">
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </div>
          {uploadError ? <Error error={uploadError} /> : null}
        </label>
      </div>
    ) : (
      <div>
        <img src={value} />
      </div>
    );
  }
}

class AddCriminal extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      name: '',
      alias: '',
      fatherName: '',
      height: 70,
      phone: '',
      identityMark: '',
      error: {},
      address: '',
      operatingArea: '',
      crime: '',
    };
  }
  get value() {
    const {
      name,
      alias,
      fatherName,
      phone,
      identityMark,
      address,
      operatingArea,
    } = this.state;
    const height = this.heightRef.value;
    const hairColor = this.hairColorRef.value;
    const imageURL = this.criminalImageRef.value;
    return {
      name,
      alias,
      father_name: fatherName,
      height,
      phone,
      identity_mark: identityMark,
      hair_color: hairColor,
      operating_area: operatingArea,
      address,
      image_url: imageURL,
    };
  }
  setError = error => {
    this.setState({error: {...this.state.error, ...error}});
  };
  validate = () => {
    const {name} = this.state;
    if (name && typeof name === 'string' && name.trim().length > 2) {
      this.setState({error: {}});
      return true;
    } else {
      this.setError({name: 'Name must have atleast 2 characters'});
    }
    return false;
  };
  handleSubmit = e => {
    e.preventDefault();
    const {onSubmit} = this.props;
    this.validate() && onSubmit(this.value);
  };
  handleNameChange = e => {
    this.setState({name: e.target.value});
  };
  handleAliasChange = e => {
    this.setState({alias: e.target.value});
  };
  handleFatherNameChange = e => {
    this.setState({fatherName: e.target.value});
  };
  handlePhoneChange = e => {
    const phone = e.target.value;
    this.setState({phone});
  };
  handleIdentityMarkChange = e => {
    const identityMark = e.target.value;
    this.setState({identityMark});
  };
  handleOperatingAreaChange = e => {
    const operatingArea = e.target.value;
    this.setState({operatingArea});
  };
  handleAddressChange = e => {
    const address = e.target.value;
    this.setState({address});
  };
  handleCrimeChange = e => {
    const crime = e.target.value;
    this.setState({crime});
  };
  render() {
    const {
      name,
      alias,
      fatherName,
      height,
      phone,
      identityMark,
      address,
      operatingArea,
      crime,
      error: {name: nameError},
    } = this.state;
    const {onRequestClose, isAdding: isDisabled, onUpload} = this.props;
    return (
      <ReactModal
        shouldCloseOnOverlayClick={false}
        shouldCloseOnEsc
        onRequestClose={onRequestClose}
        isOpen
        style={{
          overlay: {
            backgroundColor: 'rgba(40,40,40,0.4)',
            zIndex: 1000,
          },
          content: {
            left: '28%',
            right: '28%',
          },
        }}>
        <form
          onSubmit={this.handleSubmit}
          className="add-criminal-dialog-content-wrapper">
          <h3>Add a Criminal</h3>
          <CriminalImage
            customRef={this._criminalImage}
            isEditing
            onUpload={onUpload}
          />
          <label>
            <legend>Name</legend>
            <input
              disabled={isDisabled}
              onChange={this.handleNameChange}
              ref={this.setNameRef}
              type="text"
              value={name}
            />
            {nameError ? <Error error={nameError} /> : null}
          </label>
          <label>
            <legend>Alias</legend>
            <input
              disabled={isDisabled}
              onChange={this.handleAliasChange}
              type="text"
              value={alias}
            />
          </label>
          <label>
            <legend>Phone Number</legend>
            <input
              disabled={isDisabled}
              onChange={this.handlePhoneChange}
              type="text"
              value={phone}
            />
          </label>{' '}
          <label>
            <legend>Father'sname</legend>
            <input
              disabled={isDisabled}
              onChange={this.handleFatherNameChange}
              type="text"
              value={fatherName}
            />
          </label>
          <label>
            <legend>Height</legend>
            <Height
              isDisabled={isDisabled}
              customRef={this._heightRef}
              isEditing
            />
          </label>
          <label>
            <legend>Indentity mark</legend>
            <input
              disabled={isDisabled}
              onChange={this.handleIdentityMarkChange}
              type="text"
              value={identityMark}
            />
          </label>
          <label>
            <legend>Hair color</legend>
            <HairColor
              isEditing
              isDisabled={isDisabled}
              customRef={this._hairColorRef}
            />
          </label>
          <label>
            <legend>Crime</legend>
            <textarea
              disabled={isDisabled}
              onChange={this.handleCrimeChange}
              value={crime}
            />
          </label>
          <label>
            <legend>Operating Area</legend>
            <textarea
              disabled={isDisabled}
              onChange={this.handleOperatingAreaChange}
              value={operatingArea}
            />
          </label>
          <label>
            <legend>Address</legend>
            <textarea
              disabled={isDisabled}
              onChange={this.handleAddressChange}
              value={address}
            />
          </label>
          <div className="mt-2">
            <button
              className="btn cancel"
              onClick={onRequestClose}
              type="button">
              Cancel
            </button>
            <button>Save</button>
          </div>
        </form>
      </ReactModal>
    );
  }
  _heightRef = ref => {
    this.heightRef = ref;
  };
  _hairColorRef = ref => {
    this.hairColorRef = ref;
  };
  setNameRef = ref => {
    this.nameRef = ref;
  };
  _criminalImage = ref => {
    this.criminalImageRef = ref;
  };
}

class Criminal extends React.Component {
  render() {
    const {height, name} = this.props;
    return (
      <div>
        <div>{name}</div>
        <Height value={height} />
      </div>
    );
  }
}

export class Criminals extends React.Component {
  static propTypes = {
    firebaseApp: PropTypes.object,
  };
  static defaultProps = {
    databasePath: 'criminals',
    storagePath: 'criminals',
  };
  constructor(props, context) {
    super(props, context);
    this.state = {
      isAddingNewCriminal: false,
      isAddingCriminalToDatabase: false,
    };
  }
  uploadFileToServer = (fileName, file, callback, failCallback) => {
    const {storagePath, firebaseApp} = this.props;
    var storage = firebaseApp.storage();
    var storageRef = storage.ref().child(storagePath + '/' + fileName);

    storageRef
      .put(file)
      .then(snapshot => {
        storageRef.getDownloadURL().then(callback);
      })
      .catch(err => {
        failCallback('Some error occurred while uploading file');
      });
  };
  addCriminalInDatabase = criminal => {
    const {firebaseApp, databasePath} = this.props;
    this.setState({
      isUpdating: true,
      isAddingCriminalToDatabase: true,
      errorAddingCriminal: false,
    });
    firebaseApp
      .database()
      .ref()
      .child(databasePath)
      .push()
      .set(criminal)
      .then(snapshot => {
        this.setState({
          isUpdating: false,
          justAdded: true,
          addedCriminalName: criminal.name,
          isAddingCriminalToDatabase: false,
          isAddingNewCriminal: false,
        });
        setTimeout(() => this.setState({justAdded: false}), 5000);
      })
      .catch(error => {
        this.setState({
          isAddingCriminalToDatabase: false,
          isUpdating: false,
        });
      });
  };
  openAddCriminalDialog = e => {
    this.setState({isAddingNewCriminal: true});
  };
  closeAddCriminalDialog = e => {
    this.setState({isAddingNewCriminal: false});
  };
  addCriminal = data => {
    this.addCriminalInDatabase(data);
  };
  render() {
    const {firebaseApp} = this.props;
    const {
      isAddingNewCriminal,
      justAdded,
      isAddingCriminalToDatabase,
      addedCriminalName,
    } = this.state;
    return (
      <div className="row">
        <div className="col-12  mb-3">
          <div className="row">
            <button
              onClick={this.openAddCriminalDialog}
              className="btn btn-primary col-4 offset-4">
              Add a criminal
            </button>
          </div>
          <span
            style={{
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'green',
            }}>
            {justAdded
              ? `${addedCriminalName} successfully added to criminal database.`
              : null}
          </span>
          <div className="list-group mt-2">
            {isAddingNewCriminal ? (
              <AddCriminal
                onUpload={this.uploadFileToServer}
                isAdding={isAddingCriminalToDatabase}
                onRequestClose={this.closeAddCriminalDialog}
                onSubmit={this.addCriminal}
              />
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

export default Criminals;
