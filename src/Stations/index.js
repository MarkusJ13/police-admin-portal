import React from "react"
import PropTypes from "prop-types"
import Station from "./components/Station.js";
import AddStation from "./components/AddStation.js";

export class Users extends React.Component{
	static propTypes = {
		firebaseApp: PropTypes.object,
	}
	constructor(props, context) {
		super(props, context)
		this.state = {
			addUserDialogOpen: false,
		}
	}
	openAddWorkshopDialog = e => {
		e.preventDefault()
		this.setState({
			addUserDialogOpen: true,
		})
	}
	closeAddWorkshopDialog = e => {
		this.setState({
			addUserDialogOpen: false,
		})
	}
	render(){
		const {firebaseApp, stations} = this.props
		const {addUserDialogOpen} = this.state
		return <div className="row">
			<div className="col-8 offset-2 mb-3">
				<div className="row">
					<h2 className="col-4">Stations</h2>
					<div className="offset-5 col-3">
						<button
							onClick={this.openAddWorkshopDialog}
							className="btn btn-danger float-right">
							Add a station
						</button>
					</div>
				</div>
				<div className="mt-2">
					{
						stations.map(station=>{
							return <Station firebaseApp={firebaseApp} key={station.id} {...station}/>
						})
					}
				</div>
			</div>
			{
				addUserDialogOpen ? <AddStation
					mode="add"
					onClose={this.closeAddWorkshopDialog}
					firebaseApp={firebaseApp}
					rid={this.props.User?this.props.User.uid:null}
				/> : null
			}
		</div>
	}
}

export default Users