import React, { useState, useEffect } from 'react';

import Web3 from 'web3'
import { newKitFromWeb3 } from '@celo/contractkit';
import BigNumber from "bignumber.js";

import cardealer from './abis/car.abi.json';
import erc20 from './abis/irc.abi.json';


import Header from './components/Header';
import SalesCars from './components/SalesCars';
import AddCar from './components/AddCar';
import MyCar from './components/MyCar';

const ERC20_DECIMALS = 18;

const contractAddress = "0x9c3b1D7B63052D74D664D8dC7123b16A7358554A";
const cUSDContractAddress = "0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1";


function App() {

  const [celoBalance, setCeloBalance] = useState(0);
  const [contract, setcontract] = useState(null);
  const [address, setAddress] = useState(null);
  const [kit, setKit] = useState(null);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [cars, setCars] = useState([]);
  const [myCars, setMyCars] = useState([]);


  const connectCeloWallet = async () => {
    if (window.celo) {
      try {
        await window.celo.enable();
        const web3 = new Web3(window.celo);
        let kit = newKitFromWeb3(web3);

        const accounts = await kit.web3.eth.getAccounts();
        const user_address = accounts[0];

        kit.defaultAccount = user_address;

        await setAddress(user_address);
        await setKit(kit);

      } catch (error) {
        console.log('There is an error')
        console.log({ error });
      }
    } else {
      console.log("please install the extension");
    }
  };

  useEffect(() => {
    connectCeloWallet();
  }, []);

  useEffect(() => {
    if (kit && address) {
      return getBalance();
    } else {
      console.log("no kit or address");
    }
  }, [kit, address]);

  useEffect(() => {
    if (contract) {
      getCars()
    };
  }, [contract]);

  const getBalance = async () => {
    
    const balance = await kit.getTotalBalance(address);
    const celoBalance = balance.CELO.shiftedBy(-ERC20_DECIMALS).toFixed(2);
    const USDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2);

    const contract = new kit.web3.eth.Contract(cardealer, contractAddress);
    setcontract(contract);
    setCeloBalance(celoBalance);
    setcUSDBalance(USDBalance);
  };

  // function to get the list of cars from the celo blockchain
  const getCars = async function () {
    const carLength = await contract.methods.getCarLength().call();
    const _cars = [];

    for (let index = 0; index < carLength; index++) {
      let _car = new Promise(async (resolve, reject) => {
        let c = await contract.methods.getCar(index).call();
        resolve({
          index: index,
          owner: c[0],
          carName: c[1],
          carDescription: c[2],
          carImage: c[3],
          price: new BigNumber(c[4]),
          isUsed: c[5],
          isBought: c[6],
        })
      });

      _cars.push(_car);
    }
    const cars = await Promise.all(_cars);   
    setCars(cars);
    console.log(cars);
    // return cars that have been bought
    const _myCars = cars.filter((car)=>{
      return (car.owner === address && (car.isBought === true ));
    })    
    setMyCars(_myCars);
    
  }

  // function to add cars to block
  const addtoCars = async (_name, _description, _image, _price, _isUsed) => {
    try {
      const price = new BigNumber(_price)
        .shiftedBy(ERC20_DECIMALS).toString();


      await contract.methods
        .setCar(
          _name,
          _description,
          _image,
          _isUsed,
          price
        )
        .send({ from: address });
      getCars();
    } catch (error) {
      console.log(error);
    }

  }

  // function to initiate transaction
  const buyCar = async (_price, _index) => {
    try {
      const cUSDContract = new kit.web3.eth.Contract(erc20, cUSDContractAddress);
      const cost = new BigNumber(_price).shiftedBy(ERC20_DECIMALS).toString();

      const result = await cUSDContract.methods
        .approve(contractAddress, cost)
        .send({ from: address });

      await contract.methods.buyCar(_index).send({ from: address });
      // return result
      getBalance();
      getCars();
    } catch (error) {
      console.log({ error });
    }
  };


  // function that is called to make a car available for sale
  const sellCar = async (index) => {
    try {

      await contract.methods.sellCar(index).send({ from: address });

      getCars();
    } catch (error) {
      console.log({ error });
      alert("Something went wrong");
    }
  };


  return (

    <div className="content">
      <Header balance={cUSDBalance} celo = {celoBalance}/>
      <SalesCars cars={cars} buyCar = {buyCar}/>
      <AddCar addToCars={addtoCars} />
      <MyCar cars = {myCars} sellCar = {sellCar} />
    </div>

  );
}

export default App;
