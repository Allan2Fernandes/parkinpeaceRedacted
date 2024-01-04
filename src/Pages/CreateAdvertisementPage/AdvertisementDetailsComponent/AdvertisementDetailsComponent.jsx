import { useEffect, useState } from "react"
import "./AdvertisementDetailsComponent.css"
import { getAddressDetailsURL } from "../../../Constants"
import AddressSearchResultsComponent from "./AddressSearchResultsComponent/AddressSearchResultsComponent"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faQuestionCircle, faUpload } from "@fortawesome/free-solid-svg-icons"
import { Button, Checkbox, Label, Spinner, Table, TextInput, Tooltip } from "flowbite-react"
import MapComponent from "./MapComponent/MapComponent"
import secureLocalStorage from "react-secure-storage"

function AdvertisementDetailsComponent(props){
    const [searchedAddress, setSearchedAddress] = useState("")
    const [listOfPossibleAddresses, setListOfPossibleAddresses] = useState([])


    useEffect(() => {
    }, [props.selectedAddress])
    
    async function searchForAddress(event){            
        if(event.key === "Enter"){

            var fetchURL = `${getAddressDetailsURL}${searchedAddress}`

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
                    setListOfPossibleAddresses(response)
                }).catch(error => {
                    secureLocalStorage.clear(); 
                    props.setErrorHasOccured(true)
                })
        }
    }

    function selectAddress(event, address){
        props.setSelectedAddress({
            name: address['display_name'],
            latitude: address['lat'],
            longitude: address['lon']
        }) 
    }

    function handleInputAddressChange(event){
        event.preventDefault()
        setSearchedAddress(event.target.value)
    }

    function handleChangePrice(event){
        props.setPrice(event.target.value)
    }

    function handledimensionChanges(event, dimensionName){
        if(dimensionName === "length"){
            props.setParkingSpaceDimensions({height: props.parkingSpaceDimensions['height'], width: props.parkingSpaceDimensions['width'], length: event.target.value})
        }else if(dimensionName === "width"){
            props.setParkingSpaceDimensions({height: props.parkingSpaceDimensions['height'], width: event.target.value, length: props.parkingSpaceDimensions['length']})
        }else if(dimensionName === "height"){
            props.setParkingSpaceDimensions({height: event.target.value, width: props.parkingSpaceDimensions['width'], length: props.parkingSpaceDimensions['length']})
        }
    }

    function handlecancellationDetailsChange(event){
        // Depending on which field is changing, set the appropriate state
        if(event.target.id === "CancellationDuration"){
            props.setCancellationDetails({duration: event.target.value, penalty: props.cancellationDetails['penalty']})
        }else if(event.target.id ==="CancellationPenalty"){
            props.setCancellationDetails({duration: props.cancellationDetails['duration'], penalty: event.target.value})
        }
    }

    function handleChangeFileInput(event){
        // TODO REJECT IMAGES THAT ARE NOT PNG OR JPEG
        var image_file = event.target.files[0]
        if(image_file === undefined){
            return;
        }
        console.log(image_file.name)
        var imageName = image_file.name
        // Clear the input value to allow selecting the same file again
        event.target.value = '';
        const reader = new FileReader();
        reader.onloadend = () => {
            var b64Image = reader.result
            // Check if it is png or jpg
            var encoding = b64Image.split(",")[1]
            if(encoding[0] === "/" || encoding[0] === "i"){
                var newListOfParkingSpaceImages = structuredClone(props.listOfParkingSpaceImages)
                newListOfParkingSpaceImages.push({imageName: imageName, encoding: b64Image})
                props.setListOfParkingSpaceImages(newListOfParkingSpaceImages)
            }else{
                console.log("Invalid file format")
            }
            
        };
        reader.readAsDataURL(image_file);
    }

    function handleClickRemoveImageButton(event, imageIndex){
        //setListOfParkingSpaceImages
        var newListOfParkingSpaceImages = structuredClone(props.listOfParkingSpaceImages)
        newListOfParkingSpaceImages.splice(imageIndex, 1)
        props.setListOfParkingSpaceImages(newListOfParkingSpaceImages)

    }
    if(false){
        return (
            <div id="AdvertisementDetailsComponetMainDiv">
                <h1>Advertise Parking Space</h1>
                <input placeholder="Address or zip code" value={searchedAddress} onKeyUp={(event) => searchForAddress(event)} type="text" onChange={(event) => handleInputAddressChange(event)}/>
                <AddressSearchResultsComponent listOfPossibleAddresses={listOfPossibleAddresses} selectAddress={selectAddress}/>
                <div>
                    <h4>Selected Address</h4>
                    <label>{`${props.selectedAddress['name']}`}</label>
                </div>
                <div>
                    <h4>Set Price</h4>
                    <input type="number" placeholder="DKK/Night" onChange={handleChangePrice} value={props.price}/>
                </div>
                <div>
                    <h4>Max Dimensions (If Applicable)</h4>
                    <input type="text" placeholder="Length" value={props.parkingSpaceDimensions['length']} onChange={(event) => handledimensionChanges(event, "length")}/>
                    <input type="text" placeholder="Width" value={props.parkingSpaceDimensions['width']} onChange={(event) => handledimensionChanges(event, "width")}/>
                    <input type="text" placeholder="Height" value={props.parkingSpaceDimensions['height']} onChange={(event) => handledimensionChanges(event, "height")}/>
                </div>
                <div>
                    <h4>Images of Space</h4>
                </div>
                <div>
                    <input id={"UploadImageToDBFileInput"}
                        type={"file"}
                        onChange={(event) => handleChangeFileInput(event)}
                        style={{display:"none"}}
                    />
                    <label id={"UploadImageToDBButton"}
                        htmlFor={"UploadImageToDBFileInput"}>
                        <FontAwesomeIcon id={"UploadIcon"} icon={faUpload}/>
                        {"Upload image to DB"}
                    </label>
                </div>
                <div id="UploadedImagesDiv">
                    {props.listOfParkingSpaceImages.map((eachImage, imageIndex) => (
                        <div className="UploadedImageContainerDiv" key={imageIndex}>
                        <div className="ImageContainer">
                            <button
                            className="RemoveUploadedImageButton"
                            onClick={(event) => handleClickRemoveImageButton(event, imageIndex)}
                            >
                            x
                            </button>
                            <img className="ImageElement" src={`${eachImage}`} alt="Base64 Image" />
                        </div>
                        </div>
                    ))}
                </div>
                <button id="UploadImagesButton" disabled={props.listOfParkingSpaceImages.length===0} onClick={props.createAdvertisement}>Create Advert</button>
                  
            </div>
        )
    }else{
        return (
            <div id="AdvertisementDetailsComponentMainDiv">
                <div id="DetailsMapComponent">
                    <div id="AdvertisementDetailsFormDiv">
                        <form className="flex max-w-md flex-col gap-4 m-4">
                            <div>
                                <div className="mb-2 block">
                                <Label htmlFor="AddressInput" value="Enter an address" />
                                </div>
                                <TextInput id="AddressInput" type="text" placeholder="Eg. Østergade 7, 2th Sønderborg 6400" required value={searchedAddress} onKeyUp={(event) => searchForAddress(event)} onChange={(event) => handleInputAddressChange(event)}/>
                            </div>
                            <AddressSearchResultsComponent listOfPossibleAddresses={listOfPossibleAddresses} selectAddress={selectAddress} selectedAddress={props.selectedAddress}/>                            
                            <div>
                                <div className="mb-2 block">
                                <Label htmlFor="PriceInput" value="Set a price DKK/day" />
                                </div>
                                <TextInput id="PriceInput" type="number" onChange={handleChangePrice} value={props.price}/>
                            </div>
                            <div>
                                <div className="mb-2 block">
                                <Tooltip content={"Set a max length to avoid vehicles that are too long to fit in this parking space"}>
                                    <Label htmlFor="LengthInput" value="(Optional) Max. Length" />
                                    {" "}
                                    <FontAwesomeIcon icon={faQuestionCircle}/>    
                                </Tooltip>
                                </div>
                                <TextInput id="LengthInput" type="number" value={props.parkingSpaceDimensions['length']} onChange={(event) => handledimensionChanges(event, "length")} />
                            </div>
                            <div>
                                <div className="mb-2 block">                                
                                <Tooltip content={"Set a max width to avoid vehicles that are too wide to fit in this parking space"}>
                                    <Label htmlFor="WidthInput" value="(Optional) Max. Width" />
                                    {" "}
                                    <FontAwesomeIcon icon={faQuestionCircle}/>                                    
                                </Tooltip>                                
                                
                                </div>
                                <TextInput id="WidthInput" type="number" value={props.parkingSpaceDimensions['width']} onChange={(event) => handledimensionChanges(event, "width")}/>
                            </div>
                            <div>
                                <div className="mb-2 block">
                                <Tooltip content={"Set a max height to avoid vehicles that are too tall to fit in this parking space"}>
                                    <Label htmlFor="HeightInput" value="(Optional) Max. Height" />
                                    {" "}
                                    <FontAwesomeIcon icon={faQuestionCircle}/>    
                                </Tooltip>
                                </div>
                                <TextInput id="heightInput" type="number" value={props.parkingSpaceDimensions['height']} onChange={(event) => handledimensionChanges(event, "height")}/>
                            </div>
                            <div>
                                <div className="mb-2 block">
                                <Tooltip content={"Set the number of minimum number of weeks before the reservation start date of a booking that there is no cancellation penalty."}>
                                    <Label htmlFor="CancellationDuration" value="Cancellation Policy" />
                                    {" "}
                                    <FontAwesomeIcon icon={faQuestionCircle}/>    
                                </Tooltip>
                                </div>
                                <TextInput id="CancellationDuration" type="number" value={props.cancellationDetails['duration']} onChange={handlecancellationDetailsChange}/>
                            </div>
                            <div>
                                <div className="mb-2 block">
                                <Tooltip content={"If a reservation is cancelled too close to the reservation start date (The value set above) a percentage of the deposity is witheld as a penalty. Set the penalty value here (as a percentage of the deposit)"}>
                                    <Label htmlFor="CancellationPenalty" value="Cancellation Penalty" />
                                    {" "}
                                    <FontAwesomeIcon icon={faQuestionCircle}/>    
                                </Tooltip>
                                </div>
                                <TextInput id="CancellationPenalty" type="number" value={props.cancellationDetails['penalty']} onChange={handlecancellationDetailsChange}/>
                            </div>
                            <div className="flex items-center gap-2 mb-2">                                
                                <Checkbox id="SewageDisposal" checked={props.sewageDisposalAvailable} onChange={()=> props.setSewageDisposalAvailable(!props.sewageDisposalAvailable)}/>
                                <Tooltip content={"Check this option if sewage disposal is possible here"}>
                                    {" "}
                                    <Label htmlFor="SewageDisposal">Sewage Disposal</Label>
                                </Tooltip>                               
                            </div>
                            <div className="flex items-center gap-2 mb-2">                                
                                <Checkbox id="ElectricityAvailable" checked={props.electricityAvailable} onChange={() => props.setElectricityAvailable(!props.electricityAvailable)}/>
                                <Tooltip content={"Check this option if power can be delivered to the vehicle"}> {/* Ask Gerhard what type of power. Is this for charging the vehicle or for leisure activities inside the autocamper */}
                                    {" "}
                                    <Label htmlFor="ElectricityAvailable">Electricity available</Label>
                                </Tooltip>                               
                            </div>                            
                            <div className="mb-2 block">
                                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" htmlFor="file_input">Upload file</label>
                                <input 
                                    className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" 
                                    aria-describedby="file_input_help" 
                                    id="file_input" 
                                    type="file"  
                                    onChange={(event) => handleChangeFileInput(event)}
                                />
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-300" id="file_input_help">PNG & JPGs only</p>                                
                            </div>
                            <div className="mb-2 block">
                                <Table>
                                    <Table.Body>
                                        {
                                            props.listOfParkingSpaceImages.map((eachImageSet, eachImageSetIndex) => (
                                                <Table.Row key={eachImageSetIndex}>
                                                    <Table.Cell>{eachImageSet['imageName']}</Table.Cell>
                                                    <Table.Cell>
                                                        <Button onClick={(event) => handleClickRemoveImageButton(event, eachImageSetIndex)}>X</Button>
                                                    </Table.Cell>
                                                </Table.Row>                                                
                                            ))
                                        }
                                    </Table.Body>
                                </Table>
                            </div>
                            <Button disabled={props.listOfParkingSpaceImages.length===0 || props.spaceIsSaving || searchedAddress === "" || (props.price === undefined || props.price === null || props.price <= 0) || props.cancellationDetails['duration'] <= 0 || props.cancellationDetails['penalty'] <= 0 || props.selectedAddress['name'] === ""} onClick={() => {
                                props.setOpenModal(true)
                                props.createBookingRef.current =  async () => {
                                    await props.createAdvertisement()
                                    props.setOpenModal(false)
                                }
                            }}>
                                {
                                    props.spaceIsSaving?<Spinner aria-label="Default status example" />:"Confirm"
                                }
                            </Button>
                        </form>
                    </div>
                    <div id="MapComponentDiv">     
                        <MapComponent
                            selectedAddress={props.selectedAddress}
                        />          
                    </div>
                </div>
                
            </div>
        )
    }
    
}

export default AdvertisementDetailsComponent