import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { TrustedResourcesContract__factory } from "../typechain";

describe("TrustedResourcesContract", () => {
  let TrustedResources: TrustedResourcesContract__factory;

  let admin: SignerWithAddress;
  let adminAddress: string;

  let nominee: SignerWithAddress;
  let nomineeAddress: string;

  let unauthorizedUser: SignerWithAddress;

  beforeAll(async () => {
    [admin, nominee, unauthorizedUser] = await ethers.getSigners();
    adminAddress = await admin.getAddress();
    nomineeAddress = await nominee.getAddress();
    TrustedResources = (await ethers.getContractFactory(
      "TrustedResourcesContract",
      admin
    )) as TrustedResourcesContract__factory;
  });

  describe("constructor()", () => {
    it("Should deploy correctly", async function () {
      const trustedResources = await TrustedResources.deploy();
      await trustedResources.deployed();
      expect(await trustedResources.owner()).toEqual(adminAddress);
    });
  });

  describe("nominateAdmin", () => {
    it("should allow admins to nominate", async () => {
      const trustedResources = await TrustedResources.deploy();
      await trustedResources.deployed();
      expect(() => trustedResources.nominateAdmin(nomineeAddress)).not.toThrow();
    });
  });
});
