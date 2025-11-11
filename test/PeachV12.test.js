const { expect } = require("chai"); // being explicit about a dependency
const { ethers, upgrades } = require("hardhat");

describe("A metaversal artist who wants to MINT (create tokens)", function () {
  let peach; // Declare peach here so it's accessible in all tests

  before(async function () {
    // setup for this 'describe' block
    Peach = await ethers.getContractFactory("PeachV12"); // get deployable contract
    outputC1B7A0 =
      "data:application/json;base64,eyJuYW1lIjogInRoZSBtdXJwaCBudW1lcmFsIiwgImRlc2NyaXB0aW9uIjogImEgcm9ja29wZXJhIGNvbG9yIGZvciBvbmNoYWluIGFydCIsICJpbWFnZSI6ICJkYXRhOmltYWdlL3N2Zyt4bWw7YmFzZTY0LFBITjJaeUI0Yld4dWN6MGlhSFIwY0RvdkwzZDNkeTUzTXk1dmNtY3ZNakF3TUM5emRtY2lJSEJ5WlhObGNuWmxRWE53WldOMFVtRjBhVzg5SW5oTmFXNVpUV2x1SUcxbFpYUWlJSFpwWlhkQ2IzZzlJakFnTUNBek5UQWdNelV3SWo0OGMzUjViR1UrTG1KaGMyVWdleUJtYVd4c09pQjNhR2wwWlRzZ1ptOXVkQzFtWVcxcGJIazZJSE5sY21sbU95Qm1iMjUwTFhOcGVtVTZJREUwY0hnN0lIMDhMM04wZVd4bFBqeHlaV04wSUhkcFpIUm9QU0l4TURBbElpQm9aV2xuYUhROUlqRXdNQ1VpSUdacGJHdzlJbUpzWVdOcklpQXZQangwWlhoMElIZzlJalV3SlNJZ2VUMGlNVFlpSUhSbGVIUXRZVzVqYUc5eVBTSnRhV1JrYkdVaUlISnZkR0YwWlQwaU1UZ3dJaUJ6ZEhsc1pUMGlabWxzYkRvZ1lteGhZMnM3SUdadmJuUXRjMmw2WlRvZ016VndlRHNpUGlZak9UZ3hORHM4TDNSbGVIUStQSFJsZUhRZ2VEMGlOVEFsSWlCNVBTSXpNakFpSUhSbGVIUXRZVzVqYUc5eVBTSnRhV1JrYkdVaUlHTnNZWE56UFNKaVlYTmxJajUwYUdVZ2JYVnljR2dnYm5WdFpYSmhiRHd2ZEdWNGRENDhkR1Y0ZENCNFBTSTFNQ1VpSUhrOUlqTXpOeUlnZEdWNGRDMWhibU5vYjNJOUltMXBaR1JzWlNJZ1kyeGhjM005SW1KaGMyVWlQaU5ETVVJM1FUQThMM1JsZUhRK1BISmxZM1FnZUQwaU5UQWlJSGs5SWpVd0lpQjNhV1IwYUQwaU1qVXdJaUJvWldsbmFIUTlJakkxTUNJZ1ptbHNiRDBpSTBNeFFqZEJNQ0lnTHo0OEwzTjJaejQ9In0=";
    mintUnderPayment = ethers.parseEther("0.0001");
    mintPayment = ethers.parseEther("0.001");
    mintOverPayment = ethers.parseEther("0.01");
    mintSuperPayment = ethers.parseEther("1");
    mintSuperDuperPayment = ethers.parseEther("10");
  });

  beforeEach(async function () {
    // setup for each 'it' block
    [owner, friend] = await ethers.getSigners(); // get list of ETH accounts, 1st is deployer
    peach = await upgrades.deployProxy(Peach, [owner.address], {
      initializer: "initialize",
      kind: "uups",
      timeout: 120000,
      gasLimit: 5000000,
    });
    await peach.waitForDeployment();
  });

  it("can create a new token", async function () {
    // mint a token, with its tokenID in colorhex form
    await peach.setToken("010101", "dark gray", { value: mintPayment });
    expect(await peach.getOwner("010101")).to.equal(owner.address);
  });

  it("can name a new token", async function () {
    // name is correct
    await peach.setToken("010101", "dark gray", { value: mintPayment });
    expect(await peach.getName("010101")).to.equal("dark gray");
  });

  it("can style a new token", async function () {
    // metadata & pic are correct
    await peach.setToken("C1B7A0", "the murph numeral", { value: mintPayment });
    expect(await peach.tokenURI(12695456)).to.equal(outputC1B7A0);
  });

  it("can not create a badly ID'd token", async function () {
    // try minting with a bad token-ID
    await peach.setToken("FFFFFF", "white", { value: mintSuperDuperPayment });
    expect(await peach.getName("FFFFFF")).to.be.equal("white"); // highest token-ID
    await expect(peach.setToken()).to.be.rejected; // empty input
  });

  it("can not create a badly named token", async function () {
    // try minting with a bad name
    await expect(peach.setToken("010101", {}, { value: mintPayment })).to.be
      .rejected; // empty input
    await expect(
      peach.setToken("010102", "abcdefghijklmnopqrstuvwxyz7890123", {
        value: mintPayment,
      })
    ).to.be.rejected; // too long
    await expect(
      peach.setToken("010103", "abcdefghijklmnopqrstuvwxyz789012", {
        value: mintPayment,
      })
    ).to.not.be.rejected; // max length
  });

  it("can not create an already existing token", async function () {
    // try minting at a token-ID you just minted at
    await peach.setToken("000001", "ineffably blue", { value: mintPayment });
    await expect(peach.setToken("000001", "still blue")).to.be.rejected;
  });

  it("can create an already burned token", async function () {
    // try minting at a burned token-ID, and it works, and it's OK
    await peach.setToken("000001", "ineffably blue", { value: mintPayment });
    await peach.nixToken("000001");
    await peach
      .connect(friend)
      .setToken("000001", "wicked dark blue", { value: mintPayment });
    expect(await peach.getOwner("000001")).to.equal(friend);
    expect(await peach.getName("000001")).to.equal("wicked dark blue");
  });

  it("can create a non-free token with just enough payment", async function () {
    await peach
      .connect(friend)
      .setToken("000003", "off-black", { value: mintPayment });
    expect(await peach.getOwner("000003")).to.equal(friend.address);
  });

  it("can create a non-free token with more than enough payment", async function () {
    await peach
      .connect(friend)
      .setToken("000003", "off-black", { value: mintOverPayment });
    expect(await peach.getOwner("000003")).to.equal(friend.address);
  });

  it("can not create a non-free token with less than enough payment", async function () {
    await expect(
      peach
        .connect(friend)
        .setToken("000003", "off-black", { value: mintUnderPayment })
    ).to.be.revertedWithCustomError(peach, "NeedMoreFundsForThisColor");
    await expect(peach.getOwner("000003")).to.be.rejected;
  });
});

