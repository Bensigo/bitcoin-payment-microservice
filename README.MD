# Micro Bitcoin Payment Service
  A micro service for adding bitcoin payment to your node application. using node 8.0</br>

#### Prerequisites
To install  the module  you need to have node install in your loacl machine  and also npm / yarn.</br>

### Testing
To run a unit test run the following command
```javascript
  npm run test
```

### Usage
To use with the micro service you need to install some module first with.
```javascript
  npm install --save bitcoin-payment-mircoservice
 ```
 Or you use yarn to install the package 
 ```javascript 
  yarn add bitcoin-payment-mircoservice
  ``` 
then in, your javascript file.
```javascript
  const bitcoinPayment = require('bitcoin-payment-mircoservice')
```
To get the current bitcoin balance of an address
```javascript
 const balance =  bitcoinPayment.getBalance(address) // return address balance
 console.log('bitcoin Balance', balance)
```
returns </br>
```javascript
  bitcoin Balance 0.009797
 ```
To Generate a bitcoin address 
```javascript 
  const address = bitcoinPayment.createAddress() // return a bitcoin address with   private key
  console.log(address)
 ```
returns </br>
```javascript
 {
   address: '1K3QovFjbXG9HMYSfTE8WMc7EHhhpJSGwT',
   privateKey: 'achgjxsdvhjahkjlxkdcbazagshkjlskncvgshjasluyihkjaknjxs'
 }
 ** NOTE: Please always secure your private key
```
To send Bitcoin to an address</br>
```javascript
 sendBTC (paperWallet, toAddress, amount, network) =>  transactionID
 // paperWallet - Generated address with private key to validate the transaction
 // amount -  amount to be sent in satoshi
 // toAddress - Bitcoin address to receive the amount
 // network - which could either 'testnet' or 'livenet/mainnet'

``` 
## To listen to an address on a network for transaction
```javascript
  bitcoinPayment.litenToLiveTransaction(address) => tx
```
 Will trigger the event in real time if a payment is done to that address:
 ```javascript
  Transaction detected! { address: '138WJKb1mXbkRGNpyMVEZ9EsoXjMEvJfT4',
  amount: 381000 }
```


</Br>
 ### Build With
  <ul>
    <li>Node Js - javascript runtime engine </li>
    </li>Bitcoin-live-transactions NPM package</li>
    <li>Bitcoinjs-lib from bitcoinjs</li>
    <li>Bitcore-lib from bitcore-lib</li>
    <li>Bitcore-explorers from Bitcore-explorers</li>
    <li>Axios</li>
</ul>


 
