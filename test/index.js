const mocha = require('mocha')
const should = require('chai').should()
const blockchain = require('../src/index')
const assert = require('assert')

describe('Address', () => {
  it("genereate a testnet bitcoin address with private key",  (done) => {
     const paperWallet =  blockchain.createTestnetAddress()
     // check if the address created is an object and contain address & privateKey
     paperWallet.should.be.ok
     paperWallet.should.be.a('object')
     paperWallet.should.have.property('address')
     paperWallet.should.have.property('privateKey')
     done()
  });
  it(" generate a mainnet bitcoin address with a private key", (done) => {
    const paperWallet = blockchain.createAddress()
    paperWallet.should.be.ok;
    paperWallet.should.be.a("object");
    paperWallet.should.have.property("address");
    paperWallet.should.have.property("privateKey");
    done();
  })
})

describe('convertion', () => {
  it ('convert bitcoin to satoshis', () => {
    const satoshis = blockchain.toSatoshis(0.01)
    satoshis.should.be.ok
    satoshis.should.be.a('number')
    satoshis.should.be.equal(1000000)
  })
  it('convert satoshis to bitcoin', () => {
    const btc = blockchain.toBTC(1000000)
    btc.should.be.ok
    btc.should.be.a('number')
    btc.should.be.equal(0.01)
  })
})

describe('balance and transaction fee', () => { 
  it('Get balnance from an address on testnet', async () => {
    const response = await  blockchain.getBalance("mvXiMNTyrX8ukq7pJp4HygMcCKwPubtmoy", 'test3');
    response.should.be.ok
    response.should.be.a("object");
    response.should.have.property('balance')
  })
  it("Get transaction fee ", async () => {
    const response = await  blockchain.getTransactionFee()
    response.should.be.ok
    response.should.be.a('string')
  })
})

describe('send  bitcoin', () => {
  let paperWallet ;
  before(' gererate a bitcoin address', async () => {
      paperWallet = await blockchain.createTestnetAddress()
  })
  it ('send bitcoin to a testnet address',  (done) => {
      const response =  blockchain.sendBTC(paperWallet, 'mvXiMNTyrX8ukq7pJp4HygMcCKwPubtmoy', 0.04, 'testnet')
      response.should.be.ok
      done()
  })
})

