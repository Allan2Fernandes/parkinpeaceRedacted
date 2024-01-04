
import './TopBar.css'
import {  useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react';
import secureLocalStorage from 'react-secure-storage';
import { jwtDecode } from 'jwt-decode';
import { Navbar, Dropdown, Avatar, Button, Accordion } from 'flowbite-react';
import StandardFunctions from '../../Functions/Functions';
import { baseURL } from '../../Constants';

function TopBar(props){
    const navigate = useNavigate();
    const [showDropDownMenu, setShowDropDownMenu] = useState(false)
    const [notifications, setNotifications] = useState([])
    const NavbarBackgroundColor = 'bg-gray-200'

    useEffect(() => {
        setShowDropDownMenu(false)
        if(props.isLoggedIn){
            getLoggedInUsersEmail()
        }
    }, [props.isLoggedIn])

    useEffect(() => {
    }, [props.pageName]) 

    useEffect(() =>{
        setNotifications(props.notifications)
    }, [props.notifications!==undefined?props.notifications:null])

    function loginButtonClickHandler(){
        props.openLoginPopup();
    }

    function toggleDropDownMenu(){
        console.log("Triggered")
        setShowDropDownMenu(!showDropDownMenu);
    }

    function logoutClickHandler(){
        secureLocalStorage.clear();
        setShowDropDownMenu(false);
        props.setIsLoggedIn(false);
        navigate("/");
    }

    function navigateToCreateAdvertisementPage(){
        navigate("/CreateAdvertisementPage")
    }

    function navigateToHomePage(){
        navigate("/");
    }

    function getLoggedInUsersEmail(){
        var decodedToken = jwtDecode(secureLocalStorage.getItem("Token").toString())
        return decodedToken['Name']
    }

    function formatDate(date) {
        let newDate = new Date(date);
        newDate.setHours(newDate.getHours() + 1); // Add 1 hour to the start date
        // Extract day, month, and year components
        const day = newDate.getDate();
        const month = newDate.getMonth() + 1; // Months are zero-based
        const year = newDate.getFullYear();
      
        // Ensure two-digit formatting
        const formattedDay = String(day).padStart(2, '0');
        const formattedMonth = String(month).padStart(2, '0');
      
        // Create the formatted date string
        const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;
      
        return formattedDate;
      }
      

    function getNotificationIconHTML(){
        if(notifications === undefined || notifications.length === 0){
            return (
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 21">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 3.464V1.1m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175C15 15.4 15 16 14.462 16H1.538C1 16 1 15.4 1 14.807c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 8 3.464ZM4.54 16a3.48 3.48 0 0 0 6.92 0H4.54Z"/>
                </svg>
            )
        }else{
            return (
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15.133 10.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V1.1a1 1 0 0 0-2 0v2.364a.946.946 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C4.867 13.018 3 13.614 3 14.807 3 15.4 3 16 3.538 16h12.924C17 16 17 15.4 17 14.807c0-1.193-1.867-1.789-1.867-4.175ZM4 4a1 1 0 0 1-.707-.293l-1-1a1 1 0 0 1 1.414-1.414l1 1A1 1 0 0 1 4 4ZM2 8H1a1 1 0 0 1 0-2h1a1 1 0 1 1 0 2Zm14-4a1 1 0 0 1-.707-1.707l1-1a1 1 0 1 1 1.414 1.414l-1 1A1 1 0 0 1 16 4Zm3 4h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2ZM6.823 17a3.453 3.453 0 0 0 6.354 0H6.823Z"/>
                </svg>
            )
        }        
    }

    function ConfirmBookingWithDecision(notification, decision){
        var fetchURL = `${baseURL}/api/Booking/ConfirmBookingDecision`
        var requestBody = {
            fldBookingId: notification['booking']['fldBookingId'],
            fldIsAccepted: decision
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
        fetch(fetchURL, requestOptions)
            .then(response => response.json())
            .then(response => {
                console.log(response)
            }).then(response => props.fetchNotificationsOnUserID())   
            .catch(error => {
                props.setErrorHasOccured(true)
            })
    }

    /*
    if(props.isLoggedIn === false){
        return (
            <div className="TopBarMainDiv">
                <button id='LoginButton' onClick={loginButtonClickHandler}>Log in</button>
            </div>
        )
    }else{
        return (
            <div className="TopBarMainDiv">
                <div id='NavigateToHomePage'>
                    <button onClick={navigateToHomePage}>
                        Home
                    </button>
                </div>
                <div id='AdvertiseButtonDiv'>
                    <button onClick={navigateToCreateAdvertisementPage}>Advertise</button>
                </div>
                <UserAccountComponent toggleDropDownMenu={toggleDropDownMenu}/>
                {
                    showDropDownMenu &&
                    <div id='DropDownMenu'>
                        <div>                        
                            My Account                          
                        </div>
                        <div onClick={logoutClickHandler}>
                            Log out
                        </div>                     
                    </div>
                }
     
             
            </div>
        )
    }
    */
   if(props.isLoggedIn){
    return(
        <Navbar fluid rounded className={`${NavbarBackgroundColor} h-14`}>
        <Navbar.Brand href="/">
            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Park In Peace</span>
        </Navbar.Brand>
        <div className="flex md:order-2 items-center">
            <div className='mr-4'>
            <Dropdown 
            disabled={notifications === undefined || notifications.length===0}
            arrowIcon={false}
                inline
                label={
                    <div>
                        {
                            getNotificationIconHTML()
                        }
                    </div>
            }
            >    
            <Dropdown.Header>
            <span className="block truncate text-sm font-medium">{"Pending Bookings"}</span>
            </Dropdown.Header> 
            
            {
                notifications!==undefined &&
                notifications.map((eachNotification, notificationIndex) => (
                    <Dropdown.Item key={notificationIndex} className='cursor-default'>
                        {StandardFunctions.simplifyAddress(eachNotification['space']['fldAddress'].toString())}
                        <br/>
                        {formatDate(eachNotification['booking']['fldReservationStart']) + " - " + formatDate(eachNotification['booking']['fldReservationEnd'])}
                        <div onClick={() => ConfirmBookingWithDecision(eachNotification, true)}>
                            <svg className="w-6 h-6 text-gray-800 dark:text-white m-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 12">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5.917 5.724 10.5 15 1.5"/>
                            </svg>
                        </div>
                        
                        <div onClick={() => ConfirmBookingWithDecision(eachNotification, false)}>
                            <svg className="w-6 h-6 text-gray-800 dark:text-white m-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                        </div>
                    </Dropdown.Item>
                ))
            }          
            </Dropdown>
            </div>
            <Dropdown
            arrowIcon={false}
            inline
            label={
                <Avatar alt="User settings" img="https://flowbite.com/docs/images/people/profile-picture-5.jpg" rounded />
            }
            >
            <Dropdown.Header>
                <span className="block truncate text-sm font-medium">{getLoggedInUsersEmail()}</span>
            </Dropdown.Header>
            <Dropdown.Item href='/UserDetailsPage/AccountSelected'>Account</Dropdown.Item>
            <Dropdown.Item href='/UserDetailsPage/BookingsSelected'>Bookings</Dropdown.Item>
            <Dropdown.Item href='/UserDetailsPage/AdvertisementsSelected'>Advertisements</Dropdown.Item>
            <Dropdown.Divider />
            <Dropdown.Item onClick={logoutClickHandler}>Sign out</Dropdown.Item>
            </Dropdown>
            <Navbar.Toggle />
        </div>
        <Navbar.Collapse>
            <Navbar.Link href='/' className={props.pageName==="HomePage point"?"text-blue-700 cursor-pointer":"cursor-pointer"}>
            Home
            </Navbar.Link>
            <Navbar.Link href="/CreateAdvertisementPage" className={props.pageName==="CreateAdvertisementPage"?"text-blue-700":""}>
            Advertise
            </Navbar.Link>
            <Navbar.Link href="/">About</Navbar.Link>
            <Navbar.Link href="/">Contact</Navbar.Link>
        </Navbar.Collapse>
        </Navbar>
    )

   }else{
    return (
        <Navbar fluid rounded className={`${NavbarBackgroundColor} h-12`}>
            <Navbar.Brand href="/">
                <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">Park In Peace</span>
            </Navbar.Brand>
            <div className="flex md:order-2">
                <button onClick={loginButtonClickHandler}>Log in</button>
            </div>
            <Navbar.Collapse>
                <Navbar.Link href="/" active onClick={navigateToHomePage}>
                Home
                </Navbar.Link>
                
                <Navbar.Link href="/">About</Navbar.Link>
                <Navbar.Link href="/">Contact</Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
       )
   }
   
  
    
}

export default TopBar