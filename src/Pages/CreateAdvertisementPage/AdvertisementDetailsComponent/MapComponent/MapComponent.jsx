import "./MapComponent.css"
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import markerIconPng from "leaflet/dist/images/marker-icon.png"
import {Icon} from 'leaflet'
import { useEffect } from "react";
import { defaultMapZoomLevel } from "../../../../Constants";

function MapComponent(props){

    useEffect(() =>{
    }, [props])

    return (
        <div id="MapComponentMainDiv">       
            <MapContainer 
                center={[props.selectedAddress['latitude'], props.selectedAddress['longitude']]} 
                zoom={defaultMapZoomLevel} 
                style={{ height: '100%', width: '100%' }}
                key={`${props.selectedAddress['latitude']}-${props.selectedAddress['longitude']}`} // Unique key based on userLocation
                scrollWheelZoom={false}
                >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[props.selectedAddress['latitude'], props.selectedAddress['longitude']]} icon={new Icon({iconUrl: markerIconPng, iconSize: [25, 41], iconAnchor: [12, 41]})} />
            </MapContainer>
        </div>
    )
}

export default MapComponent