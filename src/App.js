import React, {Component} from 'react';
import {DB_CONFIG} from './FirebaseConfig.js';
import './App.css';
import firebase from 'firebase';
import 'firebase/database';
import Users from './Users';
import Stations from './Stations';
import Criminals from './Criminals';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

const firebaseApp = firebase.initializeApp(DB_CONFIG);

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return React.createElement(component, finalProps);
};

const PropsRoute = ({component, ...rest}) => {
  return (
    <Route
      {...rest}
      render={routeProps => {
        return renderMergedProps(component, routeProps, rest);
      }}
    />
  );
};

class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      users: [],
      stations: [],
      criminals: [],
      tab: 'users',
    };
  }

  componentDidMount() {
    const usersRef = firebaseApp
      .database()
      .ref('users')
      .limitToLast(20);
    usersRef.on('value', snapshot => {
      const snapshotVal = snapshot.val();
      let users = [];
      for (var key in snapshotVal) {
        users.push({
          ...snapshotVal[key],
          id: key,
        });
      }
      this.setState({users});
    });
    const stationsRef = firebaseApp
      .database()
      .ref('stations')
      .limitToLast(20);
    stationsRef.on('value', snapshot => {
      const snapshotVal = snapshot.val();
      let stations = [];
      for (var key in snapshotVal) {
        stations.push({
          ...snapshotVal[key],
          id: key,
        });
      }
      this.setState({stations});
    });
    const criminalsRef = firebaseApp
      .database()
      .ref('criminals')
      .limitToLast(20);
    criminalsRef.on('value', snapshot => {
      const snapshotVal = snapshot.val();
      let criminals = [];
      for (var key in snapshotVal) {
        criminals.push({
          ...snapshotVal[key],
          id: key,
        });
      }
      this.setState({criminals});
    });
  }

  handleSelectTab = tab => {
    this.setState({tab});
  };
  render() {
    const {users, stations, criminals, tab} = this.state;
    return (
      <Router>
        <div style={{marginBottom: '20px'}}>
          <div className="tabs-container col-8 offset-2">
            <div className="tabs">
              <div
                onClick={() => this.handleSelectTab('users')}
                className={`tab ${tab === 'users' ? 'active' : ''}`}>
                Users
              </div>
              <div
                onClick={() => this.handleSelectTab('stations')}
                className={`tab ${tab === 'stations' ? 'active' : ''}`}>
                Police Stations
              </div>
              <div
                onClick={() => this.handleSelectTab('criminals')}
                className={`tab ${tab === 'criminals' ? 'active' : ''}`}>
                Criminals
              </div>
            </div>
            {tab === 'users' && (
              <Users
                users={users}
                firebaseApp={firebaseApp}
                User={this.state.User}
              />
            )}
            {tab === 'stations' && (
              <Stations
                stations={stations}
                firebaseApp={firebaseApp}
                User={this.state.User}
              />
            )}
            {tab === 'criminals' && (
              <Criminals criminals={criminals} firebaseApp={firebaseApp} />
            )}
          </div>
        </div>
      </Router>
    );
  }
}

export default App;
