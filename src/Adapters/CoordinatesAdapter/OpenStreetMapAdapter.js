import { getAddressDetailsURL } from "../../Constants";

class OpenStreetMapAdapter {
    constructor(baseURL = getAddressDetailsURL) {
        // The external API is the adaptee
        this.getAddressDetailsURL = baseURL;
    }
  
    // The adapter uses the adaptee to get the coordinates. 
    async getAddressDetails(searchedCityName){
        var fetchURL = `${this.getAddressDetailsURL}${searchedCityName}`
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
        const response = await fetch(fetchURL, requestOptions)
        if(!response.ok){
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        return data;
    }
}

export default OpenStreetMapAdapter