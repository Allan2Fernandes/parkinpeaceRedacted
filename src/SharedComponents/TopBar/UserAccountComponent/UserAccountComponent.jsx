import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./UserAccountComponent.css"
import { faUser } from "@fortawesome/free-solid-svg-icons"

function UserAccountComponent(props){
 
  

    return (
        <div id="UserAccountComponentMainDiv">
            <div id="UserIconMainDiv" onClick={props.toggleDropDownMenu}>
                <FontAwesomeIcon id="UserIcon" icon={faUser}/>
            </div>      
        </div>
      
    )
}

export default UserAccountComponent