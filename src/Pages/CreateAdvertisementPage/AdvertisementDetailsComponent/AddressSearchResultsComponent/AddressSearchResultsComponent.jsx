import { Table } from "flowbite-react"
import "./AddressSearchResultsComponent.css"

function AddressSearchResultsComponent(props){
    if(props.listOfPossibleAddresses.length !== 0){
        return (        
            <div id="AllSerchResults">
                {/*
                <table>
                    <tbody>
                    {
                        props.listOfPossibleAddresses.map((address, addressIndex) => (
                            <tr key={addressIndex} className={addressIndex%2===0?"EvenRow":"OddRow"}>
                                <td id="SearchedAddressResult" key={addressIndex} onClick={(event) => props.selectAddress(event, address)}>{address['display_name']}</td>
                            </tr>
                            
                        ))
                    }
                    </tbody>
                </table>
                
                */}
                
                <Table>
                    <Table.Body>
                    {
                        props.listOfPossibleAddresses.map((address, addressIndex) => (
                            <Table.Row key={addressIndex} className={`hover:bg-gray-200`}>
                                <Table.Cell className={"TableRow"} onClick={(event) => props.selectAddress(event, address)}>
                                    {address['display_name']}
                                </Table.Cell>
                            </Table.Row>                            
                        ))
                    }
                    </Table.Body>
                </Table>
            </div>
        )
    }

}

export default AddressSearchResultsComponent