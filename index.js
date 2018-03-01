const Web3 = require('web3');
const ipfsApi = require('ipfs-api');

const web3 = new Web3('http://localhost:8545');
const ipfs = ipfsApi();

//For this example, Referrer was name of contract.
// ADDR is the address of the deployed contract from truffle migrate contract deployment
const referrerAddress = process.env.ADDR;
const referrerAbi = require('./build/contracts/Referrer.json').abi;

const referrer = new web3.eth.Contract(referrerAbi, referrerAddress);

ipfs.config.get('Identity.PeerID')
    .then(async id => await refer(id))
    .then(async (peerId) => await displayOperatorNames(peerId));

async function refer(peerId) {
    const accounts = await web3.eth.getAccounts();
    console.log(`referring ${peerId} to owner ${accounts[0]}`);
    const gas = await referrer.methods.refer(peerId).estimateGas();
    const res = await referrer.methods.refer(peerId).send({from: accounts[0], gas: gas});
    const contractState = await referrer.methods.locations(accounts[0]).call();
    const success = peerId === contractState ? true : false;
    console.log(`reference ${success} stored on blockchain`);
    return contractState;
}

// looks for contract address and then the json properties of the uploaded files, id & owner.name
async function displayOperatorNames(peerId) {
    console.log('retreiving content from ipfs');
    const location = await ipfs.name.resolve(peerId);
    console.log("location of IPFS name", location);
    const files = await ipfs.files.get(location.Path);
    files.forEach(file => {
        if (file.content) {
            const content = JSON.parse(file.content.toString());
            const id = content.id;
            const name = content.owner.name;
            console.log(`${id} owned by ${name}`);
        }
    });
}

