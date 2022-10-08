//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TrustedResourcesContract is Ownable {
  mapping(address => ParticipantStatus) public participants;

  enum ParticipantStatus {
    NONE,
    REQUESTED,
    ADMIN
  }

  constructor() {
    participants[msg.sender] = ParticipantStatus.ADMIN;
  }

  /**
   *
   *  Participation
   *
   */
  modifier isAdmin(address _addr) {
    require(participants[_addr] == ParticipantStatus.ADMNIN, "not an ADMIN");
    _;
  }

  event NominateAdmin(address indexed existing, address indexed nominated);

  event AcceptAdmin(address indexed nominated, bytes32 email);

  function nominateAdmin(address _nominated) public isAdmin(msg.sender) {
    emit NominateAdmin(msg.sender, nominated);
  }

  function dualParticipant(
    address _counterParty,
    bytes32 _line1,
    bytes32 _line2
  ) public canParticipate(msg.sender) {
    emit DualParticipant(msg.sender, _counterParty, _line1, _line2);
  }
}
