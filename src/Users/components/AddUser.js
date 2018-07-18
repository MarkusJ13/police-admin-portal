import React from "react"
import PropTypes from "prop-types"
import ReactModal from 'react-modal';

export class AddJob extends React.Component{
	static propTypes = {
		firebaseApp: PropTypes.object,
		name: PropTypes.string,
		id: PropTypes.string,
		phone: PropTypes.string,
		onClose: PropTypes.func,
		mode: PropTypes.oneOf(["edit", "add"]),
	}
	static defaultProps = {
		name: "",
		id: "",
		phone: "",
		mode: "add",
		databasePath: "users",
	}
	constructor(props, context){
		super(props, context)
		const { name, id, phone } = props
		this.state = {
			isOpen: true,
			user: {
				name,
				id,
				phone,
			},
			success: {},
			error: {},
			isUpdating: false,
		}
	}

	addUser = user => {
		const {firebaseApp, databasePath, onClose} = this.props
		this.setState({
			isUpdating: true,
		})
		firebaseApp.database().ref().child(databasePath).push().set(user).then(snapshot=>{
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

	updateUser = (user) => {
		const {firebaseApp, databasePath} = this.props
		const updates = {
			[`${databasePath}/${user.id}`]: user
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
		const {user} = this.state
		const name = e.target.value
		this.setState({user:{
			...user,
			name,
		}})
	}

	handlePhoneChange = e => {
		const {user} = this.state
		const phone = e.target.value
		this.setState({user:{
			...user,
			phone,
		}})
	}

	handleRequestCloseFunc = e => {
		this.setState({isOpen: false})
		const {onClose} = this.props
		onClose && onClose()
	}

	handleSubmit = e => {
		e.preventDefault()
		const {mode} = this.props
		const {user} = this.state
		if (mode==="add") {
			this.addUser(user)
		} else {
			this.updateUser(user)
		}
	}

	render(){
		const {user:{name, id, phone}, categories, success, error, isUpdating} = this.state
		const {isOpen} = this.state
		const {mode} = this.props
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
					mode === "edit" ? "Update user" : "Add a user"
				}
			</h2>
			<div className="container-fluid">
				<div className="row justify-content-lg-center">
					<div className="col-10">
						<div className="card">
							<div className="card-header">
								{
									mode === "edit" ? "Update user" : "Add a user"
								}
							</div>
								<form onSubmit={this.handleSubmit} className="card-body">
								<div className="form-group">
									<label htmlFor="add-workshop-name">Name</label>
									<input
										id="add-user-name"
										value={name}
										onChange={this.handleNameChange}
										type="text"
										placeholder="Enter user name"
										className="form-control"
									/>
								</div>
								<div className="form-group">
									<label htmlFor="add-user-phone">Phone</label>
									<input
										id="add-user-id"
										value={phone}
										onChange={this.handlePhoneChange}
										type="text"
										placeholder="Enter user id"
										className="form-control"
									/>
								</div>
								<div>
									{error.hasError?<div style={{color:"red"}}>{error.message}</div>:null}
								</div>
								<div>
									{success.hasSuccess?<div style={{color:"green"}}>{success.message}</div>:null}
								</div>
								<button type="submit" className={`btn btn-primary ${isUpdating?"disabled":""}`}>
									{
										mode === "edit" ? `${isUpdating ? "Saving Changes..." : "Save Changes"}` : `${isUpdating ? "Adding new user..." : "Add new user"}`
									}
								</button>
							</form>
						</div>
					</div>
				</div>
			</div>
		</ReactModal>
	}
}

export default AddJob