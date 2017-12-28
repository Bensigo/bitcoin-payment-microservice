# Micro Bitcoin Payment Service
  A micro service for adding bitcoin payment to your node application</br>

#### Prerequisites
To install  the module  you need to have node install in your loacl machine  and also npm / yarn.</br>

### Usage
To use with the micro service you need to install some module first with.
``` shell
  npm install --save bitcoin-payment-mircoservice
 ```
 Or you use yarn to install the package 
 ``` shell
  yarn add bitcoin-payment-mircoservice
  ``` 
then in, your javascript file.
```javascript
  const bitcoinPayment = require('bitcoin-payment-mircoservice')
```
To get the current bitcoin balance of an address
``` javascript
 const balance =  bitcoinPayment.getBalance(address) // return address balance
 console.log('bitcoin Balance', balance)
```
returns </br>
```
  bitcoin Balance 0.009797
 ```
To Generate a bitcoin address 
``` javascript
  const address = bitcoinPayment.createAddress() // return a bitcoin address with   private key
  console.log(address)
 ```
returns </br>
``` json
 {
   address: '1K3QovFjbXG9HMYSfTE8WMc7EHhhpJSGwT',
   privateKey: 'achgjxsdvhjahkjlxkdcbazagshkjlskncvgshjasluyihkjaknjxs'
 }
 // NOTE: Please always secure your private key
```
To send Bitcoin to an address</br>
``` javascript
 sendBTC (paperWallet, toAddress, amount, txID)
 // paperWallet - Generated address with private key to validate the transaction
 // amount -  amount to be sent
 // toAddress - Bitcoin address to receive the amount
 // txID - Transaction ID on the bitcoin ledger from the address on the paper wallet

``` 
</br>
To monitor a blockchain transaction on an address and transfer payment to a master address
</Br>
```
  finalizeTransaction (paperWallet, toMasterAddress, amount)
```
</br>
  ### Build With
  <ul>
    <li>Node Js - javascript runtime engine </li>
    </li>Bitcoin-live-transactions NPM package</li>
    <li>Bitcoinjs-lib from bitcoinjs</li>
    <li>Axios</li>
</ul>


 