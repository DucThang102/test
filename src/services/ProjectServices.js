import axios from "axios";
import Web3 from 'web3';
import {ethers} from 'ethers';
import ERC20ABI from "../contract-abis/ERC20.json"
const abiDecoder = require('abi-decoder');

export const getFundedProjects = (filter) => {
    return axios.post("http://139.99.62.190:8000/api/v1/fund_projects/filter ", { ...filter })
}

export const getTransactionsByEther =  async () => {
    const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_PROVIDER)
    const blockTx = await provider.getBlockWithTransactions(10441830)
    console.log("blockTx ", blockTx);
}

export const calculateTransactionsBlock = async () => {
    abiDecoder.addABI(ERC20ABI)

    const web3 = new Web3(new Web3.providers.HttpProvider(process.env.REACT_APP_PROVIDER))

    const fromBlock = 10441830
    const toBlock = 10441840
    let totalTx = 0
    let transactions = []
    let ethAllTransactions = 0
    let arrBlockData = []

    for (let block = fromBlock; block <= toBlock; block++) {
        let blockData = await web3.eth.getBlock(block, true)
        arrBlockData.push(blockData)

        totalTx += blockData.transactions.length
        let blockTransactions = blockData.transactions.map(tx => {
            tx["ether"] = tx.value / (10 ** 18)
            ethAllTransactions += tx.ether
            return tx
        })
        transactions.push(...blockTransactions)
    }
    let avgEth = ethAllTransactions / totalTx

    const secondMaxTx = findSecondMaxInArray(transactions)
    const maxTx = findMax(transactions)

    return {
        totalTransactions: totalTx,
        avgEthPerTx: avgEth.toFixed(5),
        secondMax: secondMaxTx,
        maxTx: maxTx,
        avgBlockTime: calcAvgBlockTime(arrBlockData)
    }
}

const decodedDataInputOfTx = (encodedData) => {
    let rawData = !encodedData ? null : abiDecoder.decodeMethod(encodedData, (err, res) => {
        if (err) return
        return res
    })
    return Object(rawData);
}

const mapEtherOfTransaction = (tx) => {
    // let decodedData = decodedDataInputOfTx(Object(tx).input)

    // if (decodedData.name !== 'transfer' && decodedData.name !== 'transferFrom') {
        // tx["ether"] = tx.value / (10 ** 18)
    // } else {
    //     if (decodedData.name === 'transfer') {
    //         let ether = decodedData.params[1].value
    //         tx["ether"] = ether / (10 ** 18)
    //     } else if (decodedData.name === 'transferFrom') {
    //         let ether = decodedData.params[2].value
    //         tx["ether"] = ether / (10 ** 18)
    //     }
    // }
    return tx
}

const findSecondMaxInArray = (txs) => {
    let firstMax, secondMax;
    if (txs[0].ether > txs[1].ether) {
        firstMax = txs[0];
        secondMax = txs[1];
    } else {
        firstMax = txs[1];
        secondMax = txs[0];
    }
    for (let i = 2; i < txs.length; i++) {
        if (txs[i].ether >= firstMax.ether) {
            secondMax = firstMax;
            firstMax = txs[i];
        } else if (txs[i].ether > secondMax.ether) {
            secondMax = txs[i];
        }
    }
    return secondMax;
}

const findMax = (txs) => {
    let max = txs[0]
    for (let i = 1; i < txs.length; i++) {
        if (txs[i].ether >= max.ether) {
            max = txs[i]
        }
    }
    return max
}

const calcAvgBlockTime = (arrBlockData) => {
    let totalBlockTime = 0
    let beforeBlockTime, afterBlockTime
    if (arrBlockData.length > 2) {
        for (let i = 0; i < arrBlockData.length - 1; i++) {
            beforeBlockTime = arrBlockData[i].timestamp
            afterBlockTime = arrBlockData[i + 1].timestamp
            totalBlockTime += afterBlockTime - beforeBlockTime
        }
        return totalBlockTime / (arrBlockData.length - 1)
    }
}