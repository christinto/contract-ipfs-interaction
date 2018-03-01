const Web3 = require('web3');
const ipfsApi = require('ipfs-api');

const web3 = new Web3('http://localhost:8545');
const ipfs = ipfsApi();

//For this example, Referrer was name of contract.
// ADDR is the contract address location from truffle migrate contract deployment
const referrerAddress = process.env.ADDR;
const referrerAbi = require('./build/contracts/Referrer.json').abi;

const referrer = new web3.eth.Contract(referrerAbi, referrerAddress);

ipfs.config.get('Identity.PeerID')
    .then(async id => await refer(id))
    .then(async (referralAddress) => await displayOperatorNames(referralAddress))

async function refer(content) {
    const accounts = await web3.eth.getAccounts();
    console.log(`referring ${content} to owner ${accounts[0]}`);
    const gas = await referrer.methods.refer(content).estimateGas();
    const res = await referrer.methods.refer(content).send({from: accounts[0], gas: gas});
    const contractState = await referrer.methods.locations(accounts[0]).call();
    const success = content === contractState ? 'successfully' : 'unsuccessfully';
    console.log(`reference ${success} stored on blockchain`);
    return contractState;
}

// looks for contract address and then the json properties of the uploaded files, owner.name 
async function displayOperatorNames(referralAddress) {
    console.log('retreiving content from ipfs');
    const location = await ipfs.name.resolve(referralAddress);
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

