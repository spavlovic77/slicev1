import Axios from 'axios';

const youtube = async (req, res) => {  
     
    let googleUrl = 'https://www.google.com/recaptcha/api/siteverify?secret='+process.env.CAPTCHA_SECRET+'&response='+req.body.captcha; 

    let captchaResponse = await Axios({
        url : googleUrl                 
    }); 
    const googleSays = captchaResponse.data.success
    res.json(googleSays)
}
export default youtube