describe("A metaversal artist who wants to BURN (destroy tokens)", function () {
  let orange;

  before(async function () {
    // setup for this 'describe' block
    Orange = await ethers.getContractFactory("PeachV12"); // get deployable contract
    zeroAddress = "0x0000000000000000000000000000000000000000";
    // mintUnderPayment = ethers.parseEther("0.0001");
    mintPayment = ethers.parseEther("0.001");
    // mintOverPayment = ethers.parseEther("0.01");
    // mintSuperPayment = ethers.parseEther("1");
    mintSuperDuperPayment = ethers.parseEther("10");
  });

  beforeEach(async function () {
    // setup for each 'it' block
    [owner, friend, stranger] = await ethers.getSigners(); // get list of ETH accounts, 1st is deployer
    orange = await upgrades.deployProxy(Orange, [owner.address], {
      initializer: "initialize",
      kind: "uups",
      timeout: 120000,
      gasLimit: 5000000,
    });
    await orange.waitForDeployment(); // wait for deployment completion
  });

  it("can destroy an owned token", async function () {
    // destroy a token you own
    await orange.setToken("000001", "ineffably blue", { value: mintPayment });
    expect(await orange.getName("000001")).to.equal("ineffably blue");
    await orange.nixToken("000001");
    await expect(orange.getOwner("000001")).to.be.rejected; // checking burned token is ownerless
    await expect(orange.getName("000001")).to.be.rejected; // checking burned token is nameless
  });

  it("can not destroy an existing yet unowned token", async function () {
    // try to destroy a token belonging to someone else
    await orange.setToken("000001", "ineffably blue", { value: mintPayment });
    await expect(orange.connect(friend).nixToken("000001")).to.be.rejected;
  });

  it("can not destroy a badly ID'd token", async function () {
    // try burning with a bad token-ID
    await orange.setToken("FFFFFF", "white", { value: mintSuperDuperPayment });
    expect(await orange.getName("FFFFFF")).to.be.equal("white"); // highest token-ID
    await expect(orange.nixToken("")).to.be.rejected; // too short
    await expect(orange.nixToken({})).to.be.rejected; // empty input
  });

  it("can not destroy an already burned token", async function () {
    // try burning a token, then burning it again
    await orange.setToken("000001", "ineffably blue", { value: mintPayment });
    await orange.nixToken("000001");
    await expect(orange.nixToken("000001")).to.be.rejected;
  });

  it("can not destroy an unminted token", async function () {
    // try to destroy what has not been created
    await expect(orange.getOwner("000001")).to.be.rejected;
    await expect(orange.nixToken("000001")).to.be.rejected;
  });
});

