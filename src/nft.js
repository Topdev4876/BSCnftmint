import React,{useEffect, useState} from "react";

const BigNumber = require('bignumber.js');

export default function NFT({data}) {
  return (
    <div class = "item">
      {
        data?
        <div class = 'card'>
          <img class="card-img-top" src={data[0]} alt="Card image"></img>
          <div class="card-img-overlay">
            <div className="bottom">
              <div class="card-text">Level:{BigNumber(data[1][1]._hex).toString()} Speed:{BigNumber(data[1][2]._hex).toString()}</div>
              <div class="card-text">Beauty:{BigNumber(data[1][3]._hex).toString()} Strength:{BigNumber(data[1][4]._hex).toString()}</div>
            </div>
          </div>
            
      </div>
      :
      <></>
      }
    </div>
    
  );
}
