import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./LoginComponent.css"
import { faKey, faUnlock, faUser } from "@fortawesome/free-solid-svg-icons"
import { useEffect, useState } from "react"
import { baseURL } from "../../../../Constants"
import secureLocalStorage from "react-secure-storage"
import { Button, Checkbox, Label, Modal, TextInput } from "flowbite-react"

function LoginComponent(props){
    const [invalidLoginDetailsEntered, setInvalidLoginDetailsEntered] = useState(false)
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    useEffect(() => {
        // When logged out and logging right back in, reset the states so that the fields are not filled in.
        setEmail("")
        setPassword("")
    }, [props.displayLoginPopup])

    function handleInputChange(event){
        if(event.target.id === "UsernameInput"){         
            setEmail(event.target.value)         
        }else if(event.target.id === "PasswordInput"){
            setPassword(event.target.value)
        }
    }

    async function handleClickLogin(event){
        event.preventDefault();    
        const fetchURL = `${baseURL}/api/User/LoginUser`
        var requestBody = {
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
                if(response['result'] === "Account Not Found"){
                    setInvalidLoginDetailsEntered(true);
                    return;
                }else{
                    setInvalidLoginDetailsEntered(false);
                    secureLocalStorage.setItem("Token", response['token'])
                    props.setIsLoggedIn(true)
                    props.closeLoginPopup()
                    // In the case of a successful account creatijon, navigate back to log in
                }
                
            }).catch(error => props.setErrorHasOccured(true))
    }
    if(false){
        return (
            <div id="LoginComponentMainDiv">
             <center>
                    <label id={"TitleLabel"}>User Login</label>
                    <div id={"UsernameDiv"}>
                        <FontAwesomeIcon id={"UsernameIcon"} icon={faUser}/>
                        <input
                            id={"UsernameInput"}
                            type={"text"}
                            placeholder={"Email"}
                            onChange={handleInputChange}
                            value={email}
                        />
                    </div>
                    <div id={"PasswordDiv"}>
                        <FontAwesomeIcon id={"LockIcon"} icon={faUnlock}/>
                        <input
                            id={"PasswordInput"}
                            type={"password"}
                            placeholder={"Password"}
                            onChange={handleInputChange}
                            value={password}
                        />
                    </div>
    
                    <button id={"ButtonLogin"} onClick={handleClickLogin}>
                        <FontAwesomeIcon id={"LoginKeyIcon"} icon={faKey}/>
                    </button>
                    {
                        invalidLoginDetailsEntered &&
                        <div id={"InvalidDetailsDiv"}>
                            <label id={"InvalidDetailsLabel"}>Invalid Details Entered</label>
                        </div>
                    }
                    <div id={"CreateNewAccountDiv"}>
                        <button id={"CreateNewAccountButton"} onClick={props.showCreateAccountComponent}>Create Admin Account</button>
                    </div>
    
                </center>
            </div>
        )
    }else{
        return (
            /* 
            <div className="flex items-center justify-center h-screen pointer-events-none">
                <form className="flex flex-col gap-4 max-w-md p-6 bg-white shadow-md rounded-md pointer-events-auto">
                    <div className="mb-4">
                        <Label htmlFor="UsernameInput" value="Your email" className="block text-sm font-medium text-gray-700" />
                        <TextInput id={"UsernameInput"} className="w-full px-4 py-2  rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500" type="email" placeholder="name@flowbite.com" required onChange={handleInputChange} value={email} />
                    </div>
                    <div className="mb-4">
                        <Label htmlFor="PasswordInput" value="Your password" className="block text-sm font-medium text-gray-700" />
                        <TextInput id={"PasswordInput"} className="w-full px-4 py-2  rounded-md focus:ring focus:ring-blue-500 focus:border-blue-500"  type="password" required onChange={handleInputChange} value={password}/>
                    </div>
                    <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md transition duration-300" type="submit" onClick={event => handleClickLogin(event)}>Submit</Button>     
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don’t have an account yet? <a onClick={props.showCreateAccountComponent} className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</a>
                  </p>         
                </form>
            </div>
            */
           
            <>
            <Modal show={props.displayLoginPopup} size="md" onClose={props.closeLoginPopup} popup>
                <Modal.Header />
                <Modal.Body>
                <div className="space-y-6">
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>
                    <div>
                    <div className="mb-2 block">
                        <Label htmlFor="UsernameInput" value="Your email" />
                    </div>
                    <TextInput
                        id="UsernameInput"
                        placeholder="name@company.com"
                        required
                        onChange={handleInputChange} 
                        value={email}
                    />
                    </div>
                    <div>
                    <div className="mb-2 block">
                        <Label htmlFor="PasswordInput" value="Your password" />
                    </div>
                    <TextInput 
                        id="PasswordInput" 
                        type="password" 
                        required 
                        value={password}
                        onChange={handleInputChange}
                        color={invalidLoginDetailsEntered?"failure":"gray"}
                        helperText={                            
                            invalidLoginDetailsEntered &&
                            <>
                            <span className="font-medium">Error!</span> Invalid Login Credentials!
                            </>                                                   
                        }
                    />
                    </div>
                    <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                        <Checkbox id="remember" />
                        <Label htmlFor="remember">Remember me</Label>
                    </div>
                    <a href="#" className="text-sm text-cyan-700 hover:underline dark:text-cyan-500">
                        Lost Password?
                    </a>
                    </div>
                    <div className="w-full">
                    <Button onClick={event => handleClickLogin(event)}>Log in to your account</Button>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-gray-500 dark:text-gray-300">
                    Not registered?&nbsp;
                    <a href="#" className="text-cyan-700 hover:underline dark:text-cyan-500" onClick={props.showCreateAccountComponent}>
                        Create account
                    </a>
                    </div>
                </div>
                </Modal.Body>
            </Modal>
            </>
          );
    }

   
}

export default LoginComponent