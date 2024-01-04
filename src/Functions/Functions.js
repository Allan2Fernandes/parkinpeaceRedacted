class StandardFunctions{
    static getPasswordInputStates(password1, password2){
        if(password1 !== "" || password2 !== ""){
            if(password1 !== password2){
                return "failure"
            }else{
                return "success"
            }
        }else{
            return "gray"
        }
    }

    static simplifyAddress(address){
        // Split the address by commas
        const parts = address.split(',').map(part => part.trim());

        // Define the indices of the essential address components
        const essentialIndices = [0, 1, 2, 3]; 

        // Create a simplified address with essential components
        const simplifiedAddress = essentialIndices.map(index => parts[index]).join(', ');

        return simplifiedAddress;
    }
}

export default StandardFunctions