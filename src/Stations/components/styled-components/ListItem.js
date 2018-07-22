import React from "react"
import Styled from "styled-components"

export const ListItem = Styled.div`
    height: ${(props)=>(props.isExpanded ? "" : "38px")};
    overflow: hidden;
    margin: ${(props) => (props.isExpanded ? "5px 0" : "")};
    box-shadow: ${props => props.isExpanded ? "0 0 20px 4px rgba(0,0,0,0.1)" : ""};
    padding: ${props => props.isExpanded ? "12px" : "0 12px"};
    min-width: ${props => props.isExpanded ? "106%" : "100%"}

    transition: height 200ms ease, width 300ms ease;
    border-radius: 3px;
    background: #fff;
    .title-container{
    	display: flex;
    	justify-content: space-between;
    	align-items: center;
    	height: 38px;
    }
    .actions {
    	display: ${props => props.isExpanded ? "" : "none"};
    }
    .title {
    	cursor: pointer;
    }
    .add-new-child {
    	&.hidden {
    		display: none;
    	}
    }
    .child-list {
        padding: 0 0 12px 8px;
        margin-top: 12px;
        height: 188px;
        overflow: auto;
    }
    .beet-items {
        margin-bottom: 8px;
    }
    input {
        height: 38px;
        margin-right: 12px;
        border-radius: 3px;
        border: solid 1px #ddd;
        padding: 0 8px;
    }
`


export default ListItem