describe("A metaversal artist who wants to GIVE (modify token owner)", function () {
  let orange;

  before(async function () {
    // setup for this 'describe' block
    Orange = await ethers.getContractFactory("PeachV12"); // get deployable contract
    zeroAddress = "0x0000000000000000000000000000000000000000";
    invalidAddress = "0x00000000000000000000000000po_op0000000000";
    mintPayment = ethers.parseEther("0.001");
  });

  beforeEach(async function () {
    // setup for each 'it' block
    [owner, friend, stranger] = await ethers.getSigners(); // get list of ETH accounts, 1st is deployer
    orange = await upgrades.deployProxy(Orange, [owner.address], {
      initializer: "initialize",
      kind: "uups",
      timeout: 120000,
      gasLimit: 5000000,
    });
    await orange.waitForDeployment(); // wait for deployment completion
  });

  it("can give an owned token to a separate and valid address", async function () {
    // transfer your own token to a friend
    await orange.setToken("000001", "ineffably blue", { value: mintPayment });
    await orange.modOwner("000001", friend);
    expect(await orange.getOwner("000001")).to.equal(friend);
  });

  it("can no longer see the given token as owned", async function () {
    // transfer it to a friend, then see if you still own it
    await orange.setToken("000001", "ineffably blue", { value: mintPayment });
    await orange.modOwner("000001", friend);
    expect(await orange.getOwner("000001")).to.not.equal(owner);
  });

  it("can give an owned token back to themselves", async function () {
    // transfer a token to yourself, a useless task that seems OK
    await orange.setToken("000001", "ineffably blue", { value: mintPayment });
    await orange.modOwner("000001", owner);
    expect(await orange.getOwner("000001")).to.equal(owner);
  });

  it("can not give an owned token to the burn address", async function () {
    // try to give your own token to be destroyed
    await orange.setToken("000001", "ineffably blue", { value: mintPayment });
    await expect(orange.modOwner("000001", zeroAddress)).to.be.rejected;
  });

  it("can not give an owned token to an otherwise invalid address", async function () {
    // try to give your own token to an invalid address
    await orange.setToken("000001", "ineffably blue", { value: mintPayment });
    await expect(orange.modOwner("000001", invalidAddress)).to.be.rejected;
    await expect(
      orange.modOwner("000001", await orange.getAddress())
    ).to.be.revertedWithCustomError(orange, "ProxyContractCannotBeTokenOwner");
  });

  it("can not give an existing yet unowned token", async function () {
    // try to give a token, which belongs to someone else, to yet someone else
    await orange.setToken("000001", "ineffably blue", { value: mintPayment });
    await expect(orange.connect(friend).modOwner("000001", stranger)).to.be
      .rejected;
  });

  it("can not give an unminted token", async function () {
    // try to give what has not been create
    await expect(orange.modOwner("000001", friend)).to.be.rejected;
  });

  it("can not give an already burned token", async function () {
    // try to give what has already been destroyed
    await orange.setToken("000001", "ineffably blue", { value: mintPayment });
    await orange.nixToken("000001");
    await expect(orange.modOwner("000001", friend)).to.be.rejected;
  });
});

