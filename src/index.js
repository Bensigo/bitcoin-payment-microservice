const bitcoin = require('bitcoinjs-lib')
const BLT = require("bitcoin-live-transactions")
const axios = require('axios')

const transaction =  new BLT({testnet: true})

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
  // get the current bitcoin balance from address
  getBalance (address) {
    axios.get(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/balance`)
    .then(res => {
      const amount = res.data.balance/100000000
      console.log(planAmount)
      return amount
  
    })
    .catch(err => {
      console.log(err)
    })
  },
  sendBTC (paperWallet, toAddress, amount, txID) {
    const address = paperWallet.address
    const txb = new bitcoin.TransactionBuilder()
      txb.addInput(txID , 0)
      txb.addOutput(toAddress, amount)
      txb.sign(0, paperWallet.address)
      txb.build().toHex() 
      transaction.connect()
      transaction.events.on(toAddress, tx => {
        if (tx !== null) {
          console.log('transfer successful')
          return 'transfer successful'
        } else {
          console.log('transfer failed')
          return 'transfer failed'
        }
      })
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

