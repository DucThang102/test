import React, { useEffect, useState } from 'react';

import './App.css';
import { Form, Input, Button, Slider } from 'antd';
import ItemProject from './components/ItemProject';
import { getFundedProjects, calculateTransactionsBlock } from "./services/ProjectServices"

function App() {
  const [formFilter] = Form.useForm();

  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10
  })
  const [fundedProjects, setFundedProjects] = useState([])
  const [totalRecord, setTotalRecord] = useState(0)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [avgBlockTime, setAvgBlockTime] = useState(0)
  const [avgEthTransaction, setAvgEthTransaction] = useState(0)
  const [secondMaxTx, setSecondMaxTx] = useState()

  useEffect(() => {
    statisticTransactions()
    loadProjects(filters)
  }, [])

  const loadProjects = (filters) => {
    getFundedProjects(filters).then(res => {
      if (res.status === 200 && res.data.statusCode === 1) {
        setFundedProjects(res.data.data.fundProjects)
        setTotalRecord(res.data.data.totalRecords)
      }
    }).catch(ex => {
      console.log("getFundedProjects err ", ex);
    })
  }

  const onSubmitFilter = () => {
    loadProjects(filters)
  }

  const statisticTransactions = async () => {
    let result = await calculateTransactionsBlock()

    console.log("statisticTransactions", result);
    setTotalTransactions(result.totalTransactions)
    setAvgEthTransaction(result.avgEthPerTx)
    setSecondMaxTx(result.secondMax)
    setAvgBlockTime(result.avgBlockTime.toFixed(2))
  }

  return (
    <div className='app'>
      <p className='largest-tx-title'>2nd largest  of Transactions:</p>
      <p className='largest-tx-val'>{secondMaxTx?.ether.toFixed(5) || 0} ETH</p>
      <div className='flex-row calculate-result'>
        <div className='flex-1 flex-col text-center'>
          <div className='flex-row item-center text-center'>
            <img className='img-coin' src='img/Coin.png'></img>
            <p className='title-transaction'>Total transactions:</p>
          </div>
          <p className='total-transaction text-center'>{totalTransactions}</p>
        </div>
        <div className='flex-1 flex-col text-center'>
          <div className='flex-row item-center text-center'>
            <img className='img-coin' src='img/Coin.png'></img>
            <p className='avg-block-time'>AVG of block time</p>
          </div>
          <p className='total-transaction text-center'>{avgBlockTime}</p>
        </div>
        <div className='flex-1 flex-col text-center'>
          <div className='flex-row item-center text-center'>
            <img className='img-coin' src='img/Coin.png'></img>
            <p className='avg-eth'>AVG of ETH/transactions</p>
          </div>
          <p className='total-transaction text-center'>{avgEthTransaction}</p>
        </div>
      </div>
      <div className='form-filter'>
        <Form
          className='flex-row item-center'
          layout='vertical'
          form={formFilter}
        >
          <Form.Item
            className='flex-1 pr-10'
            label="Name">
            <Input onChange={(e) => setFilters({ ...filters, name: e.target.value })} placeholder="input name" />
          </Form.Item>
          <Form.Item
            className='flex-1 pr-10'
            label="Symbol">
            <Input onChange={(e) => setFilters({ ...filters, symbol: e.target.value })} placeholder="input symbol" />
          </Form.Item>
          <Form.Item
            className='flex-1 pr-10'
            label="Status">
            <Input placeholder="input status" onChange={(e) => setFilters({ ...filters, status: e.target.value })} />
          </Form.Item>
          <Form.Item
            className='flex-1 pr-10'
            label="Total raise">
            <Slider className='flex-1' min={0} max={100000} range defaultValue={[20, 50]} />
          </Form.Item>
          <Form.Item
            className='flex-1 pr-10'
            label="Personal Allocation">
            <Slider className='flex-1' min={0} max={1} range defaultValue={[0, 0.09]} />
          </Form.Item>
          <Form.Item
            className='flex-1' >
            <Button onClick={() => onSubmitFilter()} type="primary">Filter</Button>
          </Form.Item>
        </Form>
      </div>

      <div className='list-items'>
        {fundedProjects.map((item) =>
          <ItemProject data={item}></ItemProject>
        )}
      </div>
    </div>
  );
}

export default App;