describe("A metaversal artist who wants to RENAME (modify token content/name)", function () {
  let orange;

  before(async function () {
    // setup for this 'describe' block
    Orange = await ethers.getContractFactory("PeachV12"); // get deployable contract
    mintPayment = ethers.parseEther("0.001");
    mintSuperDuperPayment = ethers.parseEther("10");
  });

  beforeEach(async function () {
    // setup for each 'it' block
    [owner, friend, stranger] = await ethers.getSigners(); // get list of ETH accounts, 1st is deployer
    // orange = await Orange.deploy(); // deploy contract
    orange = await upgrades.deployProxy(Orange, [owner.address], {
      initializer: "initialize",
      kind: "uups",
      timeout: 120000,
      gasLimit: 5000000,
    });
    await orange.waitForDeployment(); // wait for deployment completion
  });

  it("can rename an owned token", async function () {
    // rename a token, with its tokenID in colorhex form
    await orange.setToken("000001", "ineffably blue", { value: mintPayment });
    expect(await orange.getName("000001")).to.equal("ineffably blue");
    await orange.modName("000001", "very dark blue");
    expect(await orange.getName("000001")).to.equal("very dark blue");
  });

  it("can not rename an existing yet unowned token", async function () {
    // owner mints, then connect friend, then friend tries to rename it
    await orange.setToken("000001", "ineffably blue", { value: mintPayment });
    await expect(
      orange.connect(friend).modName("000001", "wicked dahk blue")
    ).to.be.revertedWithCustomError(orange, "NotTokenOwner");
    await expect(
      orange.connect(stranger).modName("000001", "very dark blue")
    ).to.be.revertedWithCustomError(orange, "NotTokenOwner");
  });

  it("can not rename a badly ID'd token", async function () {
    // try renaming with a bad token-ID
    await orange.setToken("FFFFFF", "white", { value: mintSuperDuperPayment });
    await orange.modName("FFFFFF", "not black");
    expect(await orange.getName("FFFFFF")).to.equal("not black"); // highest token-ID
    await expect(orange.modName({}, "light light")).to.be.rejected; // empty input
  });

  it("can not rename a token to a bad name", async function () {
    // try renaming with a bad name
    await orange.setToken("000001", "ineffably blue", { value: mintPayment });
    await expect(orange.modName("000001", {})).to.be.rejected; // empty input
    await expect(orange.modName("000001", "abcdefghijklmnopqrstuvwxyz7890123"))
      .to.be.rejected; // too long
    await expect(orange.modName("000001", "abcdefghijklmnopqrstuvwxyz789012"))
      .to.not.be.rejected; // max lengh
  });

  it("can not rename an unminted token", async function () {
    // try to rename a token that has yet to be created
    await expect(orange.modName("000001", "still blue")).to.be.rejected;
  });

  it("can not rename an already burned token", async function () {
    // try to rename a token that has already been destroyed
    await orange.setToken("000001", "ineffably blue", { value: mintPayment });
    await orange.nixToken("000001");
    await expect(orange.modName("000001", "wicked dark blue")).to.be.rejected;
  });
});

describe("A metaversal artist who wants to RESTYLE (modify token style/picture)", function () {
  // it("can restyle an owned token");
  // it("can not restyle an existing yet unowned token");
  // it("can not restyle an already burned token");
  // it("can not restyle an unminted token");
  // it("can not restyle a token without enough funds to do so");
});

