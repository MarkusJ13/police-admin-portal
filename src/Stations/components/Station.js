import React from "react"
import AddStation from "./AddStation"
import PropTypes from "prop-types"
import ReactModal from 'react-modal';

export class Station extends React.Component{
	static propTypes = {
		firebaseApp: PropTypes.object,
		child: PropTypes.array,
	}
	constructor(props, context){
		super(props, context)
		this.state = {
			isDeleting: false,
			isEditing: false,
			isExpanded: false,
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
	toggleExpand = e => {
		this.setState({isExpanded: !this.state.isExpanded})
	}
	render(){
		const {id, firebaseApp, child, name} = this.props
		const {stations, isExpanded, isEditing} = this.state
		if (isEditing) {
			return <AddStation
				mode="edit"
				child={child}
				onClose={this.disableEditMode}
				id={id}
				name={name}
				firebaseApp={firebaseApp}
			/>
		}
		return <div style={{
			marginBottom: "24px",
			border: "solid 1px #eee",
			borderRadius: "4px",
			boxShadow: "0 0 20px -3px rgba(0,0,0,0.3)",
			padding: "16px",
		}}>
			<div style={{display: "flex", justifyContent: "space-between"}}>
				<div onClick={this.toggleExpand}>
					{name}
				</div>
				<div>
					<a onClick={function(){this.setState({isDeleting: true})}.bind(this)} className="btn btn-danger" style={{color: 'white', marginRight: 10}}>Delete</a>
					<a onClick={this.enableEditMode} tabIndex={0} className="btn btn-dark">Edit</a>
				</div>
			</div>
			{
				isExpanded
				? ( child
					? <div style={{
						marginTop: "8px",
						marginLeft: "8px",
					}}>
						{Object.keys(child).map(key => <div key={key}>{child[key].name}</div>)}
					</div>
					: "No child" ) 
				: "collapsed"
			}
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

export default Station