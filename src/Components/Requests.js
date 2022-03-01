import { useState } from 'react';
import { ethers } from 'ethers';

import CrowdFunding from '../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json';

import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function Requests() {

    const [req, setReq] = useState({
        discription: "",
        recipient: "",
        value: 0,
        deadline: 0
    })

    async function requestAccount() { // will make user navigate to metamast 
        await window.ethereum.request({ method: 'eth_requestAccounts' }); // will prompt user to conect metamask

    }

    async function add_request() {
        if (typeof window.ethereum !== 'undefined') {
            await requestAccount() // wait for users to connect metamask
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner() // since we are making change in the blockchain we need to sign the transaction
            const contract = new ethers.Contract(contractAddress, CrowdFunding.abi, signer) // instance of the contract

            const transaction = await contract.createNewRequest(req.discription, req.recipient, req.value, req.deadline) // calling sendETH() from CrowdFunding.sol
            await transaction.wait() // waiting for the transaction to be confirmed

            const all_req = await contract.requests(0);
            console.log(all_req);
        }
    }

    return (
        <div>
            <button onClick={add_request}>+New Request(manager)</button>
            <form>
                <input type="text" onChange={event => setReq({ ...req, discription: event.target.value })} placeholder="Describe" />
                <input type="text" onChange={event => setReq({ ...req, recipient: event.target.value })} placeholder="Recipient Address" />
                <input type="number" onChange={event => setReq({ ...req, value: event.target.value })} placeholder="Value require (in Wei)" />
                <input type="number" onChange={event => setReq({ ...req, deadline: event.target.value })} placeholder="Validity in seconds" />
            </form>
        </div>
    )
} 