import { useNavigate, useParams } from "react-router-dom"
import TopBar from "../../SharedComponents/TopBar/TopBar"
import "./UserDetailsPage.css"
import { useEffect, useRef, useState } from "react"
import secureLocalStorage from "react-secure-storage"
import { Button, Carousel, Checkbox, Dropdown, Label, Select, Sidebar, Table, TextInput, Modal, Tooltip} from "flowbite-react"
import { HiUser, HiClock, HiHome} from 'react-icons/hi';
import { jwtDecode } from "jwt-decode"
import { baseURL, getAddressDetailsURL } from "../../Constants"
import ConfirmationModal from "../../SharedComponents/ConfirmationModal/ConfirmationModal"
import StandardFunctions from "../../Functions/Functions"
import ErrorPage from "../ErrorPage/ErrorPage"


function UserDetailsPage(){
    const navigate = useNavigate()
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [userDetails, setUserDetails] = useState({
        userEmail: "",
        userName: "",        
        userPhone: "",
        userAddress: "",
        userPass1: "",
        userPass2: ""
    })
    const [bookingDetails, setBookingDetails] = useState([])
    const [spaceDetails, setSpaceDetails] = useState([])
    const [selectedSpaceDetailsIndex, setSelectedSpaceDetailsIndex] = useState(-1)
    const [searchedAddresses, setSearchedAddresses] = useState([])
    const [listOfImageIDs, setListOfImageIDs] = useState([])
    const [openModal, setOpenModal] = useState(false);
    const bookingCancellationRef = useRef()
    const [confirmationMessageBody, setConfirmationMessageBody] = useState("")
    const [errorHasOccured, setErrorHasOccured] = useState(false)
    const [notifications, setNotifications] = useState([])

    /*
        Book Detail field properties
        cancellationDateTime: null,
        isAccepted: false,
        reservationStartDateTime: null,
        reservationEndDateTime: null,
        spaceAddress: "",
        spaceOwnersEmail: "",
        spaceOwnersName: "",
        spaceOwnersPhoneNumber: ""
    */
    
    const sideBarSelection = useParams()

    useEffect(() => {
        // Check if there is a token in the local storage to check if already logged in
        if(secureLocalStorage.getItem("Token") !== null){      
            fetchNotificationsOnUserID()      
            setIsLoggedIn(true)
            // Fetch the user's details and populate the fields
            var claims = jwtDecode(secureLocalStorage.getItem("Token"))
            getUserDetails(claims)
            getUsersBookings(claims)
            getUserSpaces(claims)
            
        }else{
            navigate("/")
            console.log("redirecting")
        }
    }, [])

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

    // Pull the data from the database if the selection is changed
    useEffect(() => {
        if(selectedSpaceDetailsIndex === -1) return

        if(secureLocalStorage.getItem("Token") !== null){         
            setIsLoggedIn(true)
            // Fetch the user's details and populate the fields
            var claims = jwtDecode(secureLocalStorage.getItem("Token"))   
            getUserSpaces(claims)    
            // Fetch the images associated with this space
            getSpaceImages(claims)
        }else{
            navigate("/")
            console.log("redirecting")
        }

    }, [selectedSpaceDetailsIndex])
    /*
     useEffect(() => {
        if(selectedSpaceDetailsIndex === -1) return
        var addressAPIAddress = `${getAddressDetailsURL}${spaceDetails[selectedSpaceDetailsIndex]['address']}`
        fetch(addressAPIAddress).then(response => response.json()).then(response => {
            setSearchedAddresses(response)
            console.log(response)
        })
    }, [selectedSpaceDetailsIndex===-1?null:spaceDetails[selectedSpaceDetailsIndex]['address']])    
    
    */
   

    function handleOnKeyUpSearchAddresses(event){
        if(selectedSpaceDetailsIndex === -1 || event.key !== "Enter") return
        var addressAPIAddress = `${getAddressDetailsURL}${spaceDetails[selectedSpaceDetailsIndex]['address']}`
        fetch(addressAPIAddress).then(response => response.json()).then(response => {
            setSearchedAddresses(response)
        })
    }



    async function getUserDetails(claims){
        const fetchURL = `${baseURL}/api/User/GetUserDetails/${claims['UserID']}`
    
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
                },
            }
    
            await fetch(fetchURL, requestOptions)
                .then(response => response.json())
                .then(response => {
                    setUserDetails({
                        userEmail: response['foundUser']['fldEmail'],
                        userName: response['foundUser']['fldName'],        
                        userPhone: response['foundUser']['fldPhoneNumber'],
                        userAddress: response['foundUser']['fldAdress'],
                        userPass1: "",
                        userPass2: ""
                    })
                }).catch(error => setErrorHasOccured(true))

    }

    async function getUsersBookings(claims){
        const fetchURL = `${baseURL}/api/Booking/getBookingOnUserID/${claims['UserID']}`

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
            },
        }
        await fetch(fetchURL, requestOptions)
        .then(response => response.json())
        .then(response => {
            setBookingDetails(response)
        }).catch(error => setErrorHasOccured(true))
    }

    async function getUserSpaces(claims){
        const fetchURL = `${baseURL}/api/Space/getSpacesOnOwnerUserID/${claims['UserID']}`

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
            },
        }
        await fetch(fetchURL, requestOptions).then(response => response.json()).then(response => {
            setSpaceDetails(response)
        }).catch(error => setErrorHasOccured(true))
    }

    async function getSpaceImages(claims){
        const fetchURL = `${baseURL}/api/Image/GetImagesOfSpace/${spaceDetails[selectedSpaceDetailsIndex]['spaceID']}`
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
            },
        }
        await fetch(fetchURL, requestOptions).then(response => response.json()).then(response => {setListOfImageIDs(response)})
    }

    function handleChangeUserDetails(event, propertyName){
        var newUserDeatils = structuredClone(userDetails)
        newUserDeatils[propertyName] = event.target.value
        setUserDetails(newUserDeatils)
    }

    async function clickHandlerUpdateUserDetails(event){
        // Create a check for verifying passwords match
        if(userDetails.userPass1 !== "" || userDetails.userPass2 !== ""){
            if(userDetails.userPass1 !== userDetails.userPass2){
                event.preventDefault()
                return;
            }
        }
        // Decode the token
        var decodedToken = jwtDecode(secureLocalStorage.getItem("Token").toString())
        var userID = decodedToken['UserID']    
        const fetchURL = `${baseURL}/api/User/UpdateUserDetails`
        var requestBody = {
            fldUserId: userID,
            fldName: userDetails.userName,
            fldPhoneNumber: userDetails.userPhone,
            fldAddress: userDetails.userAddress,
            fldPassword: userDetails.userPass1,
            fldEmail: userDetails.userEmail
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
            }).catch(error => {
                secureLocalStorage.clear(); 
                setErrorHasOccured(true)
            })
    }
   

    function getBookingStatus(eachBooking){
        // If it is null - Awaiting confirmation
        // If it is true - Accepted
            // If it is true and there is a cancellation time - Cancelled
            // If it is true and there is no cancellation time and the current date is between the start and end - ongoing
            // If it is true and there is no cancellation time and the current date is before the start - confirmed
            // If it is true and there is no cancellation time and the current date is after the end - Completed
        // if it is false- Rejected
        if(eachBooking['isAccepted'] === null){
            return "Awaiting Confirmation"
        }else if(eachBooking['isAccepted']){
            // TODO What if the booking has already ended?
            if(eachBooking['cancellationDateTime'] !== null){
                return "Cancelled"
            }else{
                var currentDate = new Date()
                if(currentDate > new Date(eachBooking['reservationStartDate']) && currentDate < new Date(eachBooking['reservationEndDate'])){
                    return "Ongoing"
                }else if(currentDate < new Date(eachBooking['reservationStartDate'])){
                    return "Confirmed"
                }else if(currentDate > new Date(eachBooking['reservationEndDate'])){
                    return "Completed"
                }
            }
        }else if(!eachBooking['isAccepted']){
            return "Rejected"
        }
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



    async function CancelBooking(bookingID){
         // Decode the token 
         const fetchURL = `${baseURL}/api/Booking/cancelBooking/${bookingID}`  
 
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
         }
 
         await fetch(fetchURL, requestOptions)
             .then(response => response.json())
             .then(response => {
                console.log(response)
             }).catch(error =>{ 
                secureLocalStorage.clear(); 
                setErrorHasOccured(true)
            })
    }

    function generateAccountDetailsHTMLCode(){
        return (
            <div id="FormDiv" className="flex-1 overflow-y-auto p-8 w-3/4  flex-grow">
                    <form className="flex max-w-full flex-col gap-4 my-10">
                        <div>
                            <div className="mb-2 block">
                            <Label htmlFor="UserEmail" value="Your email" />
                            </div>
                            <TextInput id="UserEmail" type="email" placeholder="name@ParkinPeace.com" value={userDetails.userEmail} onChange={(event) => handleChangeUserDetails(event, 'userEmail')} required shadow />
                        </div>
                        <div>
                            <div className="mb-2 block">
                            <Label htmlFor="UserName" value="Your Name" />
                            </div>
                            <TextInput id="UserName" type="text" placeholder="Placeholder" value={userDetails.userName}  onChange={(event) => handleChangeUserDetails(event, 'userName')} required shadow />
                        </div>
                        <div>
                            <div className="mb-2 block">
                            <Label htmlFor="UserPhone" value="Your Telephone Number" />
                            </div>
                            <TextInput id="UserPhone" type="text" placeholder="12345678" value={userDetails.userPhone} onChange={(event) => handleChangeUserDetails(event, 'userPhone')} required shadow />
                        </div>
                        <div>
                            <div className="mb-2 block">
                            <Label htmlFor="UserAddress" value="Your Address" />
                            </div>
                            <TextInput id="UserAddress" type="text" placeholder="Eg. Østergade 9, 2th"  value={userDetails.userAddress} onChange={(event) => handleChangeUserDetails(event, 'userAddress')} required shadow />
                        </div>
                        <div>
                            <div className="mb-2 block">
                            <Label htmlFor="UserPass1" value="Your password" />
                            </div>
                            <TextInput 
                                id="UserPass1" 
                                type="password" 
                                shadow placeholder="(Optional) Enter a password" 
                                value={userDetails.userPass1} 
                                onChange={(event) => handleChangeUserDetails(event, 'userPass1')}
                                color={StandardFunctions.getPasswordInputStates(userDetails.userPass1, userDetails.userPass2)}
                                helperText={StandardFunctions.getPasswordInputStates(userDetails.userPass1, userDetails.userPass2) === "failure"?
                                (
                                    <>
                                        <span className="font-medium">Error!</span> Ensure The passwords Match!
                                    </>
                                )
                                :
                                null
                            }
                            />
                        </div>
                        <div>
                            <div className="mb-2 block">
                            <Label htmlFor="UserPass2" value="Repeat password"/>
                            </div>
                            <TextInput 
                                id="UserPass2" 
                                type="password" 
                                shadow placeholder="(Optional) Repeat password" 
                                value={userDetails.userPass2} 
                                onChange={(event) => handleChangeUserDetails(event, 'userPass2')} 
                                color={StandardFunctions.getPasswordInputStates(userDetails.userPass1, userDetails.userPass2)}
                                helperText={StandardFunctions.getPasswordInputStates(userDetails.userPass1, userDetails.userPass2) === "failure"?
                                    (
                                        <>
                                            <span className="font-medium">Error!</span> Ensure The passwords Match!
                                        </>
                                    )
                                    :
                                    null
                                }
                            />
                        </div>
                    
                        <Button type="submit" onClick={(event) => {
                            event.preventDefault()
                            setOpenModal(true)
                            setConfirmationMessageBody("Are you sure you want to update your account?")
                            bookingCancellationRef.current = async (event) => {
                                await clickHandlerUpdateUserDetails()
                                setOpenModal(false)
                                var claims = jwtDecode(secureLocalStorage.getItem("Token"))
                                getUserDetails(claims)
                            }
                        }}>Update Account details</Button>
                    </form>
                </div>
        )
    }

    function generateBookingsHTMLCode(){
        return (
            <div className="w-full  flex-grow">
                <Table striped className="w-full">
                    <Table.Head>
                        <Table.HeadCell>Address</Table.HeadCell>
                        <Table.HeadCell>Start Date</Table.HeadCell>
                        <Table.HeadCell>End Date</Table.HeadCell>
                        <Table.HeadCell>Space Owner</Table.HeadCell>
                        <Table.HeadCell>Owner's Tlf. Nr.</Table.HeadCell>
                        <Table.HeadCell>Owner's Email</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                        <Table.HeadCell>
                            <span>Edit</span>
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body className="divide-y">
                        {
                            bookingDetails.map((eachBooking, bookingIndex) => (
                                <Table.Row key={bookingIndex} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{simplifyAddress(eachBooking['spaceAddress'])}</Table.Cell>
                                    <Table.Cell>{eachBooking['reservationStartDate']}</Table.Cell>
                                    <Table.Cell>{eachBooking['reservationEndDate']}</Table.Cell>
                                    <Table.Cell>{eachBooking['spaceOwnerName']}</Table.Cell>
                                    <Table.Cell>{eachBooking['spaceOwnerPhoneNumber']}</Table.Cell>
                                    <Table.Cell>{eachBooking['spaceOwnerEmail']}</Table.Cell>
                                    
                                    <Table.Cell>{getBookingStatus(eachBooking)}</Table.Cell> 
                                    <Table.Cell>
                                        <a className="font-medium text-cyan-600 hover:underline dark:text-cyan-500 cursor-pointer" onClick={() => {     
                                            if(getBookingStatus(eachBooking)!=="Confirmed") return                              
                                            setOpenModal(true)
                                            setConfirmationMessageBody("Are you sure you want cancel this booking?")
                                            bookingCancellationRef.current = async () =>  {
                                                await CancelBooking(eachBooking['bookingID'])
                                                setOpenModal(false)
                                                var claims = jwtDecode(secureLocalStorage.getItem("Token"))
                                                getUsersBookings(claims)
                                                
                                            }
                                            }}>
                                        Cancel
                                        </a>
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Body>
                </Table>
            </div>            
        )
    }

    function handleChangeSpaceDetailsInputFields(event, spaceDetailsIndex, fieldName){
        var newSpaceDetails = structuredClone(spaceDetails)
        newSpaceDetails[spaceDetailsIndex][fieldName] = event.target.value
        setSpaceDetails(newSpaceDetails)
    }

    function handleOnClickSearchedAddress(event, selectedSpaceDetailsIndex, addressSet){
        var newSpaceDetails = structuredClone(spaceDetails)
        newSpaceDetails[selectedSpaceDetailsIndex]['address'] = addressSet['display_name']
        newSpaceDetails[selectedSpaceDetailsIndex]['latitude'] = parseFloat(addressSet['lat'])
        newSpaceDetails[selectedSpaceDetailsIndex]['longitude'] = parseFloat(addressSet['lon'])
        setSpaceDetails(newSpaceDetails)
    }

    async function handleClickConfirmSpaceDetailsChanges(SpaceDetails){
        /*
        Structure of the body
        {
            "fldSpaceId": 0,
            "fldPrice": 0,
            "fldAddress": "string",
            "fldLength": 0,
            "fldWidth": 0,
            "fldHeight": 0,
            "fldLongitude": 0,
            "fldLatitude": 0
        }        
        */     
        // Decode the token
        console.log(SpaceDetails)
        var decodedToken = jwtDecode(secureLocalStorage.getItem("Token").toString())
       
        const fetchURL = `${baseURL}/api/Space/UpdateSpaceDetails`
        var requestBody = {
            fldSpaceId: SpaceDetails['spaceID'],
            fldPrice: SpaceDetails['price'],
            fldAddress: SpaceDetails['address'],
            fldLength: SpaceDetails['length']===""?null:SpaceDetails['length'],
            fldWidth: SpaceDetails['width']===""?null:SpaceDetails['width'],
            fldHeight: SpaceDetails['height']===""?null:SpaceDetails['height'],
            fldLongitude: SpaceDetails['longitude'],
            fldLatitude: SpaceDetails['latitude'],
            fldSewageDisposal: SpaceDetails['sewageDisposal'],
            fldElectricity: SpaceDetails['electricity']
        }

        var requestOptions = {
            method: 'PUT',
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

    async function deactivateSpace(eachSpace){
        const fetchURL = `${baseURL}/api/Space/DeactivateSpace`
        var requestBody = {
            fldSpaceId: eachSpace['spaceID']
        }
        var requestOptions = {
            method: 'DELETE',
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
        await fetch(fetchURL, requestOptions).then(response => response.json()).then(response => {
            console.log(response)            
        }).catch(error => {
            secureLocalStorage.clear(); 
            setErrorHasOccured(true)
        })
    }

    function generateAdvertisementsHTMLCode(){

        return (
            <div id="FormDiv" className="flex-1 overflow-y-auto p-8 flex-grow">
                {/* 
                    Address. Print it out from the database and an input field to change the address                    
                    Input field showing the price
                    Input fields for dimensions
                    Gallery of images. With the ability to remove and add more images
                    Button to submit the form

                    A table showing the bookins associated with the address.
                        Table should show the the customers name, phone, email and reservation dates and status (Awaiting confirmation, Confirmed, Rejected)
                */}               
                <Table>
                    <Table.Head>
                        <Table.HeadCell>
                            Address
                        </Table.HeadCell>
                        <Table.HeadCell>
                            Price
                        </Table.HeadCell>
                        <Table.HeadCell>
                            Length
                        </Table.HeadCell>
                        <Table.HeadCell>
                            Width
                        </Table.HeadCell>
                        <Table.HeadCell>
                            Height
                        </Table.HeadCell>
                        <Table.HeadCell>
                            Action
                        </Table.HeadCell>
                        <Table.HeadCell>
                            Delete
                        </Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                        {
                            spaceDetails.map((eachSpace, spaceIndex) => (
                                // selectedSpaceDetailsIndex === -1 means a spaceDeatils hasn't been selected.
                                <Table.Row key={spaceIndex} className={`${spaceIndex===selectedSpaceDetailsIndex?"bg-gray-300":""}`}>
                                    <Table.Cell>
                                        {simplifyAddress(eachSpace['address'])}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {eachSpace['price']}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {eachSpace['length']}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {eachSpace['width']}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {eachSpace['height']}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button onClick={(event) => spaceIndex===selectedSpaceDetailsIndex?setSelectedSpaceDetailsIndex(-1):setSelectedSpaceDetailsIndex(spaceIndex)}>
                                            {spaceIndex===selectedSpaceDetailsIndex?"Cancel":"Edit"}
                                        </Button>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button onClick={() => {
                                                //deactivateSpace(eachSpace)
                                                setOpenModal(true) 
                                                setConfirmationMessageBody("Are you sure you want to delete this space?")

                                                bookingCancellationRef.current = async () =>  {
                                                    await deactivateSpace(eachSpace)
                                                    setOpenModal(false)
                                                    var claims = jwtDecode(secureLocalStorage.getItem("Token"))
                                                    getUserSpaces(claims)                                                    
                                                }
                                            }}>
                                            X
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))
                        }
                    </Table.Body>
                </Table>
                {
                    selectedSpaceDetailsIndex !==-1 &&
                    <form className="flex max-w-full flex-col gap-4 my-10" onSubmit={(event) => event.preventDefault()}>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="AddressInput" value="Address" />
                            </div>
                            <TextInput id="AddressInput" type="text" placeholder="Find an address" required shadow value={spaceDetails[selectedSpaceDetailsIndex]['address']} 
                                onChange={(event) => {
                                    handleChangeSpaceDetailsInputFields(event, selectedSpaceDetailsIndex, "address")
                                }} 
                                onKeyUp={handleOnKeyUpSearchAddresses}/>   
                            <Table striped>
                                <Table.Body>
                                    {
                                        searchedAddresses.map((eachAddressSet, index) => (
                                            <Table.Row key={index} className="cursor-pointer" onClick={(event) => {
                                                handleOnClickSearchedAddress(event, selectedSpaceDetailsIndex, eachAddressSet)
                                                }}>
                                                <Table.Cell>{eachAddressSet['display_name']}</Table.Cell>
                                            </Table.Row>
                                        ))
                                    }
                                </Table.Body>
                            </Table>               
                    
                        </div>    
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="PriceInput" value="Price" />
                            </div>
                            <TextInput id="PriceInput" type="number" placeholder="Change the Price" required shadow value={spaceDetails[selectedSpaceDetailsIndex]['price']} onChange={(event) => handleChangeSpaceDetailsInputFields(event, selectedSpaceDetailsIndex, "price")}/>                       
                        </div>     
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="LengthInput" value="Length" />
                            </div>
                            <TextInput id="LengthInput" type="number" placeholder="Change the Length" shadow value={spaceDetails[selectedSpaceDetailsIndex]['length']===null?"":spaceDetails[selectedSpaceDetailsIndex]['length']} onChange={(event) => handleChangeSpaceDetailsInputFields(event, selectedSpaceDetailsIndex, "length")}/>                       
                        </div>   
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="WidthInput" value="Width" />
                            </div>
                            <TextInput id="WidthInput" type="number" placeholder="Change the Width" shadow value={spaceDetails[selectedSpaceDetailsIndex]['width']===null?"":spaceDetails[selectedSpaceDetailsIndex]['width']} onChange={(event) => handleChangeSpaceDetailsInputFields(event, selectedSpaceDetailsIndex, "width")}/>                       
                        </div>   
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="HeightInput" value="Height" />
                            </div>
                            <TextInput id="HeightInput" type="number" placeholder="Change the Height" shadow value={spaceDetails[selectedSpaceDetailsIndex]['height']===null?"":spaceDetails[selectedSpaceDetailsIndex]['height']} onChange={(event) => handleChangeSpaceDetailsInputFields(event, selectedSpaceDetailsIndex, "height")}/>                       
                        </div>  
                        <div className="flex items-center gap-2 mb-2">                                
                                <Checkbox id="SewageDisposal" checked={spaceDetails[selectedSpaceDetailsIndex]['sewageDisposal']} onChange={() => {
                                    var newSpaceDetails = structuredClone(spaceDetails)
                                    newSpaceDetails[selectedSpaceDetailsIndex]['sewageDisposal'] = !newSpaceDetails[selectedSpaceDetailsIndex]['sewageDisposal']
                                    setSpaceDetails(newSpaceDetails)
                                }}/>
                                <Tooltip content={"Check this option if sewage disposal is possible here"}>
                                    {" "}
                                    <Label htmlFor="SewageDisposal">Sewage Disposal</Label>
                                </Tooltip>                               
                            </div>
                            <div className="flex items-center gap-2 mb-2">                                
                                <Checkbox id="ElectricityAvailable" checked={spaceDetails[selectedSpaceDetailsIndex]['electricity']} onChange={() => {
                                    var newSpaceDetails = structuredClone(spaceDetails)
                                    newSpaceDetails[selectedSpaceDetailsIndex]['electricity'] = !newSpaceDetails[selectedSpaceDetailsIndex]['electricity']
                                    setSpaceDetails(newSpaceDetails)
                                }}/>
                                <Tooltip content={"Check this option if power can be delivered to the vehicle"}> {/* Ask Gerhard what type of power. Is this for charging the vehicle or for leisure activities inside the autocamper */}
                                    {" "}
                                    <Label htmlFor="ElectricityAvailable">Electricity available</Label>
                                </Tooltip>                               
                            </div>
                        {/*
                            If the selection is changed, pull data from the database again before allowing the user to continue updating the properties. Save just that one space on submit clicked

                        */}
                           <div id="CarouselContainer" className="h-56 sm:h-64 xl:h-80 2xl:h-96">
                                <Carousel>
                                    {
                                        listOfImageIDs.map((eachImageID, imageIDIndex) => (     
                                            <img src={`${baseURL}/api/Image/getImageFileOnID/${eachImageID}`}/>        
                                        ))
                                    }
                                </Carousel>
                            </div>
                        <Button onClick={(event) => {
                                //handleClickConfirmSpaceDetailsChanges(spaceDetails[selectedSpaceDetailsIndex])    
                                setOpenModal(true)   
                                setConfirmationMessageBody("Are you sure you want to make these changes to this space?")      
                                
                                bookingCancellationRef.current = async () =>  {
                                    await handleClickConfirmSpaceDetailsChanges(spaceDetails[selectedSpaceDetailsIndex])
                                    setOpenModal(false)                                                   
                                }
                            }}>Confirm Changes</Button>
                    </form>
                }
                
            </div>
        )
    }

    function  mainBody(){
        if(sideBarSelection['sideBarSelection'] === 'AccountSelected'){
            return generateAccountDetailsHTMLCode()
        }else if(sideBarSelection['sideBarSelection'] === 'BookingsSelected'){
            return generateBookingsHTMLCode()
        }else if(sideBarSelection['sideBarSelection'] === 'AdvertisementsSelected'){
            return generateAdvertisementsHTMLCode()
        }       
    }
    if(errorHasOccured){
        return <ErrorPage/>
    }else{
        return (
            <div id="UserDetailsPageMainDiv" className="h-full">
                <TopBar  isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} pageName={"UserDetailsPage"} className={"w-1/4"} notifications={notifications} fetchNotificationsOnUserID={fetchNotificationsOnUserID}/>
                <div className="flex h-full flex-row">
                    <div className="h-full ">
                        <Sidebar aria-label="Default sidebar" className="h-full">
                            <Sidebar.Items>
                                <Sidebar.ItemGroup>
                                <Sidebar.Item href="/UserDetailsPage/AccountSelected" icon={HiUser}>
                                    Account
                                </Sidebar.Item>
                                <Sidebar.Item href="/UserDetailsPage/BookingsSelected" icon={HiClock} labelColor="dark">
                                    Bookings
                                </Sidebar.Item>
                                <Sidebar.Item href="/UserDetailsPage/AdvertisementsSelected" icon={HiHome}>
                                    Parking Spaces
                                </Sidebar.Item>                    
                                </Sidebar.ItemGroup>
                            </Sidebar.Items>
                        </Sidebar>
                    </div>
                   
                    {                        
                        mainBody()                        
                    }
                    
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

export default UserDetailsPage