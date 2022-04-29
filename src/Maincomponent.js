import  React,{useState,useEffect} from "react";
import whitelister from './whitelisters.txt'
import { ethers } from 'ethers';
import contract from './DOGToken.json'; 
import bepcontract from './MetaDog.json'; 
import './Maincomponent.css';
import CircularProgress from "@material-ui/core/CircularProgress";
import Loader from 'react-loader-advanced'
import NFT from './nft';
import Carousel from 'react-multi-carousel';
import '../node_modules/react-multi-carousel/lib/styles.css'
import Modal from "react-bootstrap/Modal";

const responsive = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 5,
    slidesToSlide: 4 // optional, default to 1.
  },
  tablet: {
    breakpoint: { max: 1024, min: 464 },
    items: 3,
    slidesToSlide: 3 // optional, default to 1.
  },
  mobile: {
    breakpoint: { max: 464, min: 0 },
    items: 1,
    slidesToSlide: 1 // optional, default to 1.
  }
};
const spinner = <span><CircularProgress style={{'color': 'blue'}}/></span>;
  
const BigNumber = require('bignumber.js');

//0x38f14878aEA18D306D125180fB9bb6FC99C0373D
const contractaddress = "0x3807A5D97E7a345CfaEdf9b11F43fF58A690f487"
const bep20address = "0x972954f0ee7c8215eC5B76D55cb15215338F9d56"
const abi = contract.abi;
const bepabi = bepcontract.abi;
const ethereum = window.ethereum;

function Maincomponent(){
    const chevronWidth = 40;
    const [activeItemIndex, setActiveItemIndex] = useState(0);
    const [mintprice ,setmintprice]=useState(4000000);
    const [mintedcount,setmintedcount]=useState("0")
    const [whitelisters,setlist]=useState([])
    const [nftcount,setcount]=useState(1)
    const [account,setaccount]=useState()
    const [whitelisterstr,setwhitelisterstr]=useState()
    const [price,setprice]=useState()
    const [loading,setloading]=useState(false)
    const [images,setimages]=useState([]);
    const [images1,setimages1]=useState([])
    const [dd,sets]=useState([])
    const [error,seterror]=useState('')
    const [bal,setbal]=useState("0")
    const [errorshow,seterrorshow]=useState(false)
    const errorClose=()=>seterrorshow(false)

    useEffect(async ()=>{
        setloading(true)
        let provider = new ethers.providers.Web3Provider(ethereum);
        let signer = provider.getSigner();
        let nftContract = new ethers.Contract(contractaddress, abi,signer);
        let bepContract = new ethers.Contract(bep20address, bepabi,signer);
        await connect()
        fetch(whitelister)
        .then(r => r.text())
        .then(text => {
            let list = text.split(",")
            console.log(list)
            setlist(list)
        });
        let price1;
        await nftContract.totalSupply().then((result)=>{price1=BigNumber(result._hex);setmintedcount(price1.toString())})
        let balance
        await bepContract.balanceOf(account).then((result)=>{balance=BigNumber(result._hex).shiftedBy(-18);setbal(balance.toString())})
        setmintprice(price.toString())
        console.log(parseInt(balance.toString()))
        setloading(false)
    },[])

    useEffect(()=>{
      let aa = []
      images.map(data=>{
        aa.push(<NFT data={data}/>)
      })
      sets(aa)
    },[images])

    useEffect(async ()=>{
      let provider = new ethers.providers.Web3Provider(ethereum);
      let signer = provider.getSigner();
      let bepContract = new ethers.Contract(bep20address, bepabi,signer);
      let balance
        await bepContract.balanceOf(account).then((result)=>{balance=BigNumber(result._hex).shiftedBy(-18);setbal(balance.toString())})
    },[account])

    useEffect(()=>{
        setprice(nftcount * mintprice)
    },[nftcount,mintprice,price])

    async function connect(){
        if (!ethereum) {
          window.location.href='https://metamask.io/download.html'
        }else
        {
          if(window.ethereum.networkVersion!=97){
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: '0x61' }], // chainId must be in hexadecimal numbers
            });
  
          }
          setloading(true)
          const accounts = await ethereum.request({ method: 'eth_requestAccounts' }).catch((err)=>{setloading(false)});
          setaccount(accounts[0])
          await nfts()
          setloading(false)
        }
      }
      async function mint(){
        setloading(true)
        let provider = new ethers.providers.Web3Provider(ethereum);
        let signer = provider.getSigner();
        let nftContract = new ethers.Contract(contractaddress, abi,signer);
        let bepContract = new ethers.Contract(bep20address, bepabi,signer);
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' }).catch((err)=>{setloading(false)});
        setaccount(accounts[0])
        let ethr=new BigNumber(mintprice * nftcount); 
        let ether=new BigNumber(ethr.shiftedBy(18));
        let string=ether.toString();
        console.log(nftcount,mintprice * (parseInt(nftcount)+1))
        let txhash = await bepContract.approve(contractaddress,ethers.utils.parseEther(`${mintprice * (parseInt(nftcount)+1)}`)).catch((err)=>{seterror(err.data.message);seterrorshow(true);setloading(false)})
        await txhash.wait();
        let txhash1 = await nftContract.mint(nftcount,{gasPrice:nftcount >= 6? 20000000000:18000000000}).catch((err)=>{seterror(err.data.message);seterrorshow(true);setloading(false)})
        await txhash1.wait();
        setmintedcount(`${parseInt(mintedcount)+nftcount}`)
        await nfts()
        setloading(false)
      }
