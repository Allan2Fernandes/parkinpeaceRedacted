import "./SingleAdvertisementComponent.css"
import { baseURL } from "../../../../../../Constants"
import { useNavigate } from "react-router-dom";
import { Card } from "flowbite-react";

function SingleAdvertisementComponent(props){
    const navigate = useNavigate();
    
    function simplifyAddress(address){
        // Split the address by commas
        const parts = address.split(',').map(part => part.trim());

        // Define the indices of the essential address components
        const essentialIndices = [0, 1, 2, 3]; // Modify this based on your needs

        // Create a simplified address with essential components
        const simplifiedAddress = essentialIndices.map(index => parts[index]).join(', ');

        return simplifiedAddress;
    }

    function navigateToSingleAdvertisementDetailsPage(){
        // Check if logged in.
        if(!props.isLoggedIn){
            props.openLoginPopup()
            return;
        }
        navigate(`/SingleAdvertisementDetailsPage/${props.eachSearchedAdvertisementResult['tblSpace']['fldSpaceId']}`)
        /*
        navigate("/SingleAdvertisementDetailsPage", {
            state:{
                SpaceDetails: props.eachSearchedAdvertisementResult
            }
        })
        */
    }
/*
    return (
        <div id="SingleAdvertisementComponentMainDiv" onClick={(event) => navigateToSingleAdvertisementDetailsPage(props.eachSearchedAdvertisementResult)}>
            <div className="image-container" style={{ backgroundImage: `url(${baseURL}/api/Image/getImageFileOnID/${props.eachSearchedAdvertisementResult['fldSpaceImagesIds'][0]})` }}>                
            </div>
            <div id="AdvertisementDetails">
                <label id="AddressLabel">{simplifyAddress(props.eachSearchedAdvertisementResult['tblSpace']['fldAddress'])}</label>      
                <div id="PriceLabelContainer">
                    <label id="PriceLabel">{`${props.eachSearchedAdvertisementResult['tblSpace']['fldPrice']} DKK`}</label>  
                </div>                        
            </div>
            
        </div>
      
    )
*/
        return(
            <Card
                className="max-w-sm cursor-pointer m-8"
                imgAlt="Meaningful alt text for an image that is not purely decorative"
                imgSrc={`${baseURL}/api/Image/getImageFileOnID/${props.eachSearchedAdvertisementResult['fldSpaceImagesIds'][0]}`}
                onClick={(event) => navigateToSingleAdvertisementDetailsPage(props.eachSearchedAdvertisementResult)}
            >
                <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {simplifyAddress(props.eachSearchedAdvertisementResult['tblSpace']['fldAddress'])}
                </h5>
                <p className="font-normal text-gray-700 dark:text-gray-400">
                    {`${props.eachSearchedAdvertisementResult['tblSpace']['fldPrice']} DKK`}
                </p>
            </Card>
        )

}

export default SingleAdvertisementComponent