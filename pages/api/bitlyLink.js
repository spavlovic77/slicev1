import axios from 'axios';

const bit = async(req, res) => {

    const token = process.env.BITLY_ACCESS_TOKEN;
    let headers = {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
    const dataString = `{ "long_url": "${req.body.linkToFight}" }`;
    console.log(dataString)
    const api_url = "https://api-ssl.bitly.com/v4/shorten";
    console.log({token})
    const response = await axios.post(api_url, dataString, {
        headers: headers,
      });
      res.json(response.data)
    
}
export default bit