import { useState } from "react";
import "./LoginPopup.css"
import CreateAccountComponent from "./CreateAccountComponent/CreateAccountComponent.jsx"
import LoginComponent from "./LoginComponent/LoginComponent.jsx";

function LoginPopup(props){
    const [displayLoginComponent, setDisplayLoginComponent] = useState(true);

    function closePopup(event){
        if(event.target.id === "LoginPopupMainDiv"){
            // Close the dialog box only if there is a click outside it
            props.closeLoginPopup();
        }      
    }

    function showCreateAccountComponent(){
        setDisplayLoginComponent(false)
    }

    function showLoginComponent(){
        setDisplayLoginComponent(true)
    }

    if(displayLoginComponent){
        return <LoginComponent showCreateAccountComponent={showCreateAccountComponent} closeLoginPopup={props.closeLoginPopup} setIsLoggedIn={props.setIsLoggedIn} displayLoginPopup={props.displayLoginPopup} setErrorHasOccured={props.setErrorHasOccured}/>
    }else{
        return <CreateAccountComponent showLoginComponent={showLoginComponent} closeLoginPopup={props.closeLoginPopup} setIsLoggedIn={props.setIsLoggedIn} displayLoginPopup={props.displayLoginPopup} setErrorHasOccured={props.setErrorHasOccured}/>
    }  
}

export default LoginPopup
