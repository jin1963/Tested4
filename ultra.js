let web3;
let contract;
let tokenContract;
let account;

const CONTRACT_ADDRESS = "0x18d9d27fbf87306aefe2a4a9c1d9e62ccb3635f0";
const TOKEN_ADDRESS = "0x65e47d9bd03c73021858ab2e1acb2cab38d9b039";

window.onload = async () => {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        document.getElementById("connectButton").onclick = connectWallet;
        document.getElementById("approveButton").onclick = approveTokens;
        document.getElementById("stakeButton").onclick = stakeTokens;
        document.getElementById("claimButton").onclick = claimRewards;
        document.getElementById("unstakeButton").onclick = unstakeTokens;
    } else {
        alert("Please install MetaMask.");
    }
};

async function connectWallet() {
    const accounts = await ethereum.request({ method: "eth_requestAccounts" });
    account = accounts[0];
    contract = new web3.eth.Contract(stakingABI, CONTRACT_ADDRESS);
    tokenContract = new web3.eth.Contract([
        { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" }
    ], TOKEN_ADDRESS);
    document.getElementById("walletAddress").innerText = account;
}

async function approveTokens() {
    const amount = document.getElementById("amountInput").value;
    const amountWei = web3.utils.toWei(amount, "ether");
    await tokenContract.methods.approve(CONTRACT_ADDRESS, amountWei).send({ from: account });
    alert("Token Approved");
}

async function stakeTokens() {
    const amount = document.getElementById("amountInput").value;
    const duration = document.getElementById("tierSelect").value;
    const amountWei = web3.utils.toWei(amount, "ether");
    await contract.methods.stake(amountWei, duration).send({ from: account });
    alert("Stake Successful");
}

async function claimRewards() {
    const index = document.getElementById("stakeIndexInput").value;
    await contract.methods.claim(index).send({ from: account });
    alert("Claim Successful");
}

async function unstakeTokens() {
    const index = document.getElementById("stakeIndexInput").value;
    await contract.methods.unstake(index).send({ from: account });
    alert("Unstake Successful");
}
