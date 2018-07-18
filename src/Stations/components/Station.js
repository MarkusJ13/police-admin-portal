import React from "react"
import AddStation from "./AddStation"
import PropTypes from "prop-types"
import ReactModal from 'react-modal';

export class Job extends React.Component{
	static propTypes = {
		firebaseApp: PropTypes.object,
	}
	constructor(props, context){
		super(props, context)
		this.state = {
			isDeleting: false,
			isEditing: false,
			stations: [],//can get this from props
		}
	}
	componentDidMount(){
		const {firebaseApp} = this.props
		const stationsRef = firebaseApp.database().ref("stations")
		stationsRef.on("value",(snapshot)=>{
			const snapshotVal = snapshot.val()
			let stations = []
			for(var key in snapshotVal){
				stations.push({
					...snapshotVal[key],
				})
			}
			this.setState({stations})
		})
	}
	enableEditMode = e => {
		e.preventDefault()
		this.setState({isEditing: true})
	}
	disableEditMode = e => {
		this.setState({isEditing: false})
	}

	deleteJob = () => {
		this.db = this.props.firebaseApp.database().ref().child('stations').child(this.props.id).remove()
		// this.db.orderByKey().equalTo(this.props.id).remove()
	}

	render(){
		const {id, thana, firebaseApp} = this.props
		const {stations} = this.state
		const {isEditing} = this.state
		if (isEditing) {
			return <AddStation
				mode="edit"
				onClose={this.disableEditMode}
				id={id}
				thana={thana}
				firebaseApp={firebaseApp}
			/>
		}
		return <div className="list-group-item d-flex justify-content-between align-items-center">
			<div>
				{thana} <span className="badge badge-secondary">{"Add something"}</span>
			</div>
			<div>
				<a onClick={function(){this.setState({isDeleting: true})}.bind(this)} className="btn btn-danger" style={{color: 'white', marginRight: 10}}>Delete</a>
				<a onClick={this.enableEditMode} tabIndex={0} className="btn btn-dark">Edit</a>
			</div>
			<ReactModal isOpen={this.state.isDeleting}
				onRequestClose={function(){this.setState({isDeleting: false})}.bind(this)}
				shouldCloseOnOverlayClick
				shouldCloseOnEsc
				style={{
					overlay: {
						zIndex: 100000,
						backgroundColor: "rgba(0,0,0,0.6)"
					},
					content: {
						top: "40%",
						left: "30%",
						right: "30%",
						bottom: 'auto'
					}
				}}>
				<div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-evenly'}}>
					<div>
						Are you sure you want to delete this station?
					</div>
					<button onClick={this.deleteJob} className="btn btn-danger">
						Yes
					</button>
				</div>
			</ReactModal>
		</div>
	}
}

export default Job