describe("A metaversal artist who wants to AVOID bad token IDs", function () {
  let orange;

  before(async function () {
    // setup for this 'describe' block
    Orange = await ethers.getContractFactory("PeachV12"); // get deployable contract
  });

  beforeEach(async function () {
    // setup for each 'it' block
    [owner, friend] = await ethers.getSigners(); // get list of ETH accounts, 1st is deployer
    orange = await upgrades.deployProxy(Orange, [owner.address], {
      initializer: "initialize",
      kind: "uups",
      timeout: 120000,
      gasLimit: 5000000,
    });
    await orange.waitForDeployment(); // wait for deployment completion
  });

  // it("can not accept a too-high token-ID");
  // await expect(orange._setToken(16777216, "toohigh")).to.be.revertedWith( "too big tokenId"); // too high
  // await expect(orange._modeName(16777216, "toohigh")).to.be.revertedWith("too big tokenId"); // too high
  // await expect(orange.burn(16777216)).to.be.reverted; // too high
  // await expect(orange.transfer(16777216)).to.be.reverted; // too high
  // await expect(orange.tokenNames(16777216)).to.be.reverted; // too high

  // it("can not accept a too-low token-ID");
  // await expect(orange.mintAtId(-1, "toolow")).to.be.rejected; // too low
  // await expect(orange.renameAtId(-1, "toolow")).to.be.rejected; // too low
  // await expect(orange.tokenNames(-1)).to.be.rejected; // too low
  // await expect(orange.burn(-1, "toolow")).to.be.rejected; // too low
  // await expect(orange.transfer(-1, "toolow")).to.be.rejected; // too low

  // it("can not accept a non-integer token-ID");
  // trying to use decimal-pointed values for the token-ID
  // await expect(orange.mintAtId(3.1, "ineffably blue")).to.be.rejected; // wrong type of input
  // await expect(orange.renameAtId(3.1, "ineffably blue")).to.be.rejected; // wrong type of input
  // await expect(orange.tokenNames(3.1)).to.be.rejected; // wrong type of input
  // await expect(orange.burn(3.1)).to.be.rejected; // wrong type of input
  // await expect(orange.transfer(3.1)).to.be.rejected; // wrong type of input

  it("can not accept an empty token-ID", async function () {
    // calling functions with no token-ID
    await orange.setToken("000001", "ineffably blue", { value: mintPayment }); // something to exist with a name we're using
    await expect(orange.setToken({}, "effably blue")).to.be.rejected; // empty input
    await expect(orange.modName({}, "effably blue")).to.be.rejected; // empty input
    await expect(orange.getName({})).to.be.rejected; // empty input
    await expect(orange.nixToken({})).to.be.rejected; // empty input
    await expect(orange.modOwner({}, friend)).to.be.rejected; // empty input
    await expect(orange.getOwner({})).to.be.rejected; // empty input
    await expect(orange.tokenURI({})).to.be.rejected; // empty input
  });

  it("can not accept an improperly converted token-ID", async function () {
    // converting from colorhex to decimal
    expect((await orange.aGetId("00FF00")).toString()).to.equal("65280"); // happy path of colorhex in capital letters
    expect((await orange.aGetId("00ff00")).toString()).to.equal("65280"); // happy path of colorhex in lowercase letters
    await expect(orange.aGetId("0000000")).to.be.revertedWithCustomError(
      orange,
      "InvalidColorhex"
    ); // hex, but too big
    await expect(orange.aGetId("00000")).to.be.revertedWithCustomError(
      orange,
      "InvalidColorhex"
    ); // hex, but too small
    await expect(orange.aGetId("")).to.be.revertedWithCustomError(
      orange,
      "InvalidColorhex"
    ); // hex, but way too small
    await expect(orange.aGetId("G0000G")).to.be.revertedWithCustomError(
      orange,
      "InvalidColorhex"
    ); // string, but not hex
    expect((await orange.aGetId("00FF00")).toString()).to.not.equal("65281"); // incorrect conversion
    expect((await orange.aGetId("000000")).toString()).to.equal("0"); // lowest colorhex value
    expect((await orange.aGetId("FFFFFF")).toString()).to.equal("16777215"); // highest colorhex value
    await expect(orange.aGetId({})).to.be.rejected; // empty input
  });
});

