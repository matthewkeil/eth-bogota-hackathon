import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";
import { SkyBlockContract__factory } from "../typechain";

describe("SkyBlockContract", () => {
  let SkyBlock: SkyBlockContract__factory;

  let admin: SignerWithAddress;
  let adminAddress: string;

  let nominee: SignerWithAddress;
  let nomineeAddress: string;

  let unauthorizedUser: SignerWithAddress;

  beforeAll(async () => {
    [admin, nominee, unauthorizedUser] = await ethers.getSigners();
    adminAddress = await admin.getAddress();
    nomineeAddress = await nominee.getAddress();
    SkyBlock = (await ethers.getContractFactory(
      "SkyBlockContract",
      admin
    )) as SkyBlockContract__factory;
  });

  describe("constructor()", () => {
    it("Should deploy correctly", async function () {
      const SkyBlock = await SkyBlock.deploy();
      await SkyBlock.deployed();
      expect(await SkyBlock.owner()).toEqual(adminAddress);
    });
  });

  describe("nominateAdmin", () => {
    it("should allow admins to nominate", async () => {
      const SkyBlock = await SkyBlock.deploy();
      await SkyBlock.deployed();
      expect(() => SkyBlock.nominateAdmin(nomineeAddress)).not.toThrow();
    });
  });
});
