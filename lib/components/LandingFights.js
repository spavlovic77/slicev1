import useSWR from "swr";


    const fetcherAllFights = (fightFactory, accounts) => { 
      const allFights = fightFactory.methods.getAllFights().call({ from: accounts[0] }).then((data) => {return data})
      return allFights
  }

const LandingFights = ({ web3, accounts, fightFactory,slice }) =>  {
  const { data: fights } = useSWR('allFights', {fetcher: fetcherAllFights(fightFactory, accounts)})

console.log({ fights }) 
    return (
      <>
<div>

{fights ? null : (<div><h5>{fights.map(function(f, idx){
   return (<li key={idx}>{f.fightContract} {f.fightAdmin} {f.active}</li>)
 })}</h5>
              </div>)}              

</div>
</>
    );
  }
export default LandingFights