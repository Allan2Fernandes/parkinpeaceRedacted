import { useState } from "react"
import "./CreateAccountComponent.css"
import {baseURL} from "../../../../Constants.js"
import { Button, Label, Modal, TextInput } from "flowbite-react"
import StandardFunctions from "../../../../Functions/Functions.js"
//import {FetchHandler} from "../../../../FetchHandler/FetchHandler.js"


function CreateAccountComponent(props){
    const [displayErrorMessage, setDisplayErrorMessage] = useState(false)
    const [name, setName] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [address, setAddress] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatedPassword, setRepeatedPassword] = useState("");

    function changeHandlerInputFields(event){
        if(event.target.id === "CreateNameInput"){
            setName(event.target.value)
        }else if(event.target.id === "CreatePhoneNumberInput"){
            setPhoneNumber(event.target.value)
        }else if(event.target.id === "CreateAddressInput"){
            setAddress(event.target.value)
        }else if(event.target.id === "CreateEmailInput"){
            setEmail(event.target.value)
        }else if(event.target.id === "CreatePasswordInput"){
            setPassword(event.target.value)
        }else if(event.target.id === "RepeatPasswordInput"){
            setRepeatedPassword(event.target.value)
        }
    }

    async function createAccount(event){
        const fetchURL = `${baseURL}/api/User/CreateUser`
        var requestBody = {
            fldName: name,
            fldPhoneNumber: phoneNumber,
            fldAdress: address,
            fldIsAdmin: false,
            fldEncryptedPassword: password,
            fldEmail: email
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
        await fetch(fetchURL, requestOptions)
            .then(response => response.json())
            .then(response => {
                if(response === "Email Exists"){
                    setDisplayErrorMessage(true);
                    return;
                }
                setDisplayErrorMessage(false)
                // In the case of a successful account creatijon, navigate back to log in
                props.showLoginComponent();
                // Check for clashing emails
            }).catch(error => props.setErrorHasOccured(true))
    }

    return (
        <>
        <Modal show={props.displayLoginPopup} size="md" onClose={props.closeLoginPopup} popup>
            <Modal.Header />
            <Modal.Body>
            <form  onSubmit={createAccount}>
                <div className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign up to Park In Peace</h3>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="CreateNameInput" value="Your Name" />
                        </div>
                        <TextInput
                            id="CreateNameInput" 
                            type="text"
                            placeholder="Name"
                            onChange={changeHandlerInputFields}
                            value={name}
                            required
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="CreatePhoneNumberInput" value="Your Telephone Number" />
                        </div>
                        <TextInput
                            id="CreatePhoneNumberInput" 
                            type="text"
                            placeholder="+45 12345678"
                            onChange={changeHandlerInputFields}
                            value={phoneNumber}
                            required
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="CreateAddressInput" value="Your Address" />
                        </div>
                        <TextInput
                            id="CreateAddressInput" 
                            type="text"
                            placeholder="Østergade 5, 3tv"
                            onChange={changeHandlerInputFields}
                            value={address}
                            required
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="CreateEmailInput" value="Your Email Address" />
                        </div>
                        <TextInput
                            id="CreateEmailInput" 
                            type="email"
                            placeholder="User@mail.com"
                            onChange={changeHandlerInputFields}
                            value={email}
                            required
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="CreatePasswordInput" value="Your Password" />
                        </div>
                        <TextInput
                            id="CreatePasswordInput" 
                            type="password"
                            placeholder="Strong password"
                            required
                            onChange={changeHandlerInputFields}
                            color={StandardFunctions.getPasswordInputStates(password, repeatedPassword)}
                            value={password}
                        />
                    </div>
                    <div>
                        <div className="mb-2 block">
                            <Label htmlFor="RepeatPasswordInput" value="Your password" />
                        </div>
                        <TextInput 
                            id="RepeatPasswordInput" 
                            type="password" 
                            placeholder="Repeated Strong password"
                            required 
                            onChange={changeHandlerInputFields}
                            color={StandardFunctions.getPasswordInputStates(password, repeatedPassword)}
                            value={repeatedPassword}
                            />
                    </div>
                    
                    <div className="w-full">
                        <Button type="submit" disabled={password!==repeatedPassword}>Create account</Button>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
                        Have an exiting account?&nbsp;
                        <a href="#" className="text-cyan-700 hover:underline dark:text-cyan-500" onClick={props.showLoginComponent}>
                            Back to Login
                        </a>
                    </div>
                </div>
            </form>
            
            </Modal.Body>
        </Modal>
        </>
    )
    
}

export default CreateAccountComponent