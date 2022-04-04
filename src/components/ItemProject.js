
import React, { useEffect, useState } from 'react';
import './styles.css';
const ItemProject = ({data}) => {

    return (
        <div className='item'>
            <div className='cover-container'>
                <div className='status'>{data?.status}</div>
                <img className='cover-photo' src={data?.coverPhoto}></img>
                <img className='photo' src={data?.photo}></img>
            </div>
            <div className='flex-row'>
                <div className='name flex-1'>{data?.name}</div>
                <img className='icon-network' width={32} height={32} src='/img/Coin.png' />
            </div>
            <div className='symbol'>${data?.symbol}</div>
            <div className='flex-row'>
                <div className='flex-1 total-raise-title'>Total raise</div>
                <div className='total-raise'>${data?.totalRaise}</div>
            </div>
            <div className='flex-row'>
                <div className='flex-1 total-raise-title'>Personal Allocation</div>
                <div className='total-raise'>${data?.personalAllocation}</div>
            </div>
            <div className='flex-row date'>
                <div className='total-raise-title'>IDO starts on </div>
                <div className='total-raise-title'> {data?.startOn}</div>
            </div>
        </div>
    )

}
export default ItemProject