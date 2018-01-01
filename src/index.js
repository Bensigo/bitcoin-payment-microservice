const bitcoin = require('bitcoinjs-lib')
const BLT = require("bitcoin-live-transactions")
const axios = require('axios')
const transaction =  new BLT()



module.exports  = {
  //Generate bitcoin address for the user to send money and also to listen for transaction
  createAddress () {
    const privateKey =  bitcoin.ECPair.makeRandom().toWIF()
    const keyPair = bitcoin.ECPair.fromWIF(privateKey)
    const address = keyPair.getAddress()
    const paperWallet = {address, privateKey}
    console.log(paperWallet)
    return paperWallet
  },
  createTestnetAddress () {
    const testnet = bitcoin.networks.testnet
    const keyPair =  bitcoin.ECPair.makeRandom({network: testnet})
    const privateKey = keyPair.toWIF()
    const address = keyPair.getAddress()
    const paperWallet = {address, privateKey}
    console.log(paperWallet)
    return paperWallet

  },
  // get the current bitcoin balance from address network : main || test3
  getBalance (address, network) {
    axios.get(`https://api.blockcypher.com/v1/btc/${network}/addrs/${address}/balance`)
    .then(res => {
      const amount = res.data.balance/100000000
      return amount
  
    })
    .catch(err => {
      console.log(err)
    })
  },
  sendBTC (paperWallet, toAddress, amount, txID) {
    const address = bitcoin.ECPair.fromWIF(paperWallet.privateKey)
    const txb = new bitcoin.TransactionBuilder()
      txb.addInput(txID , 0) // previous transactionId from the address at index 0
      txb.addOutput(toAddress, amount) 
      txb.sign(0, address)
      txb.build().toHex() 
  },
  sendTestnetBTC (paperWallet, toAddress, amount, txID) {
    const address = bitcoin.ECPair.fromWIF(paperWallet.privateKey, bitcoin.networks.testnet)
    const txb = new bitcoin.TransactionBuilder(bitcoin.networks.testnet)
      txb.addInput(txID , 0) // previous transactionId from the address at index 0
      txb.addOutput(toAddress, amount) 
      txb.sign(0, address)
      txb.build().toHex() 
  },
  /*
Generated bitcoin address is fetched to be listened to for transaction
If the transaction has been made with the designated amount
Transaction is a made using the public and private key to send amount to master-address
*/
  finalizeTransaction (paperWallet, toMasterAddress, planAmount) {
    console.log('about to start  listening')
    transaction.events.on(paperWallet.address, tx => {
      console.log('start listening to transaction on :', paperWallet.address)
      if (tx) {
        console.log('transaction detected', tx)
        const balance =  getBalance(paperWallet.address)
        if (tx.amount === planAmount) {
          // send a transaction
          sendTransaction(paperWallet, toMasterAddress, balance, tx.txid)
          console.log('plan have been successfully purchased')
        } else {
          // NOTE:  make a refund if asked for fund
          sendTransaction(paperWallet, toMasterAddress, balance, tx.txid) 
        }
      } else {
        console.log('Transaction not found ')
        return 'Transaction not found '
  
      }
    })
  }
  
  
} 

