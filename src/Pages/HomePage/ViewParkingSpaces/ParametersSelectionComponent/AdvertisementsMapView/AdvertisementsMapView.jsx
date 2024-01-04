import "./AdvertisementsMapView.css"
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import { useEffect } from "react";
import { baseURL, defaultMapZoomLevel } from "../../../../../Constants";
import { useNavigate } from "react-router-dom";

function AdvertisementsMapView(props){
    const navigate = useNavigate();

    useEffect(()=> {
        if(props.searchedAdvertisementsResults.length === 0) return;      
    }, [props.searchedCityResults])

    function navigateToSingleAdvertisementDetailsPage(eachLocation){
        // Check if logged in.
        if(!props.isLoggedIn){
            props.openLoginPopup()
            return;
        }
        navigate(`/SingleAdvertisementDetailsPage/${eachLocation['tblSpace']['fldSpaceId']}`)
    }   


    return (
        <div id="AdvertisementsMapViewMainDiv">
            <MapContainer 
                center={[props.searchedCityResults['latitude'], props.searchedCityResults['longitude']]} 
                zoom={defaultMapZoomLevel} 
                style={{ height: '100%', width: '100%' }}
                key={`${props.searchedCityResults['latitude']}-${props.searchedCityResults['longitude']}`} // Unique key based on userLocation
                scrollWheelZoom={false}
                >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {
                    props.searchedAdvertisementsResults.map((eachLocation, locationIndex) =>(
                        <Marker key={locationIndex} position={[eachLocation['tblSpace']['fldLatitude'], eachLocation['tblSpace']['fldLongitude']]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})}>
                            <Popup>
                                <div className="cursor-pointer" onClick={() => navigateToSingleAdvertisementDetailsPage(eachLocation)}>
                                    <img src={`${baseURL}/api/Image/getImageFileOnID/${eachLocation['fldSpaceImagesIds'][0]}`} className="MarkerPopUpImage"/>
                                </div>                                
                                <label>{`${eachLocation['tblSpace']['fldPrice']} DKK/Night`}</label>
                            </Popup>
                        </Marker>
                    ))
                }
            </MapContainer>
        </div>
    )
}

export default AdvertisementsMapView