import React, { Component } from 'react';
import { DB_CONFIG } from './FirebaseConfig.js';
import './App.css';
import firebase from "firebase"
import 'firebase/database';
import Users from "./Users";
import Stations from "./Stations";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const firebaseApp = firebase.initializeApp(DB_CONFIG)

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

const PropsRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return renderMergedProps(component, routeProps, rest);
    }}/>
  );
}

class App extends Component {
	constructor(props, context) {
		super(props, context)
		this.state = {
			users: [],
			stations: []
		}
	}

	componentDidMount(){
		const usersRef = firebaseApp.database().ref("users").limitToLast(20);
		usersRef.on("value",(snapshot)=>{
			const snapshotVal = snapshot.val()
			let users = []
			for(var key in snapshotVal){
				users.push({
				...snapshotVal[key],
				id: key
				})
			}
			this.setState({users})
		})
		const stationsRef = firebaseApp.database().ref("stations").limitToLast(20);
		stationsRef.on("value",(snapshot)=>{
			const snapshotVal = snapshot.val()
			let stations = []
			for(var key in snapshotVal){
				stations.push({
				...snapshotVal[key],
				id: key
				})
			}
			this.setState({stations})
		})
	}

	render() {
		const {users, stations} = this.state
		return (
			<Router>
				<div style={{marginBottom: "20px"}}>
					<Users users={users} firebaseApp={firebaseApp} User={this.state.User}/>
					<Stations stations={stations} firebaseApp={firebaseApp} User={this.state.User}/>
				</div>
			</Router>
		);
	}
}

// function b64DecodeUnicode(str) {
//     str = str.replace(/-/g, '+').replace(/_/g, '/')
//     return decodeURIComponent(atob(str).split('').map(function(c) {
//         return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
//     }).join(''));
// }

// export class Authenticated extends React.Component{
//   constructor(props, context) {
//     super(props, context)
//     this.state = {
//       workshops: [],
//       jobs: [],
//       User: null
//     }
//   }
//   componentWillUnmount(){
//     this.unsubscribeToOnAuthStateChanged()
//   }
//   componentDidMount(){
//     const {location, history} = this.props
//     const workshopsRef = firebaseApp.database().ref("workshops")
//     const jobsRef = firebaseApp.database().ref("jobs")
//     workshopsRef.on("value",(snapshot)=>{
//       const snapshotVal = snapshot.val()
//       let workshops = []
//       for(var key in snapshotVal){
//         workshops.push({
//           ...snapshotVal[key],
//           id: key
//         })
//       }
//       this.setState({workshops})
//     })
//     jobsRef.on("value",(snapshot)=>{
//       const snapshotVal = snapshot.val()
//       let jobs = []
//       for(var key in snapshotVal){
//         jobs.push({
//           ...snapshotVal[key],
//           id: key
//         })
//       }
//       this.setState({jobs})
//     })
//     this.unsubscribeToOnAuthStateChanged = firebaseApp.auth().onAuthStateChanged((user)=>{
//       if(!user){
//         history.push({...location,pathname:"/auth"})
//         return
//       }
//       this.setState({User: user})
//       user.getIdToken().then((idToken)=>{
//         const payload = JSON.parse(b64DecodeUnicode(idToken.split('.')[1]));
//         if(payload.admin!==true){
//           history.push({
//             ...location,
//             pathname: "/notadmin"
//           })
//         }
//         if (payload.accessLevel === 7) {
//           history.push({
//             ...location,
//             pathname: "/questions",
//           })
//         }
//         this.setState({user: payload})
//       })
//     })
//   }

//   render(){
//     const {workshops, jobs} = this.state
//     return <div style={{marginBottom: "20px"}}>
//       <Users jobs={jobs} firebaseApp={firebaseApp} User={this.state.User}/>
//     </div>
//   }
// }

// export class Logout extends React.Component{
//   constructor(props, context){
//     super(props, context)
//     firebaseApp.auth().signOut().then(function() {
//       props.history.push({pathname:"/auth"})
//     }, function(error) {
//       props.history.push({pathname:"/auth"})
//     });

//   }
//   render(){
//     return <div>Logging out...</div>
//   }
// }

export default App;