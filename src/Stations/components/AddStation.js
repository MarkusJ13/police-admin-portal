import React from "react"
import PropTypes from "prop-types"
import ReactModal from 'react-modal';
import Chauki from "./Chauki"

export class AddStation extends React.Component{
	static propTypes = {
		firebaseApp: PropTypes.object,
		name: PropTypes.string,
		id: PropTypes.string,
		onClose: PropTypes.func,
		mode: PropTypes.oneOf(["edit", "add"]),
		child: PropTypes.child,
	}
	static defaultProps = {
		name: "",
		id: "",
		mode: "add",
		databasePath: "stations",
	}
	constructor(props, context){
		super(props, context)
		const { name, id } = props
		this.state = {
			isOpen: true,
			station: {
				name,
				id,
			},
			success: {},
			error: {},
			isUpdating: false,
		}
	}

	addStation = station => {
		const {firebaseApp, databasePath, onClose} = this.props
		this.setState({
			isUpdating: true,
		})
		firebaseApp.database().ref().child(databasePath).push().set(station).then(snapshot=>{
			this.setState({
				isUpdating: false,
			})
			onClose()
		}).catch(error=>{
			console.log("error")
			console.log(error)
			this.setState({
				isUpdating: false,
			})
		})
	}

	updateStation = (station) => {
		const {firebaseApp, databasePath} = this.props
		const updates = {
			[`${databasePath}/${station.id}`]: station
		}
		this.setState({error:{}, success:{}, isUpdating: true})
		firebaseApp.database().ref().update(updates).then(snapshot=>{
			this.setState({
				success:{
					message:"Updated",
					hasSuccess: true,
				},
				error: {},
				isUpdating: false,
			})
		}).catch(error=>{
			this.setState({
				error:{
					hasError: true,
					message: "Some error"
				},
				success: {},
				isUpdating: false,
			})
		})
	}

	handleNameChange = e => {
		const {station} = this.state
		const name = e.target.value
		this.setState({station:{
			...station,
			name,
		}})
	}

	handleRequestCloseFunc = e => {
		this.setState({isOpen: false})
		const {onClose} = this.props
		onClose && onClose()
	}

	handleSubmit = e => {
		e.preventDefault()
		const {mode, child} = this.props
		const {station} = this.state
		if (mode==="add") {
			this.addStation(station)
		} else {
			this.updateStation({...station, child})
		}
	}

	updateChild = (key, data) => {
		const {firebaseApp, databasePath} = this.props
		const stationId = this.props.id
		const updates = {
			[`${databasePath}/${stationId}/child/${key}`]: data
		}
		console.log(updates)
		this.setState({error:{}, success:{}, isUpdating: true})
		firebaseApp.database().ref().update(updates).then(snapshot=>{
			this.setState({
				success:{
					message:"Updated",
					hasSuccess: true,
				},
				error: {},
				isUpdating: false,
			})
		}).catch(error=>{
			this.setState({
				error:{
					hasError: true,
					message: "Some error"
				},
				success: {},
				isUpdating: false,
			})
		})
	}

	render(){
		const {station:{name, id}, categories, success, error, isUpdating} = this.state
		const {isOpen} = this.state
		const {mode, child} = this.props
		return <ReactModal isOpen={isOpen}
			onRequestClose={this.handleRequestCloseFunc}
			shouldCloseOnOverlayClick
			shouldCloseOnEsc
			style={{
				overlay: {
					zIndex: 100000,
					backgroundColor: "rgba(0,0,0,0.6)"
				},
				content: {
					top: "10%",
					bottom: "10%",
					left: "10%",
					right: "10%",
				}
		}} >
			<h2>
				{
					mode === "edit" ? "Update thana" : "Add a thana"
				}
			</h2>
			<div className="container-fluid">
				<div className="row justify-content-lg-center">
					<div className="col-10">
						<div className="card">
							<div className="card-header">
								{
									mode === "edit" ? "Update Thana" : "Add a Thana"
								}
							</div>
							<div className="card-body">
								<div className="form-group">
									<label htmlFor="add-workshop-name">Thana</label>
									<input
										id="add-thana-name"
										value={name}
										onChange={this.handleNameChange}
										type="text"
										placeholder="Enter thana name"
										className="form-control"
									/>
								</div>
								{mode === "edit" && child ? <div>
									{
										Object.keys(child).map(key => {
											const handleUpdate = (data, keySuffix="") => {
												this.updateChild(`${key}${keySuffix}`, data)
											}
											const c = child[key]
											return (<Chauki
												key={c.id}
												{...c}
												onUpdate={handleUpdate}
											/>)
										})
									}
								</div> : null}
								<div>
									{error.hasError?<div style={{color:"red"}}>{error.message}</div>:null}
								</div>
								<div>
									{success.hasSuccess?<div style={{color:"green"}}>{success.message}</div>:null}
								</div>
								<button onClick={this.handleSubmit} type="submit" className={`btn btn-primary ${isUpdating?"disabled":""}`}>
									{
										mode === "edit" ? `${isUpdating ? "Saving Changes..." : "Save Changes"}` : `${isUpdating ? "Adding new thana..." : "Add new thana"}`
									}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</ReactModal>
	}
}

export default AddStation