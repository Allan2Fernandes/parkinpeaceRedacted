import { useLocation, useParams } from "react-router-dom";
import "./SingleAdvertisementDetailsPage.css"
import { useEffect, useRef, useState } from "react";
import { baseURL, defaultMapZoomLevel, stockParkingSpaceImage } from "../../Constants";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css'; // Import the default styles
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import { jwtDecode } from "jwt-decode";
import secureLocalStorage from "react-secure-storage";
import TopBar from "../../SharedComponents/TopBar/TopBar";
import { Button, Card, Carousel, Checkbox, Label, TextInput } from "flowbite-react";
import LoginPopup from "../HomePage/LoginPopup/LoginPopup";
import ErrorPage from "../ErrorPage/ErrorPage";
import ConfirmationModal from "../../SharedComponents/ConfirmationModal/ConfirmationModal";

function SingleAdvertisementDetailsPage(props){
    const [advertisementDetails, setAdvertisementDetails] = useState({
        fldSpaceImagesIds: [],
        bookings: [],
        tblSpace: {
            fldAddress: "",
            fldHeight: null,
            fldLatitude: 0,
            fldLength: null,
            fldLongitude: 0,
            fldPrice: 0,
            fldSpaceId: 0,
            fldUserId: 0,
            fldWidth: null
        }
    });
    const [imageToShowIndex, setImageToShowIndex] = useState(0)
    const [showImageMovementButtons, setShowImageMovementButtons] = useState(false)
    const [selectedStartDate, setSelectedStartDate] = useState();
    const [selectedEndDate, setSelectedEndDate] = useState();
    const [displayLoginPopup, setDisplayLoginPopup] = useState(false)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [errorHasOccured, setErrorHasOccured] = useState(false)
    const [notifications, setNotifications] = useState([])
    const { spaceID } = useParams();
    const [openModal, setOpenModal] = useState(false);
    const bookingCancellationRef = useRef()
    const [confirmationMessageBody, setConfirmationMessageBody] = useState("")
    

    useEffect(() => {
        // Check if there is a token in the local storage to check if already logged in
        if(secureLocalStorage.getItem("Token") !== null){
            // Fetch the space details using the SpaceID
            fetchSpaceDetails()
            fetchNotificationsOnUserID()
            setIsLoggedIn(true)
        }else{
            setIsLoggedIn(false)
        }     
    }, [])

    async function fetchSpaceDetails(){
        var fetchURL = `${baseURL}/api/Space/GetSpaceDetailsOnSpaceID/${spaceID}`
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
        await fetch(fetchURL, requestOptions)
            .then(response => response.json())
            .then(response => {
                setAdvertisementDetails(response[0])
                console.log(response[0]['tblSpace']['fldElectricity'])
            })
            .catch(error => {
                secureLocalStorage.clear(); 
                setErrorHasOccured(true);
            })
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

    function closeLoginPopup(){
        setDisplayLoginPopup(false)
    }

    function openLoginPopup(){
        setDisplayLoginPopup(true)
    }

    function generateDateRangeWithHourIncrement(startDate, endDate) {
        const dateRange = [];
        let currentStartDate = new Date(startDate);
        let currentEndDate = new Date(endDate);
      
        currentStartDate.setHours(currentStartDate.getHours() + 1); // Add 1 hour to the start date
        currentEndDate.setHours(currentEndDate.getHours() + 1); // Add 1 hour to the end date
      
        while (currentStartDate <= currentEndDate) {
          dateRange.push(new Date(currentStartDate));
          currentStartDate.setDate(currentStartDate.getDate() + 1); // Increment by 1 day
        }
        return dateRange;
    }



    function generateExclusionDateRangesForAllBookings(){
        if(advertisementDetails.bookings.length === 0) return;
       
        var allExcludedDates = []
        advertisementDetails.bookings.forEach(booking => {
            // Exclude dates where the bookings are not cancelled AND (accepted OR pending)
            if(booking['fldCancellation'] === null && (booking['fldIsAccepted'] === null || booking['fldIsAccepted'])){
                var rangeForThisBooking = generateDateRangeWithHourIncrement(new Date(booking['fldReservationStart']), new Date(booking['fldReservationEnd']))
                rangeForThisBooking.forEach(date => allExcludedDates.push(date))
            }
            
        })
        allExcludedDates = allExcludedDates.sort((a, b) => a - b)
        return allExcludedDates        
    }

    function checkIfBookingsAfterSelectedDate(dateToCheck, ListOfBookingsDates) {
        for (const eachDate of ListOfBookingsDates) {
            if (dateToCheck < eachDate) {
                // Subtract one day from eachDate
                const oneDayBefore = new Date(eachDate);
                oneDayBefore.setDate(oneDayBefore.getDate() - 1);
    
                return oneDayBefore;
            }
        }
    
        return null;
    }

    function getMaxEndDate(){   
        var allExcludedDates = generateExclusionDateRangesForAllBookings()
        if(allExcludedDates === undefined) return
        if(allExcludedDates.length !== 0){
            var firstBookingAfterSelectedStartDate = checkIfBookingsAfterSelectedDate(selectedStartDate, allExcludedDates)
            
            return firstBookingAfterSelectedStartDate
        }else{
            return null
        }
    }

    function negativeIncrementImageToShowIndex(){
        var newImageToShowIndex = imageToShowIndex -1;
        if(newImageToShowIndex < 0){
            newImageToShowIndex = advertisementDetails['fldSpaceImagesIds'].length-1
        }
        console.log(newImageToShowIndex);
        setImageToShowIndex(newImageToShowIndex)
    }

    function positiveIncrementImageToShowIndex(){
        setImageToShowIndex((imageToShowIndex+1)%advertisementDetails['fldSpaceImagesIds'].length)
    }

    function simplifyAddress(address){
        // Split the address by commas
        const parts = address.split(',').map(part => part.trim());

        // Define the indices of the essential address components
        const essentialIndices = [0, 1, 2, 3]; // Modify this based on your needs

        // Create a simplified address with essential components
        const simplifiedAddress = essentialIndices.map(index => parts[index]).join(', ');

        return simplifiedAddress;
    }

    async function createBooking(){
        if(secureLocalStorage.getItem("Token") === undefined || secureLocalStorage.getItem("Token") === null || secureLocalStorage.getItem("Token") === ""){
            openLoginPopup()
            return
        }
        if(selectedStartDate === undefined || selectedEndDate === undefined){
            console.log("Blank fields")
            return
        }

        // TODO the dates are getting saved as an hour behind what is selected.
        const fetchURL = `${baseURL}/api/Booking/CreateBooking`
        // Decode the token
        var decodedToken = jwtDecode(secureLocalStorage.getItem("Token").toString())
        var userID = decodedToken['UserID']   
        var requestBody = {
            fldUserId: userID,
            fldSpaceId: advertisementDetails['tblSpace']['fldSpaceId'],
            fldReservationStart: selectedStartDate,
            fldReservationEnd: selectedEndDate,
            fldCancellation: null,
            fldIsAccepted: true
        }

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
        }).catch(error => {
            secureLocalStorage.clear(); 
            setErrorHasOccured(true)
        })

    }

    if(errorHasOccured){
        return <ErrorPage/>
    }else{
        return(
            <div id="SingleAdvertisementDetailsPageMainDiv">
                <TopBar openLoginPopup={openLoginPopup} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} pageName={"SingleAdvertisementPage"} notifications={notifications} fetchNotificationsOnUserID={fetchNotificationsOnUserID} setErrorHasOccured={setErrorHasOccured}/>
                {
                    displayLoginPopup && <LoginPopup closeLoginPopup={closeLoginPopup} setIsLoggedIn={setIsLoggedIn}/>
                }
                <div id="ImagesDisplayDiv" className="h-56 sm:h-64 xl:h-80 2xl:h-96">
                    {/*
                    <img 
                        src={advertisementDetails.length!==0?`${baseURL}/api/Image/getImageFileOnID/${advertisementDetails['fldSpaceImagesIds'][imageToShowIndex]}`:stockParkingSpaceImage} 
                        onMouseOver={() => setShowImageMovementButtons(true)}
                        onMouseOut={(event) => setShowImageMovementButtons(false)}
                    />    
                    {
                        showImageMovementButtons &&
                        <button id="PreviousImageButton" onClick={negativeIncrementImageToShowIndex} onMouseOver={() => setShowImageMovementButtons(true)} onMouseOut={() => setShowImageMovementButtons(true)}>
                            <FontAwesomeIcon icon={faArrowLeft}/>
                        </button>
                    }    
                    {
                        showImageMovementButtons &&
                        <button id="NextImageButton" onClick={positiveIncrementImageToShowIndex} onMouseOver={() => setShowImageMovementButtons(true)} onMouseOut={() => setShowImageMovementButtons(true)}>
                            <FontAwesomeIcon icon={faArrowRight}/>
                        </button>
                    } 
                    
                    */}
    
                    <Carousel className={"bg-gray-500"}>
                        {
                            advertisementDetails['fldSpaceImagesIds'].map((eachAdvert, advertIndex) => (
                                <img 
                                    key={advertIndex}
                                    src={advertisementDetails.length!==0?`${baseURL}/api/Image/getImageFileOnID/${eachAdvert}`:stockParkingSpaceImage} 
                                    onMouseOver={() => setShowImageMovementButtons(true)}
                                    onMouseOut={(event) => setShowImageMovementButtons(false)}
                                />   
                            ))
                        }
                    </Carousel>
                    
                    
                </div>                  
                <div id="SpaceDetailsDiv">
                <Card className="max-w-sm">
                    <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {`${advertisementDetails['tblSpace']['fldPrice']} DKK/Night`}
                    </h5>
                    <form className="flex flex-col gap-4">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="AddressInput" value={"Address"} />
                            </div>
                            <TextInput id="AddressInput" type="text" placeholder={simplifyAddress(advertisementDetails['tblSpace']['fldAddress'])} required disabled onChange={() => {}}/>
                        </div>
                        
                        <div className="flex items-center gap-2">
                            <Checkbox id="Sewage" checked={advertisementDetails['tblSpace']['fldSewageDisposal']===true?true:false} readOnly/>
                            <Label htmlFor="Sewage">Sewage Available</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="Electricity" checked={advertisementDetails['tblSpace']['fldElectricity']} readOnly/>
                            <Label htmlFor="Electricity">Electricity Available</Label>
                        </div>
                        <div className="flex items-center">
                            <div className="relative">
                                <DatePicker
                                    id="StartDatePicker"
                                    placeholderText="Start Date"
                                    onChange={date => {
                                        setSelectedStartDate(new Date(date))
                                    }}
                                    selected={selectedStartDate}                                        
                                    excludeDates={generateExclusionDateRangesForAllBookings()}
                                    minDate={new Date()}
                                />
                            </div>
                            <span className="mx-4 text-gray-500">to</span>
                            <div className="relative">
                                <DatePicker
                                    id="EndDatePicker"
                                    placeholderText="End Date"
                                    onChange={date => {
                                        setSelectedEndDate(new Date(date))
                                    }}
                                    selected={selectedEndDate}
                                    minDate={selectedStartDate}
                                    maxDate={getMaxEndDate()}
                                />
                            </div>
                        </div>
                        
                        <Button onClick={(event) => {
                             event.preventDefault()
                             setOpenModal(true)
                             setConfirmationMessageBody("Are you sure you want to book this space?")
                             bookingCancellationRef.current = async (event) => {
                                await createBooking();
                                await fetchNotificationsOnUserID()
                                setOpenModal(false)
                                fetchSpaceDetails()
                             }
                        }}>Confirm Booking</Button>
                    </form>
                </Card>
                    {/*                  
                    <table>
                        <tbody>
                            <tr>
                                <td>
                                    <h4>
                                        {simplifyAddress(advertisementDetails['tblSpace']['fldAddress'])}
                                    </h4>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>{`Price: ${advertisementDetails['tblSpace']['fldPrice']} DKK/ Night`}</label>
                                </td>                            
                            </tr>
                            <tr>
                                <td style={{ display: 'flex', gap: '10px', width: '100%'}}>                               
                                  
                                    <DatePicker
                                        id="StartDatePicker"
                                        placeholderText="Start Date"
                                        onChange={date => {
                                            setSelectedStartDate(new Date(date))
                                        }}
                                        selected={selectedStartDate}                                        
                                        excludeDates={generateExclusionDateRangesForAllBookings()}
                                        minDate={new Date()}
                                    />
    
                                    <DatePicker
                                        id="EndDatePicker"
                                        placeholderText="End Date"
                                        onChange={date => {
                                            setSelectedEndDate(new Date(date))
                                        }}
                                        selected={selectedEndDate}
                                        minDate={selectedStartDate}
                                        maxDate={getMaxEndDate()}
                                    />
                                   
                                   
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <Button onClick={createBooking}>Confirm Booking</Button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                      */}
                </div>   
                <div id="SingleAdvertisementMapContainerDiv">
                    <MapContainer 
                        center={[advertisementDetails['tblSpace']['fldLatitude'], advertisementDetails['tblSpace']['fldLongitude']]} 
                        zoom={defaultMapZoomLevel} 
                        style={{ height: '100%', width: '100%' }}
                        key={`${advertisementDetails['tblSpace']['fldLatitude']}-${advertisementDetails['tblSpace']['fldLongitude']}`} // Unique key based on userLocation
                        scrollWheelZoom={false}
                        >
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                        <Marker position={[advertisementDetails['tblSpace']['fldLatitude'], advertisementDetails['tblSpace']['fldLongitude']]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})} />
                    </MapContainer>
                </div>
                <ConfirmationModal
                    openModal={openModal}
                    setOpenModal={setOpenModal}
                    messageBody={confirmationMessageBody}
                    confirmCallBack={bookingCancellationRef.current}
                />
            </div>    
        )
    }
    

    
  
}

export default SingleAdvertisementDetailsPage