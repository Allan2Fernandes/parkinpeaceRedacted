import { useEffect } from "react"
import "./AdvertisementsListView.css"
import SingleAdvertisementComponent from "./SingleAdvertisementComponent/SingleAdvertisementComponent"

function AdvertisementsListView(props){

    useEffect(() => {
    }, [props.searchedAdvertisementsResults])

    return (
        <div id="AdvertisementsListViewMainDiv">
            {
                props.searchedAdvertisementsResults.map((eachSearchedAdvertisementResult, searchedAdvertisementResultIndex) =>(
                    <SingleAdvertisementComponent
                        key={searchedAdvertisementResultIndex}
                        eachSearchedAdvertisementResult={eachSearchedAdvertisementResult}      
                        openLoginPopup={props.openLoginPopup}
                        closeLoginPopup={props.closeLoginPopup}  
                        isLoggedIn={props.isLoggedIn}                
                    />
                ))
            }
        </div>
    )
}

export default AdvertisementsListView