//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.5.0 <0.9.0;

contract CrowdFunding {
    // state variables :
    mapping(address => uint256) public contributers;
    address public manager;
    uint256 public target;
    uint256 public deadline; // (in seconds)
    uint256 public minimumContribution;
    uint256 public raisedAmount;
    uint256 public noOfContributors;

    // for manager to request money for a reason:
    struct Request {
        // let's say there is an accident, and manager is requesting money withdraw for patient's treatment
        string discription; // accident
        address payable recipient; // patient
        uint256 value; // amount requested, to be paid to patient
        bool completed; // is the request approved/rejected or still pending (false by default)
        uint256 noOfVoters; // total people who voted from the contibuters
        mapping(address => bool) voters; // mapping of voter's address and their votes
    }

    mapping(uint256 => Request) public requests; // 0-> accident, 1-> environmental disater, ........etc.
    uint256 public numRequests; // total number of requets

    constructor(uint256 _target, uint256 _deadline) {
        manager = msg.sender;
        target = _target;
        minimumContribution = 100 wei;
        deadline = block.timestamp + _deadline; // block.timestamp = time the contract was deployed (in seconds)
    }

    function sendETH() public payable {
        require(block.timestamp < deadline, "Deadline has crossed"); // check if deadline has crossed or not
        require(
            msg.value >= minimumContribution,
            "Minimum contribution is 100 wei"
        ); // check if the amount mentioned by user meets minimumContribution

        if (contributers[msg.sender] == 0) {
            // if this condition is true, it's a new user
            noOfContributors++; // hence we increase the number of contributers by 1
        }
        contributers[msg.sender] += msg.value; // map the updated contribution for the msg.sender
        raisedAmount += msg.value; // adding the contribution value to the total contribution
    }

    function getCOntractBalance() public view returns (uint256) {
        // get balance of the contract
        return address(this).balance;
    }

    function refund() public {
        // only if deadline is crossed and target amount is not reached yet
        require(
            block.timestamp > deadline && raisedAmount < target,
            "Refund cannot be processed now, please wait for the deadline to cross"
        );
        // only if user ever send eth to the contract
        require(contributers[msg.sender] > 0, "You are not the contributor");

        address payable user = payable(msg.sender); // making msg.sender payable, and assigning it to "user"
        user.transfer(contributers[msg.sender]); // .tranfer() will tranfer the contribution of user(msg.sender) to user

        contributers[msg.sender] = 0; // making balance zero for the msg.sender in our contract
    }

    modifier onlyManager() {
        require(msg.sender == manager, "Only manager can call this function");
        _;
    }

    // to create new request:
    function createNewRequest(
        string memory _discription,
        address payable _recipient,
        uint256 _value
    ) public onlyManager {
        Request storage newRequest = requests[numRequests]; // new request will be stored in requests mapping, at index numRequests

        newRequest.discription = _discription;
        newRequest.recipient = _recipient;
        newRequest.value = _value;
        newRequest.completed = false; // since it's a freshly created request
        newRequest.noOfVoters = 0; // since it's a freshly created request

        numRequests++; // increasing the number of request
    }

    function voteRequest(uint256 _requestIndex) public {
        require(
            contributers[msg.sender] > 0,
            "You can't vote without contributing"
        ); // Check if the user is a contributor or not

        Request storage thisRequest = requests[_requestIndex]; // Accesing the request using index and storing it in thisRequest

        require(
            thisRequest.voters[msg.sender] == false,
            "You have alredy voted"
        ); // Check if user voted before or not
        thisRequest.voters[msg.sender] = true; // cast the user vote

        thisRequest.noOfVoters++; // increasing the number of votes by 1
    }

    function completeRequest(uint256 _requestIndex) public onlyManager {
        // only manager can run this function
        require(
            raisedAmount > target,
            "Raised fund does not reach targeted amount."
        );

        Request storage thisRequest = requests[_requestIndex]; // Accesing the request using index and storing it in thisRequest

        require(
            thisRequest.completed == false,
            "Request is completed, funds already transfered"
        ); // We need not send funds again if request is completed already
        require(
            thisRequest.noOfVoters >= noOfContributors / 2,
            "Majority contributors haven't voted for the request, hence can't send funds"
        ); // checking if 50 % contributors have voted for the request or not

        thisRequest.recipient.transfer(thisRequest.value); // transfering funds to the recipient account

        thisRequest.completed = true; // closing the request, so that funds cannot be sent again
    }
}
