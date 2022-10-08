//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SkyBlockContract is Ownable {
  mapping(address => ParticipantStatus) public participants;

  enum ParticipantStatus {
    NONE,
    NOMINATED,
    ADMIN
  }

  /**
   *
   * Events
   *
   */
  event NominateAdmin(address indexed existing, address indexed nominated);
  event AcceptNomination(address indexed nominated, bytes32 email);

  constructor() {
    participants[msg.sender] = ParticipantStatus.ADMIN;
  }

  /**
   *
   *  Modifiers
   *
   */
  modifier isAdmin(address _addr) {
    require(participants[_addr] == ParticipantStatus.ADMIN, "not an ADMIN");
    _;
  }

  modifier canBeNominated(address _addr) {
    require(participants[_addr] != ParticipantStatus.ADMIN, "already an ADMIN");
    require(participants[_addr] != ParticipantStatus.NOMINATED, "already NOMINATED");
    _;
  }

  /**
   *
   *  Methods
   *
   */
  function nominateAdmin(address _nominated) public isAdmin(msg.sender) canBeNominated(_nominated) {
    participants[_nominated] = ParticipantStatus.NOMINATED;
    emit NominateAdmin(msg.sender, _nominated);
  }

  function acceptNomination(bytes32 email) public {
    require(participants[msg.sender] == ParticipantStatus.NOMINATED, "must be nominated");
    participants[msg.sender] = ParticipantStatus.ADMIN;
    emit AcceptNomination(msg.sender, email);
  }
}
