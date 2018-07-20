import React from "react"
import PropTypes from "prop-types"

export class Beet extends React.Component {
	static propTypes = {
		name: PropTypes.string,
		id: PropTypes.string,
	}
	constructor(props, context) {
		super(props, context)
		this.state = {
			isEditing: false,
			name: props.name
		}
	}
	toggleEditMode = e => {
		const { isEditing } = this.state
		if (isEditing) {
			this.setState({isEditing: false, name: this.props.name})
		} else {
			this.setState({isEditing: true})
		}
	}
	save = e => {
		const {onUpdate, id} = this.props
		const {name} = this.state
		this.setState({isEditing: false})
		onUpdate({
			name,
			id
		})
	}
	handleNameChange = e => {
		const newValue = e.target.value
		this.setState({name: newValue})
	}
	render () {
		const {name, isEditing} = this.state
		return (
			<div>
				{
					isEditing
					? <div>
						<input onChange={this.handleNameChange} type="text" value={name}/>
						<button onClick={this.save}>Save</button>
						<button onClick={this.toggleEditMode}>Cancel</button>
					</div>
					: <div>
						<span>{this.props.name}</span>
						<button onClick={this.toggleEditMode}>Edit</button>
					</div>
				}
			</div>
		)
	}
}

export default Beet