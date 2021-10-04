import Web3 from 'web3';
import NameStore from '../build/contracts/NameStore.json';

let web3;
let nameStore;

/* Initializing Web3 plugin (e.g., MetaMask) detection */
const initWeb3 = () => {
    return new Promise((resolve, reject) => {
      if(typeof window.ethereum !== 'undefined') {
        const web3 = new Web3(window.ethereum);
        window.ethereum.enable()
          .then(() => {
            resolve(
              new Web3(window.ethereum)
            );
          })
          .catch(e => {
            reject(e);
          });
        return;
      }
      if(typeof window.web3 !== 'undefined') {
        return resolve(
          new Web3(window.web3.currentProvider)
        );
      }
      resolve(new Web3('http://localhost:9545'));
    });
};

/* Initializing contract */
const initContract = () => {
    const deploymentKey = Object.keys(NameStore.networks)[0];
    return new web3.eth.Contract(
      NameStore.abi, 
      NameStore
        .networks[deploymentKey]
        .address
    );
};

/* Initializing dapp */
const initApp = () => {
      const $setName = document.getElementById('setName');
      const $setNameResult = document.getElementById('setNameResult');
      const $readName = document.getElementById('readName');
      const $readNameResult = document.getElementById('readNameResult');
      const $networkType = document.getElementById('networkType');
      const $balance = document.getElementById('balance');

      /* Creating 'accounts' array to store user address(es) */
      let accounts = [];

    /* Retrieving accounts */
      web3.eth.getAccounts()
      .then(_accounts => {
        accounts = _accounts;
      });

      /* Network type retrieval must be executed asynchronously */
    async function _getNetworkType() {
        await web3.eth.net.getNetworkType().then(result => {
                $networkType.innerHTML = `Connected to "${result}"`
              })
              .catch(_e => {
                $networkType.innerHTML = `Error retrieving network type`;
              });
    }
    _getNetworkType();


    /* Account balance retrieval must be executed asynchronously */
    const get_eth_balance = async () => {

        await web3.eth.getBalance(accounts[0]).then(result => {
            $balance.innerHTML = `${result}`
      }).catch(_e => {
            $balance.innerHTML = `Error retrieving balance`;
      });
    }
    get_eth_balance();

    /* Logic/event listener instantiation for setting name on front end */
      $setName.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = e.target.elements[0].value;
        nameStore.methods.setName(name).send({from: accounts[0]})
        .then(result => {
          $setNameResult.innerHTML = `"${name}" successfully set`;
        })
        .catch(_e => {
          $setNameResult.innerHTML = `Error setting name`;
        });
      });

      /* Logic for calling readName() fn of contract which is outputted */
      /* (Confirms displayed name is being read from on-chain data) */
      $readName.addEventListener('submit', (e) => {
        e.preventDefault();
        nameStore.methods.readName().call()
        .then(result => {
          $readNameResult.innerHTML = `Stored name is ${result}`;
        })
        .catch(_e => {
          $readNameResult.innerHTML = `Error retrieving name`;
        });
    });
}

/* Instantiating necessary previously defined functions upon page load */
document.addEventListener('DOMContentLoaded', () => {
    initWeb3()
      .then(_web3 => {
        web3 = _web3;
        nameStore = initContract();
        initApp(); 
      })
    .catch(e => console.log(e.message));
});