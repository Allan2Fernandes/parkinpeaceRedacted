
import { useEffect, useState } from "react"
import TopBar from "../../SharedComponents/TopBar/TopBar.jsx"
import "./HomePage.css"
import LoginPopup from "./LoginPopup/LoginPopup.jsx"
import secureLocalStorage from "react-secure-storage"
import ViewParkingSpaces from "./ViewParkingSpaces/ViewParkingSpaces.jsx"
import ErrorPage from "../ErrorPage/ErrorPage.jsx"
import { baseURL } from "../../Constants.js"
import { jwtDecode } from "jwt-decode"


function HomePage(){
    const [displayLoginPopup, setDisplayLoginPopup] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [errorHasOccured, setErrorHasOccured] = useState(false)
    const [notifications, setNotifications] = useState([])


    useEffect(() => {
        // Check if there is a token in the local storage to check if already logged in
        if(secureLocalStorage.getItem("Token") !== null){
            setIsLoggedIn(true)
            fetchNotificationsOnUserID()
        }else{
            setIsLoggedIn(false)
        }     
    }, [secureLocalStorage.getItem("Token")])

    function closeLoginPopup(){
        setDisplayLoginPopup(false)
    }

    function openLoginPopup(){
        setDisplayLoginPopup(true)
    }

    async function fetchNotificationsOnUserID(){
        var decodedToken = jwtDecode(secureLocalStorage.getItem("Token").toString())
        var current_timestamp = Math.floor(new Date().getTime()/1000)
        console.log(current_timestamp)
        var userID = decodedToken['UserID']   
        console.log(decodedToken['exp']) 
        // If needed, use the expiration time in the token to clear the cache.
        var fetchURL = `${baseURL}/api/Booking/GetPendingBookingsOnUserID/${userID}`

        var requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
                'Authorization': `Bearer ${secureLocalStorage.getItem("Token").toString()}`
            }
        }

        await fetch(fetchURL, requestOptions).then(response => {
            response.json()
            // If the jwt has expired, log the user out.
            if(response.status === 401){
                secureLocalStorage.clear(); 
                setIsLoggedIn(false)
                return;
            }
        }).then(response => {
            setNotifications(response)
        }).catch(error => {              
            setErrorHasOccured(true)            
        })
    }

    if(errorHasOccured){
        return <ErrorPage/>
    }else{
        return (
            <div id="HomePageMainDiv">
                <TopBar openLoginPopup={openLoginPopup} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} pageName={"HomePage"} setErrorHasOccured={setErrorHasOccured} notifications={notifications} fetchNotificationsOnUserID={fetchNotificationsOnUserID}/>
                {
                    <LoginPopup closeLoginPopup={closeLoginPopup} setIsLoggedIn={setIsLoggedIn} displayLoginPopup={displayLoginPopup} setErrorHasOccured={setErrorHasOccured}/>
                }
                <ViewParkingSpaces
                    setErrorHasOccured={setErrorHasOccured}
                    isLoggedIn={isLoggedIn}
                    setIsLoggedIn={setIsLoggedIn}
                    openLoginPopup={openLoginPopup}
                    closeLoginPopup={closeLoginPopup}
                />
            </div>
        )
    }

    
}

export default HomePage