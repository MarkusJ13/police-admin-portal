import React from "react"
import PropTypes from "prop-types"
import ReactModal from 'react-modal';
import {
	Editor, EditorState,
	convertFromRaw, convertFromHTML, ContentState, convertToRaw,
	RichUtils,
} from "draft-js"

/*
<input
					type="text"
					onChange={this.handleTitleChange}
					id={`add-workshop-tab-${id}`}
					value={title}
					className="form-control"
					placeholder="Enter tab name"
				/>
				*/

export class AddWorkshop extends React.Component{
	static propTypes = {
		firebaseApp: PropTypes.object,
		tabs: PropTypes.array,
		title: PropTypes.string,
		id: PropTypes.string,
		onClose: PropTypes.func,
		mode: PropTypes.oneOf(["edit", "add"]),
	}
	static defaultProps = {
		tabs: [],
		title: "",
		mode: "add",
		databasePath: "workshops",
		categoryId: 0,
	}
	constructor(props, context){
		super(props, context)
		const {tabs, title, categoryId} = props
		this.state = {
			isOpen: true,
			workshop: {
				title,
				tabs: tabs.map((tab, index)=>{
					return {
						...tab, key: index,
					}
				}),
				categoryId,
			},
			lastKey: tabs.length + 1,
			categories: [],
			success: {},
			error: {},
			isUpdating: false,
		}
	}
	componentDidMount(){
		const {firebaseApp} = this.props
		const categoriesRef = firebaseApp.database().ref("workshop-categories")
		categoriesRef.on("value",(snapshot)=>{
			console.log(snapshot.val())
			const snapshotVal = snapshot.val()
			let categories = []
			for(var key in snapshotVal){
				categories.push({
					...snapshotVal[key],
				})
			}
			this.setState({categories})
		})
	}
	handleNameChange = e => {
		const {workshop} = this.state
		const title = e.target.value
		this.setState({workshop:{
			...workshop,
			title,
		}})
	}

	addWorkshop = workshop => {
		const {firebaseApp, databasePath, onClose} = this.props
		this.setState({
			isUpdating: true,
		})
		firebaseApp.database().ref().child(databasePath).push().set(workshop).then(snanshot=>{
			console.log("snanshot",snanshot)
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

	updateWorkshop = (id, workshop) => {
		const {firebaseApp, databasePath} = this.props
		const updates = {
			[`${databasePath}/${id}`]: workshop
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

	handleSubmit = e => {
		e.preventDefault()
		const {mode, id} = this.props
		const {workshop} = this.state
		const workshopTabsData = Object.keys(workshop.tabs).map(tabKey=>{
			const w = workshop.tabs[tabKey]
			return {
				...w,
				...this.workshopTabRef(w.key).value,
			}
		})
		const workshopData = {
			...workshop,
			tabs: workshopTabsData
		}
		if (mode==="add") {
			this.addWorkshop(workshopData)
		} else {
			this.updateWorkshop(id, workshopData)
		}
	}
	handleTabDataChange = (data) => {
		const {workshop} = this.state
		console.log(data)
		this.setState({workshop:{
			...workshop,
			tabs: workshop.tabs.map(tab=>{
				if(tab.key === data.key){
					return data
				}else{
					return tab
				}
			})
		}})
	}
	addNewTab = e => {
		e.preventDefault()
		const {workshop, lastKey} = this.state
		this.setState({
			workshop:{
				...workshop,
				tabs: [
					...workshop.tabs,
					{
						key: lastKey + 1,
					}
				],
			},
			lastKey: lastKey + 1,
		})
	}
	handleRemove = id => {
		const {workshop} = this.state
		this.setState({
			workshop: {
				...workshop,
				tabs: workshop.tabs.filter(tab=>{
					return id !== tab.key
				})
			}
		})
	}
	handleRequestCloseFunc = e => {
		this.setState({isOpen: false})
		const {onClose} = this.props
		onClose && onClose()
	}
	selectCategory = categoryId => {
		const {workshop} = this.state
		this.setState({
			workshop: {
				...workshop,
				categoryId,
			}
		})
	}
	handleWorkshopTabCustomRef = (key, ref) => {
		this[`workshop-tab-${key}-ref`] = ref
	}
	workshopTabRef = key => {
		return this[`workshop-tab-${key}-ref`]
	}
	render(){
		const {workshop:{title, tabs, categoryId}, categories, success, error, isUpdating} = this.state
		let categoryTitle = ""
		categories.map(category=>{
			if(category.id===categoryId){
				categoryTitle = category.title
			}
		})
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
				mode === "edit" ? "Update workshop" : "Add a workshop"
			}
		</h2>
		<div className="container-fluid">
			<div className="row justify-content-lg-center">
				<div className="col-8">
					<div className="card">
						<div className="card-header">
							{
								mode === "edit" ? "Update workshop" : "Add a workshop"
							}
						</div>
						<form onSubmit={this.handleSubmit} className="card-body">
							<div className="form-group">
								<label htmlFor="add-workshop-name">Name</label>
								<input
									id="add-workshop-name"
									value={title}
									onChange={this.handleNameChange}
									type="text"
									placeholder="Enter workshop name"
									className="form-control"
								/>
							</div>
							<div className="form-group">
								<label>Select Category</label>
								<div className="dropdown">
									<button className="btn btn-secondary dropdown-toggle"
										type="button"
										id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
									    {categoryTitle}
									  </button>
									<div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
										{
											categories.map(category => {
												const {title, id} = category
												const handleClick = () => {
													this.selectCategory(id)
												}
												return <a key={id} className="dropdown-item" onClick={handleClick} href="#">
													{title}
												</a>
											})
										}
									</div>
								</div>
							</div>
							<div className="form-group">
								<label>Tabs</label>
								<div className="list-group">
									{
										tabs && tabs.map((tab, i)=>{
											const {title, content, key} = tab
											const handleChange = (title, content) => {
												this.handleTabDataChange({title, content, key})
											}
											const handleCustomRef = ref => {
												this.handleWorkshopTabCustomRef(key, ref)
											}
											return <WorkshopTabContentInput
												customRef={handleCustomRef}
												key={key}
												id={key}
												{...tab}
												onChange={handleChange}
												onRemove={this.handleRemove}
											/>
										})
									}
									<div className="list-group-item">
										<button className="btn btn-secondary" onClick={this.addNewTab}>Add a Tab</button>
									</div>
								</div>
							</div>
							<div>
								{error.hasError?<div style={{color:"red"}}>{error.message}</div>:null}
							</div>
							<div>
								{success.hasSuccess?<div style={{color:"green"}}>{success.message}</div>:null}
							</div>
							<button type="submit" className={`btn btn-primary ${isUpdating?"disabled":""}`}>
								{
									mode === "edit" ? `${isUpdating ? "Saving Changes..." : "Save Changes"}` : `${isUpdating ? "Adding new workshop..." : "Add New Workshop"}`
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

export default AddWorkshop