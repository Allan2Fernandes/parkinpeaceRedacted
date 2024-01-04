import { useEffect, useRef, useState } from "react"
import TopBar from "../../SharedComponents/TopBar/TopBar"
import "./CreateAdvertisementPage.css"
import secureLocalStorage from "react-secure-storage"
import LoginPopup from "../HomePage/LoginPopup/LoginPopup"
import AdvertisementDetailsComponent from "./AdvertisementDetailsComponent/AdvertisementDetailsComponent.jsx"
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode";
import { baseURL } from "../../Constants.js"
import ErrorPage from "../ErrorPage/ErrorPage.jsx"
import ConfirmationModal from "../../SharedComponents/ConfirmationModal/ConfirmationModal.jsx"


function CreateAdvertisementPage(){
    const [displayLoginPopup, setDisplayLoginPopup] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [selectedAddress, setSelectedAddress] = useState({name: "", latitude: 54.9060608, longitude: 9.8041856})    
    const [price, setPrice] = useState(0)
    const [parkingSpaceDimensions, setParkingSpaceDimensions] = useState({height: "", width: "", length: ""})
    const [cancellationDetails, setCancellationDetails] = useState({duration: 0, penalty: 0})
    const [sewageDisposalAvailable, setSewageDisposalAvailable] = useState(false)
    const [electricityAvailable, setElectricityAvailable] = useState(false)
    const [listOfParkingSpaceImages, setListOfParkingSpaceImages] = useState([])
    const [spaceIsSaving, setSpaceIsSaving] = useState(false)
    const navigate = useNavigate();
    const [errorHasOccured, setErrorHasOccured] = useState(false)
    const [openModal, setOpenModal] = useState(false)
    const confirmationMessageBody = "Are you sure you want to create this advertisement";
    const createBookingRef = useRef();
    const [notifications, setNotifications] = useState([])

    useEffect(() =>{
        // Check the secure local storage for the token to ensure it is logged in.
        var token = secureLocalStorage.getItem("Token")
        if(token !== null){
            setIsLoggedIn(true)   
            fetchNotificationsOnUserID()        
        }else{
            navigate("/")
        }
        /*
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Latitude is :", position.coords.latitude);
            console.log("Longitude is :", position.coords.longitude);
            setSelectedAddress({name: "", latitude: position.coords.latitude, longitude: position.coords.longitude})
          });
        */
    }, [])

    function closeLoginPopup(){
        setDisplayLoginPopup(false)
    }

    function openLoginPopup(){
        setDisplayLoginPopup(true)
    }

    async function fetchNotificationsOnUserID(){
        var decodedToken = jwtDecode(secureLocalStorage.getItem("Token").toString())
        var userID = decodedToken['UserID']    
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

        await fetch(fetchURL, requestOptions).then(response => response.json()).then(response => {
            setNotifications(response)
        }).catch(error => {      
            secureLocalStorage.clear(); 
            setErrorHasOccured(true)            
        })
    }

    async function createAdvertisement(){
        setSpaceIsSaving(true)
        // Decode the token
        var decodedToken = jwtDecode(secureLocalStorage.getItem("Token").toString())
        var userID = decodedToken['UserID']    
        const fetchURL = `${baseURL}/api/Space/CreateSpaceAdvertisement`
        var listOfImageEncodingStrings = []
        listOfParkingSpaceImages.forEach(set => listOfImageEncodingStrings.push(set['encoding']));
        var requestBody = {
            fldPrice: price,
            fldAddress: selectedAddress['name'],
            fldUserID: userID,
            fldLength: parkingSpaceDimensions['length']===""?null:parkingSpaceDimensions['length'], 
            fldWidth: parkingSpaceDimensions['width']===""?null:parkingSpaceDimensions['width'],
            fldHeight: parkingSpaceDimensions['height']===""?null:parkingSpaceDimensions['height'],
            fldLongitude: selectedAddress['longitude'],
            fldLatitude: selectedAddress['latitude'],
            fldSewageDisposal: sewageDisposalAvailable,
            fldElectricity: electricityAvailable,
            fldCancellationDuration: cancellationDetails['duration'],
            fldCancellationPenalty: cancellationDetails['penalty'],
            listOfImageEncodings: listOfImageEncodingStrings
        }
        console.log(requestBody)

        var requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*',
                'Authorization': `Bearer ${secureLocalStorage.getItem("Token").toString()}`
            },
            body: JSON.stringify(requestBody)
        }

        await fetch(fetchURL, requestOptions)
            .then(response => response.json())
            .then(response => {
                console.log(response)
                setSpaceIsSaving(false)
            }).catch(error => {
                secureLocalStorage.clear(); 
                setErrorHasOccured(true)
                setSpaceIsSaving(false)
            })

    }
    if(errorHasOccured){
        return <ErrorPage/>
    }else{
        return (
            <div id="CreateAdvertisementPageMainDiv">
                <TopBar openLoginPopup={openLoginPopup} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} pageName={"CreateAdvertisementPage"} notifications={notifications} fetchNotificationsOnUserID={fetchNotificationsOnUserID}/>
                {
                    displayLoginPopup && <LoginPopup closeLoginPopup={closeLoginPopup} setIsLoggedIn={setIsLoggedIn}/>
                }           
               
                <AdvertisementDetailsComponent 
                    setSelectedAddress={setSelectedAddress} 
                    selectedAddress={selectedAddress}
                    price={price}
                    setPrice={setPrice}
                    parkingSpaceDimensions={parkingSpaceDimensions}
                    setParkingSpaceDimensions={setParkingSpaceDimensions}
                    cancellationDetails={cancellationDetails}
                    setCancellationDetails={setCancellationDetails}
                    sewageDisposalAvailable={sewageDisposalAvailable}
                    setSewageDisposalAvailable={setSewageDisposalAvailable}
                    electricityAvailable={electricityAvailable}
                    setElectricityAvailable={setElectricityAvailable}
                    listOfParkingSpaceImages={listOfParkingSpaceImages}
                    setListOfParkingSpaceImages={setListOfParkingSpaceImages}
                    createAdvertisement={createAdvertisement}   
                    spaceIsSaving={spaceIsSaving}       
                    setErrorHasOccured={setErrorHasOccured}    
                    createBookingRef={createBookingRef}  
                    setOpenModal={setOpenModal}
                />
                <ConfirmationModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    messageBody={confirmationMessageBody}
                    confirmCallBack={createBookingRef.current}   
                />
            </div>
        )
    }

    
}

export default CreateAdvertisementPage