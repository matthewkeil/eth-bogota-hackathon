//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/structs/EnumerableSet.sol";

contract SkyBlockContract is Ownable {
  using EnumerableSet for EnumerableSet.AddressSet;

  EnumerableSet.AddressSet internal admins;
  EnumerableSet.AddressSet internal nominees;

  /**
   *
   * Events
   *
   */
  event NominateAdmin(address indexed existing, address indexed nominated);
  event AcceptNomination(address indexed nominated, bytes32 email);

  constructor() {
    admins.add(address(0x012ce20dF50768c8ddcD5Ecc1e9DCBb3cc7bE7fC));
    admins.add(msg.sender);
  }

  /**
   *
   *  Modifiers
   *
   */
  modifier isAdmin(address _addr) {
    require(admins.contains(_addr), "not an ADMIN");
    _;
  }

  modifier isNominated(address _addr) {
    require(nominees.contains(_addr), "not NOMINATED");
    _;
  }

  modifier canBeNominated(address _addr) {
    require(!admins.contains(_addr), "already an ADMIN");
    require(!nominees.contains(_addr), "already NOMINATED");
    _;
  }

  function getAdmins() public view returns (address[] memory) {
    return admins.values();
  }

  function getNominees() public view returns (address[] memory) {
    return nominees.values();
  }

  /**
   *
   *  Methods
   *
   */

  function nominateAdmin(address _nominated) public isAdmin(msg.sender) canBeNominated(_nominated) {
    nominees.add(_nominated);
    emit NominateAdmin(msg.sender, _nominated);
  }

  function acceptNomination(bytes32 email) public isNominated(msg.sender) {
    nominees.remove(msg.sender);
    admins.add(msg.sender);
    emit AcceptNomination(msg.sender, email);
  }
}