describe("A metaversal artist who wants to AVOID bad token content/name", function () {
  let orange;

  before(async function () {
    // setup for this 'describe' block
    Orange = await ethers.getContractFactory("PeachV12"); // get deployable contract
    mintPayment = ethers.parseEther("0.001");
  });

  beforeEach(async function () {
    // setup for each 'it' block
    [owner] = await ethers.getSigners(); // get list of ETH accounts, 1st is deployer
    orange = await upgrades.deployProxy(Orange, [owner.address], {
      initializer: "initialize",
      kind: "uups",
      timeout: 120000,
      gasLimit: 5000000,
    });
    await orange.waitForDeployment(); // wait for deployment completion
  });

  it("can not get the name of an unminted token", async function () {
    // try to get the name of a token yet to be created
    await orange.setToken("000001", "ineffably blue", { value: mintPayment });
    expect(await orange.getName("000001")).to.equal("ineffably blue");
    await expect(orange.getName("000002")).to.be.revertedWithCustomError(
      orange,
      "InvalidTokenId"
    );
  });

  it("can accept a no-length name", async function () {
    // actually, name of zero-length is OK
    await orange.setToken("000001", "", { value: mintPayment });
    expect((await orange.getName("000001")).length).to.equal(0);
  });

  it("can not accept an empty name", async function () {
    // minting with no name is not OK
    await expect(orange.setToken("000001", {}, { value: mintPayment })).to.be
      .rejected; // empty input
  });

  it("can not accept a too-long name", async function () {
    // trying to name a too-long name
    await expect(
      orange.setToken("000001", "abcdefghijklmnopqrstuvwxyz7890123", {
        value: mintPayment,
      })
    ).to.be.rejected;
  });

  // it("can not accept a multi-line name");
  // Eventually test for right-to-left names.
});

describe("A metaversal artist who wants to AVOID bad token style/picture", function () {
  let orange;

  before(async function () {
    // setup for this 'describe' block
    Orange = await ethers.getContractFactory("PeachV12"); // get deployable contract
  });

  beforeEach(async function () {
    // setup for each 'it' block
    [owner] = await ethers.getSigners(); // get list of ETH accounts, 1st is deployer
    orange = await upgrades.deployProxy(Orange, [owner.address], {
      initializer: "initialize",
      kind: "uups",
      timeout: 120000,
      gasLimit: 5000000,
    });
    await orange.waitForDeployment(); // wait for deployment completion
  });

  it("can get the pic of an unminted token", async function () {
    // actually can get the pic of a token yet to be created
    await expect(orange.tokenURI(51)).to.not.be.rejected;
  });

  it("can not accept a too-high tokenId", async function () {
    // trying to get the pic of a too-high tokenId
    await expect(orange.tokenURI(16777216)).to.be.revertedWithCustomError(
      orange,
      "InvalidTokenId"
    );
  });

  // it("can not accept a too-high style-ID");
  // it("can not accept a too-low style-ID");
  // it("can not accept a non-integer style-ID");
  // it("can not accept an empty style-ID");

  it("can not accept an improperly converted colorhex-ID", async function () {
    // converting from colorhex to decimal
    expect(await orange.getColorhex(65280)).to.equal("00FF00"); // happy path
    expect(await orange.getColorhex(65281)).to.not.equal("00FF00"); // incorrect conversion
    expect(await orange.getColorhex(0)).to.equal("000000"); // lowest decimal value
    expect(await orange.getColorhex(16777215)).to.equal("FFFFFF"); // highest decimal value
    await expect(orange.getColorhex(-1)).to.be.rejected; // too low (really: -1 is out of bounds for the uint type)
    await expect(orange.getColorhex({})).to.be.rejected; // empty input
    await expect(orange.getColorhex(16777216)).to.be.revertedWithCustomError(
      orange,
      "InvalidTokenId"
    ); // too high
  });
});

