import { useState } from 'react';
import { ethers } from 'ethers';

import CrowdFunding from '../artifacts/contracts/CrowdFunding.sol/CrowdFunding.json';

import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function Send() {
    const [contri, setContri] = useState(0)

    async function requestAccount() { // will make user navigate to metamast 
        await window.ethereum.request({ method: 'eth_requestAccounts' }); // will prompt user to conect metamask

    }

    async function send() {
        if (typeof window.ethereum !== 'undefined') {
            await requestAccount() // wait for users to connect metamask
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner() // since we are making change in the blockchain we need to sign the transaction
            const contract = new ethers.Contract(contractAddress, CrowdFunding.abi, signer) // instance of the contract

            const transaction = await contract.sendETH({ value: contri }) // calling sendETH() from CrowdFunding.sol
            await transaction.wait() // waiting for the transaction to be confirmed
        }
    }

    return (
        <div>
            <Button variant="primary btn btn-primary btn-lg" onClick={send}>Send in Wei (min 100)</Button>
            <input
                onChange={event => setContri(event.target.value)}
                // value={contri}
                placeholder="100" />
        </div>
    )
} 