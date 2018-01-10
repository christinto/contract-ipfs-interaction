## IPFS smart contract interaction

Simple coordination between smart contract and IPFS, with the smart contract storing a reference to the content (under the owner's IPFS Peer ID). A node script registers the reference on the smart contract, queries the contract to retrieve the Peer ID and then uses that to query IPFS to retreive the content. 

#### Setup and Run
```
ipfs init
ipfs daemon                         (in separate process)
ipfs add -r files
ipfs name publish <hash of files directory>
npm install
node_modules/.bin/testrpc -u 0      (in separate process)
node_modules/.bin/truffle migrate
ADDR=<deployed Referrer contract address> node index.js
```

Example Input and Output:
```
$ ADDR=0xe77eed3f804ab8deaff0c08bc27d29034a93024e node index.js
referring QmaYHxkyuGM85szoMVSbgTiyTC5QFz62sGCJHCBwL9Qazv to owner 0x13443EC9c7F7646A0573185138F4697D0ce0229A
reference successfully stored on blockchain
0x01 owned by Bob Fossil
0x02 owned by Dixon Bainbridge
```

**IPFS filesystem**
- add directory
```
ipfs add -r <dir>
```
- list contents of directory
```
ipfs ls /ipfs/<hash>/
```
- show file contents
```
ipfs cat /ipfs/<hash>/<filename>
```

**IPNS**
- publish directory
```
ipfs name publish <hash>
```
- resolve actual directory location
```
ipfs name resolve <peer id>
```
- publish update
```
ipfs name publish <new hash>
```
