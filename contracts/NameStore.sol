// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Storage {

    /* Initializing mapping of addresses to strings,
        to allow for unique name per address
    */
    mapping (address => string) public name;

    /* Setting name for address which called function
    */
    function setName(string memory _name) public {
        name[msg.sender] = _name;
    }

    /* Reading stored name for address calling function
    */
    function readName() public view returns (string memory){
        return name[msg.sender];
    }
}