//0xaEa22135DEb0B44317a0C61A341d42cF82a9f53f
      async function nfts( ){
        const provider1 = new ethers.providers.Web3Provider(ethereum);
        const signer1 = provider1.getSigner();
        const nftContract = new ethers.Contract(contractaddress, abi,signer1);
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' }).catch((err)=>{setloading(false)});
          setaccount(accounts[0])
          console.log(accounts[0])
        let balance
        await nftContract.balanceOf(accounts[0]).then((result)=>{balance=BigNumber(result._hex)}).catch((err)=>{setloading(false)});
        let temp=[]
          for (let i = 0; i < balance; i++) {
            let id=await nftContract.tokenOfOwnerByIndex(accounts[0], i)
            let info = await nftContract.getinfo(id);
            temp.push([`https://metadogs.mypinata.cloud/ipfs/QmbpHijUWz57v5CMucX3s6up9fTUdWZE7Vk5Mq79tztHGG/${id}.png`,info])
          }
          console.log(temp)
          let gg=parseInt(balance.toString())
          setimages(temp)
      }
    return(
        <div>
            <div className='connectbutton'>
                <button class="glow-on-hover"  onClick={connect}>CONNECT METAMASK</button>
            </div>
            
            <div>
                <Loader backgroundStyle={{borderRadius:10,backgroundColor: 'red'}} show={loading} message={spinner}>
                </Loader>
                <div className="mint_available">{mintedcount}/10000 MINTED</div>
                <div className="whitelister">You have {bal} MDOG</div>
                <div className="middle"> 
                  <div className="row buttonbox">
                      <div className="col">
                              <button class="glow-on-hover smallbtn"  onClick={()=>{if(nftcount>1)setcount(nftcount-1);}}>-</button>
                      </div>
                      <div className="col count">{nftcount}</div>
                      <div className="col">
                              <button class="glow-on-hover smallbtn"  onClick={()=>{setcount(nftcount+1);}}>+</button>
                      </div>
                  </div>
                </div>
                <div className="row mintbtn">
                    <button class="glow-on-hover mintbutton"  onClick={mint}>MINT</button>
                </div>
                <div className="mintprice">YOU CAN MINT 10 METADOG NFT PER WALLET<br/> TOTAL MINT PRICE : {price} MDOG</div>

            
            </div>
            <br/>
            <div >
              <Carousel infinite={true} autoPlay={true} responsive={responsive}>
                  {
                    images.length!=0?
                      images.map(data=>{
                          return(<NFT data={data}/>)
                        }):
                        <></>
                  }
              </Carousel>
            </div>
            <Modal 
              size="sm"
              show={errorshow}
              onHide={errorClose}
              backdrop="static"
              keyboard={false}
              centered>
                <Modal.Header closeButton style={{
                    display: "flex",
                    alignItems: "center",
                    paddingLeft:"30%"
                  }}>
                  <Modal.Title>
                    <div className='modaltitle'>ERROR</div>
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='error_comment'>
                      {error}
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}

export default Maincomponent;