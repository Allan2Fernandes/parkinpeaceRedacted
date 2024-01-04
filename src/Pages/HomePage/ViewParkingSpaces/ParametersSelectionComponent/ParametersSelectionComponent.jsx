import "./ParametersSelectionComponent.css"
import 'react-datepicker/dist/react-datepicker.css'; // Import the default styles
import { Checkbox, Datepicker, Label, TextInput} from "flowbite-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

function ParametersSelectionComponent(props){
    const tabIsActive = "inline-block p-4 text-blue-600 border-b-2 border-blue-600 rounded-t-lg active dark:text-blue-500 dark:border-blue-500";
    const tabIsInactive = "inline-block p-4 border-b-2 border-transparent rounded-t-lg hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300";

    function handleCHangeDimensionInput(event, dimensionName){
        if(dimensionName === "length"){
            props.setMinimumDimensions({height: props.minimumDimensions['height'], width: props.minimumDimensions['width'], length: event.target.value})
        }else if(dimensionName === "width"){
            props.setMinimumDimensions({height: props.minimumDimensions['height'], width: event.target.value, length: props.minimumDimensions['length']})
        }else if(dimensionName === "height"){
            props.setMinimumDimensions({height: event.target.value, width: props.minimumDimensions['width'], length: props.minimumDimensions['length']})
        }
    }

    if(false){
        return (
            <div id="ParametersSelectionMainDiv">
                <div id="DisplayButtonsDiv">
                    <button className={props.listDisplayMethodSelected?"SelectedDisplayMethod":"NotSelectedDisplayMethod"} onClick={() => props.setListDisplayMethodSelected(true)}>List</button>
                    <button className={!props.listDisplayMethodSelected?"SelectedDisplayMethod":"NotSelectedDisplayMethod"} onClick={() => props.setListDisplayMethodSelected(false)}>Map</button>
                </div>
                <h4>Search By City</h4>
               <input placeholder="Enter a city" value={props.searchedCityName} onChange={(event)=> props.handleOnChangeCityInput(event)} onKeyUp={props.searchForAddress}/>
               <h4>Filter by Dates</h4>
               {/*
                <DatePicker
                    id="StartDatePicker"
                    selected={props.selectedStartDate}
                    onChange={date => props.setSelectedStartDate(date)}
                    isClearable
                    placeholderText="Select a Start date"
                />
                <DatePicker
                    id="EndDatePicker"
                    selected={props.selectedEndDate}
                    onChange={date => props.setSelectedEndDate(date)}
                    isClearable
                    placeholderText="Select an End date"
                />               
               */}              
                <div>
                    <h4>
                        Minimum Dimensions
                    </h4>
                    <input type="text" placeholder="Length/m" onChange={(event) => handleCHangeDimensionInput(event, "length")} value={props.minimumDimensions['length']}/>
                    <input type="text" placeholder="Width/m" onChange={(event) => handleCHangeDimensionInput(event, "width")} value={props.minimumDimensions['width']}/>
                    <input type="text" placeholder="Height/m" onChange={(event) => handleCHangeDimensionInput(event, "height")} value={props.minimumDimensions['height']}/>
                </div>
                <div>
                    <h4>
                        Price Range                
                    </h4>
                    <input type="number" placeholder="Max Price DKK/Night" value={props.maxPriceThreshold} onChange={(event) => props.setMaxPriceThreshold(event.target.value)}/>
                </div>
            </div>
        )
    }else{
        return (
            <div id="ParametersSelectionMainDiv">   
                <div className="text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:text-gray-400 dark:border-gray-700 w-full">
                    <ul className="flex flex-wrap -mb-px">
                        <li className="flex-1 me-2">
                            <a href="#" className={props.listDisplayMethodSelected?tabIsActive:tabIsInactive} onClick={() => props.setListDisplayMethodSelected(true)}>List</a>
                        </li>
                        <li className="flex-1 me-2">
                            <a href="#" className={!props.listDisplayMethodSelected?tabIsActive:tabIsInactive} aria-current="page" onClick={() => props.setListDisplayMethodSelected(false)}>Map</a>
                        </li>
                    
                    </ul>
                </div>    
                <div>
                    <div className="flex max-w-md flex-col gap-4 w-full ml-4">
                        <Label className="m-1" htmlFor="CityInput">Enter an address</Label>
                        {/*
                        <TextInput className="w-2/3" type="text" id="CityInput" placeholder="Eg. Copenhagen" onChange={(event)=> props.handleOnChangeCityInput(event)} value={props.searchedCityName} onKeyUp={props.searchForAddress}/>
                        */}
                        <div className="relative w-4/5">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
                                </svg>
                            </div>
                            <input type="search" id="default-search" className="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Eg. Copenhagen" required onChange={(event)=> props.handleOnChangeCityInput(event)} value={props.searchedCityName}/>
                            <button 
                                type="submit" 
                                className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                onClick={props.searchForAddress}
                            >
                                Search
                            </button>
                        </div>
                        
                        <Label className="m-1" htmlFor="CostInput">Max Cost/night</Label>
                        <TextInput className="w-4/5" type="text" id="CostInput" placeholder="Eg. 40 kr." value={props.maxPriceThreshold} onChange={(event) => props.setMaxPriceThreshold(event.target.value)} onKeyUp={props.searchForAddress}/>                        
                        <Datepicker className="w-4/5" placeholder="Select a Start Date" autoHide={true} onSelectedDateChanged={(date) => props.setSelectedStartDate(date)}/>
                        <Datepicker className="w-4/5" placeholder="Select an End Date" autoHide={true} onSelectedDateChanged={(date) => props.setSelectedEndDate(date)}/>
                        <TextInput className="w-4/5" type="number" id="LengthInput" placeholder="Length" onChange={(event) => handleCHangeDimensionInput(event, "length")} value={props.minimumDimensions['length']}></TextInput>
                        <TextInput className="w-4/5" type="number" id="WidthInput" placeholder="Width" onChange={(event) => handleCHangeDimensionInput(event, "width")} value={props.minimumDimensions['width']}></TextInput>
                        <TextInput className="w-4/5" type="number" id="HeightInput" placeholder="Height" onChange={(event) => handleCHangeDimensionInput(event, "height")} value={props.minimumDimensions['height']}></TextInput>
                        <div className="flex items-center gap-2">
                            <Checkbox id="SewageDisposalFilter" checked={props.sewageDisposalRequired} onChange={() => props.setSewageDisposalRequired(!props.sewageDisposalRequired)}/>
                            <Label htmlFor="SewageDisposalFilter">Sewage Disposal</Label>
                        </div>
                        <div className="flex items-center gap-2">
                            <Checkbox id="ElectricityFilter" checked={props.electricityRequired} onChange={() => props.setElectricityRequired(!props.electricityRequired)}/>
                            <Label htmlFor="ElectricityFilter">Electricity</Label>
                        </div>
                    </div>
                </div>
            </div>
        )
    }


}

export default ParametersSelectionComponent