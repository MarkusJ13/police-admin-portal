import React from "react"
import PropTypes from "prop-types"
import Beet from "./Beet"

export class Chauki extends React.Component {
	static propTypes = {
		name: PropTypes.string,
		id: PropTypes.string,
		child: PropTypes.array,
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
		const {onUpdate, id, child} = this.props
		const {name} = this.state
		console.log("save", this.state.name)
		this.setState({isEditing: false})
		onUpdate({
			name,
			child,
			id
		})
	}
	updateChild = (key, data) => {
		const {onUpdate} = this.props
		onUpdate(data, `/child/${key}`)
	}
	handleNameChange = e => {
		const newValue = e.target.value
		this.setState({name: newValue})
	}
	render() {
		const {child} = this.props
		const {name, isEditing} = this.state
		return (<div>
			{
				isEditing
				? <div>
					<input type="text" value={name} onChange={this.handleNameChange}/>
					<button onClick={this.save}>Save</button>
					<button onClick={this.toggleEditMode}>Cancel</button>
				</div>
				: <div>
					<span>{this.props.name}</span>
					<button onClick={this.toggleEditMode}>Edit</button>
				</div>
			}
			<div style={{
				padding: "10px 30px"
			}}>
				{
					Object.keys(child).map(key => {
						const b = child[key]
						const handleUpdate = data => {
							this.updateChild(key, data)
						}
						return <Beet onUpdate={handleUpdate} key={b.id} {...b}/>
					})
				}
			</div>
		</div>)
	}
}

export default Chauki