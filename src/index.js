const bitcoin = require('bitcoinjs-lib')
const axios = require('axios')
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
  toSatoshis(amount){
    return amount * 100000000
  },
  toBTC(amount){
    return amount / 100000000;
  },
  // get the current bitcoin balance from address network : main || test3
   getBalance (address, network) {
   const result =  axios.get(`https://api.blockcypher.com/v1/btc/${network}/addrs/${address}/balance`)
    .then(res => {
      const data = res.data
       const response= JSON.stringify(data)
       const obj = JSON.parse(response)
       console.log(obj)
       return obj
  
    })
    .catch(err => {
      console.log(err)
    })
    return result
  },
  async getTransactionFee (){
    console.log('getting transacction fee ..................')
    const feePerHour = await axios.get("https://bitcoinfees.earn.com/api/v1/fees/recommended")
      .then(res => {
          const feePerSatoshis = res.data.hourFee;
          return feePerSatoshis 
      })
      .catch(err => {
        console.log(err)
        return
      })
      const txfee = feePerHour * 225 // fees in satoshis
      return JSON.stringify(txfee);

  },
  async sendBTC (paperWallet, toAddress, amount, network) {
    const insight = new explorer.Insight(network)
    const fee = await this.getTransactionFee()
    console.log(fee)
    const amt = (this.toSatoshis(amount) - fee)
    let transactionId;
    console.log(amt)       
    //get unsent tx from address 
    insight.getUnspentUtxos(paperWallet.address, (err, utxo) => {
      // create a transaction
      if (err) {
        console.log(err)
      }else {
        const obj = JSON.stringify(utxo[0])
        const txid = JSON.parse(obj).txid
        console.log(txid);
        const netwk = network === 'testnet' ? bitcoin.networks.testnet : bitcoin.networks.bitcoin
        const pubKey = bitcoin.ECPair.fromWIF(paperWallet.privateKey, netwk)
        const txb = new bitcoin.TransactionBuilder(netwk)
        txb.addInput(txid, 0)
        txb.addOutput(toAddress, amt)
        txb.sign(0, pubKey)
        const  txHex =txb.build().toHex();
         // push transaction to the blockchain network 
        return insight.broadcast(txHex, (err, txid) => {
          if (err) {
             console.log(err)
             const error = new Error("error why handling transaction");
             return JSON.stringify(error)
          }else {
            console.log('transaction sent(id): ' + txid)
            transactionId = txid
            return transactionId
          }
        })

      }

    })
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

// console.log(blockchain.litenToLiveTransaction("mi3StR8GVGzL7SH5QQutArRN7LY8XQX9Ud"));
// console.log(blockchain.createTestnetAddress())
// console.log(blockchain.getTransactionFee())
// const paperW = {
//   address: "mvXiMNTyrX8ukq7pJp4HygMcCKwPubtmoy",
//   privateKey: "cUu337rR9kcRWkgFQtCNfkvHToM5qGfiJ4XLj1tZ522x2bHuZoAk"
// };
// blockchain.sendBTC(paperW, 'mtUcYf3dFdUXH4MeXhpXdkU3gp6dBirzhA', 0.4, 'testnet')
