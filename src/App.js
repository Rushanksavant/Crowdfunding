import { useState } from 'react';
import { ethers } from 'ethers';
import './App.css';
import CrowdFunding from './artifacts/contracts/CrowdFunding.sol/CrowdFunding.json';

import Send from "./Components/Send";
import Balance from "./Components/Balance"
import Requests from './Components/Requests'
import VoteRequest from "./Components/VoteRequest"
import CompleteReq from './Components/CompleteReq';

import { Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

// import { Route, Link } from 'react-router-dom';

const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function App() {

  async function requestAccount() { // will make user navigate to metamast 
    await window.ethereum.request({ method: 'eth_requestAccounts' }); // will prompt user to conect metamask
  }

  async function get_target() {
    const provider = new ethers.providers.Web3Provider(window.ethereum) // there are other providers as well, we are using Web3Provider
    const contract = new ethers.Contract(contractAddress, CrowdFunding.abi, provider) // instance of the contract

    const all_requests = []
    let i = 0;
    while ("" !== [await contract.requests(i)][0][0]) {
      all_requests.push([await contract.requests(i)])
      i++
    }
    console.log(all_requests)
  }

  return (
    <div className="App">
      <header className="App-header">

        {/* <Route exact path='/' component={Send} />
        <Route exact path='/' component={Balance} />
        <Route exact path='/' component={VoteRequest} />
        <Route exact path='/manager' component={Requests} />
        <Route exact path='/manager' component={CompleteReq} /> */}

        <Send />
        <br></br>

        <Balance />
        <br></br>

        <Requests />
        <br></br>

        <VoteRequest />
        <br></br>

        <CompleteReq />
        <br></br>

        <Button variant="primary btn btn-primary btn-lg" onClick={get_target}>get requests</Button>
      </header>
    </div>
  );
}


