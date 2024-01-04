import { getAddressDetailsURL } from "../../../Constants";
import AdvertisementsListView from "./ParametersSelectionComponent/AdvertisementsListView/AdvertisementsListView";
import AdvertisementsMapView from "./ParametersSelectionComponent/AdvertisementsMapView/AdvertisementsMapView";
import ParametersSelectionComponent from "./ParametersSelectionComponent/ParametersSelectionComponent"
import "./ViewParkingSpaces.css"
import { useEffect, useState } from "react";
import { baseURL } from "../../../Constants";
import secureLocalStorage from "react-secure-storage";
import OpenStreetMapAdapter from "../../../Adapters/CoordinatesAdapter/OpenStreetMapAdapter";

function ViewParkingSpaces(props){
    const [searchedCityName, setSearchedCityName] = useState("");
    const [searchedCityResults, setSearchedCityResults] = useState({latitude: 54.9060608, longitude: 9.8041856}) // Default coordinates of Sønderborg
    const [searchedAdvertisementsResults, setSearchedAdvertisementsResults] = useState([])
    const [selectedStartDate, setSelectedStartDate] = useState(null);
    const [selectedEndDate, setSelectedEndDate] = useState(null);
    const [listDisplayMethodSelected, setListDisplayMethodSelected] = useState(false)
    const [minimumDimensions, setMinimumDimensions] = useState({length: "", width: "", height: ""})
    const [maxPriceThreshold, setMaxPriceThreshold] = useState(0)
    const [sewageDisposalRequired, setSewageDisposalRequired] = useState(false)
    const [electricityRequired, setElectricityRequired] = useState(false)


    useEffect(() => {
       searchAdvertisementsInArea()
    }, [searchedCityResults])

    async function searchAdvertisementsInArea(){
        var fetchURL = `${baseURL}/api/Space/GetAdvertisementsInArea`
        var requestBody = {
            fldLatitude: searchedCityResults['latitude'],
            fldLongitude: searchedCityResults['longitude'],
            fldPrice: maxPriceThreshold===""?0:maxPriceThreshold
        }
        var requestOptions = {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*'
            },
            body: JSON.stringify(requestBody)
        }
        fetch(fetchURL, requestOptions)
            .then(response => {               
                return response.json()
            })
            .then(response => {
                setSearchedAdvertisementsResults(response)
            }).catch(error => {
                secureLocalStorage.clear(); 
                props.setErrorHasOccured(true)
            })
    }

    async function handleOnChangeCityInput(event){
        setSearchedCityName(event.target.value)
    }

    async function searchForAddress(){     
        /*  
        var fetchURL = `${getAddressDetailsURL}${searchedCityName}`

        var requestOptions = {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Headers': '*'
            },
        }
        await fetch(fetchURL, requestOptions)
            .then(response => response.json())
            .then(response => {
                if(response.length === 0) return;
                setSearchedCityResults({latitude: response[0]['lat'], longitude: response[0]['lon']})
            }).catch(error => {
                secureLocalStorage.clear(); 
                props.setErrorHasOccured(true)
            })
        */
       var openStreetMapAdapter = new OpenStreetMapAdapter();
       var response = await openStreetMapAdapter.getAddressDetails(searchedCityName).catch(error => {
        secureLocalStorage.clear();
        props.setErrorHasOccured(true);
       });
       setSearchedCityResults({latitude: response[0]['lat'], longitude: response[0]['lon']})
    }

    function filterAdvertisementResults(){
        // Filter them by reservation dates. Check for current bookings
        var listOfSpaceIDsToFilterOut = new Set()
        var filteredListOfAdvertisements = searchedAdvertisementsResults

        searchedAdvertisementsResults.forEach(advertResult => {
            advertResult['bookings'].forEach(booking => {
                var bookingStartDate = new Date(booking['fldReservationStart'])
                var bookingEndDate = new Date(booking['fldReservationEnd'])               
                // Do not filter out the space if the booking was cancelled
                if(booking['fldCancellation'] !== null || !booking['fldIsAccepted']){
                    return;
                }

                 // Filter out a booking if the booking start date is over the selected start date AND the booking start date is before selected end date
                // Filter out if the booking end date is over the selected start date and the booking end date is before the selected end date
                if((bookingStartDate >= selectedStartDate && bookingStartDate <= selectedEndDate) || (bookingEndDate <= selectedEndDate && selectedStartDate <= bookingEndDate) || (selectedStartDate > bookingStartDate && selectedEndDate < bookingEndDate)){
                    listOfSpaceIDsToFilterOut.add(advertResult['tblSpace']['fldSpaceId'])
                }
            })

            // Filter them by minimum dimensions

            // If the selected dimension filter is null, don't filter by that dimension
            // If the dimension of the space is null, ignore the filter.            
            if(minimumDimensions.length !== "" && advertResult['tblSpace']['fldLength'] !== null){
                // Filter it out if the space length is less than the specified filter length
                if(advertResult['tblSpace']['fldLength'] < minimumDimensions.length){
                    console.log(minimumDimensions.length !== "", advertResult['tblSpace']['fldLength'] !== null)
                    listOfSpaceIDsToFilterOut.add(advertResult['tblSpace']['fldSpaceId'])
                }
            }
            if(minimumDimensions.width !== "" && advertResult['tblSpace']['fldWidth'] !== null){
                // Filter it out if the space length is less than the specified filter length
                if(advertResult['tblSpace']['fldWidth'] < minimumDimensions.width){
                    listOfSpaceIDsToFilterOut.add(advertResult['tblSpace']['fldSpaceId'])
                }
            }
            if(minimumDimensions.height !== "" && advertResult['tblSpace']['fldHeight'] !== null){
                // Filter it out if the space length is less than the specified filter length
                if(advertResult['tblSpace']['fldHeight'] < minimumDimensions.height){
                    listOfSpaceIDsToFilterOut.add(advertResult['tblSpace']['fldSpaceId'])
                }
            }

            // If sewage disposal is checked, ONLY THEN filter on sewage disposal
            if(sewageDisposalRequired){
                if(!advertResult['tblSpace']['fldSewageDisposal']){
                    listOfSpaceIDsToFilterOut.add(advertResult['tblSpace']['fldSpaceId'])
                }
            }

            if(electricityRequired){
                if(!advertResult['tblSpace']['fldElectricity']){
                    listOfSpaceIDsToFilterOut.add(advertResult['tblSpace']['fldSpaceId'])
                }
            }
           
        });
        filteredListOfAdvertisements = filteredListOfAdvertisements.filter(x => !listOfSpaceIDsToFilterOut.has(x['tblSpace']['fldSpaceId'])) 
        return filteredListOfAdvertisements
    }


    return (
        <div id="ParkingSpacesMainDiv">
            <ParametersSelectionComponent
                searchedCityName={searchedCityName}
                setSearchedCityName={setSearchedCityName}
                selectedStartDate={selectedStartDate}
                setSelectedStartDate={setSelectedStartDate}
                selectedEndDate={selectedEndDate}
                setSelectedEndDate={setSelectedEndDate}
                listDisplayMethodSelected={listDisplayMethodSelected}
                setListDisplayMethodSelected={setListDisplayMethodSelected}
                minimumDimensions={minimumDimensions}
                setMinimumDimensions={setMinimumDimensions}
                handleOnChangeCityInput={handleOnChangeCityInput}
                searchForAddress={searchForAddress}
                maxPriceThreshold={maxPriceThreshold}
                setMaxPriceThreshold={setMaxPriceThreshold}
                sewageDisposalRequired={sewageDisposalRequired}
                setSewageDisposalRequired={setSewageDisposalRequired}
                electricityRequired={electricityRequired}
                setElectricityRequired={setElectricityRequired}
            />
            {
                listDisplayMethodSelected?
                <AdvertisementsListView
                    searchedCityResults={searchedCityResults}
                    searchedAdvertisementsResults={filterAdvertisementResults()}
                    openLoginPopup={props.openLoginPopup}
                    closeLoginPopup={props.closeLoginPopup}
                    isLoggedIn={props.isLoggedIn}
                />
                :
                <AdvertisementsMapView
                    searchedCityResults={searchedCityResults}
                    searchedAdvertisementsResults={filterAdvertisementResults()}
                    openLoginPopup={props.openLoginPopup}
                    closeLoginPopup={props.closeLoginPopup}
                    isLoggedIn={props.isLoggedIn}
                />
            }
        </div>
    )

   

    
}

export default ViewParkingSpaces