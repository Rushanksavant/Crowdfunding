import { useState } from 'react';
import { ethers } from 'ethers';

import CrowdFunding from '../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json';

import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function Send() {

    async function contract_balance() {
        const provider = new ethers.providers.Web3Provider(window.ethereum) // there are other providers as well, we are using Web3Provider
        const contract = new ethers.Contract(contractAddress, CrowdFunding.abi, provider) // instance of the contract

        try {
            const balance = await contract.getCOntractBalance() // calling getCOntractBalance() function from CrowdFunding.sol
            console.log('Total contract balance: ', balance)
        } catch (err) {
            console.log("Error: ", err)
        }
    }

    return (
        <div>
            <Button variant="primary btn btn-primary btn-lg" onClick={contract_balance}>Contract balance: </Button>
        </div>
    )
} 