describe("An administrator who wants to ADMINISTER this contract", function () {
  let orange;

  before(async function () {
    // setup for this 'describe' block
    Orange = await ethers.getContractFactory("PeachV12"); // get deployable contract
    mintPayment = ethers.parseEther("0.001");
  });

  beforeEach(async function () {
    // setup for each 'it' block
    [owner, friend, stranger, villain] = await ethers.getSigners(); // get list of ETH accounts, 1st is deployer
    orange = await upgrades.deployProxy(Orange, [owner.address], {
      initializer: "initialize",
      kind: "uups",
      timeout: 120000,
      gasLimit: 5000000,
    });
    await orange.waitForDeployment(); // wait for deployment completion
  });

  /*
  it("can send funds on purpose", async function () {
    // exercise the receive() function
    // (bool success, ) = owner().call{value: balanceOfThisContract}(""); // call() doesn't require owner() wrapped in payable()
    // if (!success) revert WithdrawalFailed();
  });

  it("can send funds by mistake", async function () {
    // exercise the fallback() function
    // (bool success, ) = owner().call{value: balanceOfThisContract}(""); // call() doesn't require owner() wrapped in payable()
    // if (!success) revert WithdrawalFailed();
  });
  */

  it("can extract funds collected after numerous mints", async function () {
    await expect(orange.withdraw()).to.be.revertedWithCustomError(
      orange,
      "NothingToWithdraw"
    ); // attempting withdraw of nothing
    // mint, get owner balance before & after withdrawal, compare that difference to mint payment
    await orange
      .connect(friend)
      .setToken("000003", "off-black", { value: mintPayment }); // minting!
    await orange
      .connect(stranger)
      .setToken("000004", "off-off-black", { value: mintPayment }); // more minting!
    const orangeBalancePostMint = await ethers.provider.getBalance(
      await orange.getAddress()
    );
    // console.log(ethers.formatEther(orangeBalancePostMint)); // print that
    await expect(orange.connect(villain).withdraw()).to.be.rejected; // non-owner tries withdrawing
    const ownerBalanceBefore = await ethers.provider.getBalance(owner.address);
    await orange.connect(owner).withdraw(); // withdrawing!
    const ownerBalanceAfter = await ethers.provider.getBalance(owner.address);
    const ownerBalanceDiff = ownerBalanceAfter - ownerBalanceBefore;
    const ownerBalanceDiffInEth = ethers.formatEther(ownerBalanceDiff);
    const roundedOwnerBalanceDiffInEth =
      Math.round(ownerBalanceDiffInEth * 1e3) / 1e3;
    // console.log(roundedOwnerBalanceDiffInEth); // print that
    expect(await roundedOwnerBalanceDiffInEth.toString()).to.equal(
      ethers.formatEther(orangeBalancePostMint)
    ); // comparing!
  });

  it("can see if upgradeability has ended", async function () {
    expect(await orange.upgradeabilityEnded()).to.equal(false);
  });

  it("can end upgradeability", async function () {
    await expect(orange.connect(villain).endUpgradeability()).to.be.rejected; // non-owner tries ending upgradeability
    await expect(orange.connect(owner).endUpgradeability()).to.not.be.rejected; // owner ends upgradeability
    expect(await orange.upgradeabilityEnded()).to.equal(true);
  });

  it("can upgrade the contract", async function () {
    expect(await orange.upgradeabilityEnded()).to.equal(false);
    const PrevPeach = await ethers.getContractFactory("PeachV11");
    await upgrades.upgradeProxy(await orange.getAddress(), PrevPeach);
    await orange.endUpgradeability();
    expect(await orange.upgradeabilityEnded()).to.equal(true);
    await expect(
      upgrades.upgradeProxy(await orange.getAddress(), Orange)
    ).to.be.rejectedWith("Contract is not upgradeable");
  });
});

/* 
testing how (apply to each 'testing what'):
- easy to read & update
- target observable beh'r > implement'n details
- refactor common setup & verifications into own functions (use fixtures, before, beforeEach)
- order / function: happy cases, trigger req.s, (check modifiers,) edge cases
-- edge cases: at boundary, around boundary, empty input, assumptions
- clean Why / failure
- 100% code cover'ge (includes @ if-else branch)
- run in seconds

testing what (prioritized):
/ POC contract
/ change in storage var.s
/ unauthorized actions (access ctrl)
- .../...
- requires & error msg.s
- revert tx.s, w/ spec'c msg.s
- emit events, w/ spec'c msg.s
- function modifiers (remove & return 'em)
- change ETH balances
- deploy contracts
- destroy contracts
- reentrancy
- front-running

gas used:
const tx = await contract.someFn();
const receipt = await tx.wait();
console.log('Gas used: ${receipt.gasUsed.toString()}');

misc.:
ethers.deployContract ... deploys new smart contract
ethers.Contract ... create an instance of an already deployed contract
expect(tx).to.emit ... asserts whether a tx emits events
*/
