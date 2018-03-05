const bitcoin = require('bitcoinjs-lib')
const axios = require('axios')
const bitcore = require('bitcore-lib')
const explorer = require('bitcore-explorers')
const BLT = require('bitcoin-live-transactions')



module.exports  = {
  //Generate bitcoin address for the user to send money and also to listen for transaction
  createAddress () {
    const privateKey =  bitcoin.ECPair.makeRandom().toWIF()
    const keyPair = bitcoin.ECPair.fromWIF(privateKey)
    const address = keyPair.getAddress()
    const paperWallet = {address, privateKey}
    
    return paperWallet
  },
  createTestnetAddress () {
    const testnet = bitcoin.networks.testnet
    const keyPair =  bitcoin.ECPair.makeRandom({network: testnet})
    const privateKey = keyPair.toWIF()
    const address = keyPair.getAddress()
    const paperWallet = {address, privateKey}
    
    return paperWallet

  },
  // get the current bitcoin balance from address network : main || test3
   getBalance (address, network) {
   const result =  axios.get(`https://api.blockcypher.com/v1/btc/${network}/addrs/${address}/balance`)
    .then(res => {
      const data = res.data
      console.log(JSON.stringify(data))
      return data
  
    })
    .catch(err => {
      console.log(err)
    })
    return result
  },
  sendBTC (paperWallet, toAddress, amount, network) {
    const insight = new explorer.Insight(network)
    var transactionId;
    const fee = amount * 0.1
    //get unsent tx from address 
    insight.getUnspentUtxos(paperWallet.address, (err, utxo) => {
      // create a transaction
      if (err) {
        console.log(err)
      }else {
        const tx = bitcore.Transaction()
        .from(utxo)
        .to(toAddress, amount) // in satoshi
        .fee(amount)
        .sign(paperWallet.privateKey)
        .serialize()
        // push transaction to the blockchain network 
        insight.broadcast(tx, (err, txid) => {
          if (err) {
            console.log(err)
          }
          console.log('transaction sent(id): ' + txid)
          transactionId = txid
          

        })

      }

    })
    return transactionId
  },
  litenToLiveTransaction(address) {
    const BTC = new BLT() 
    // connect to netwotk 
    BTC.connect()
    console.log('connected to the btc p2p network')
    return BTC.events.on(address, (tx) => {
      console.log('transaction decected:', tx)
      return tx
    })

  }
}

const blockchain = require('./index')

const listen = blockchain.litenToLiveTransaction(
  "1PYBNfrdQW4cbiRpmHRY3X8MypuYznfdr8"
);
console.log(listen)
