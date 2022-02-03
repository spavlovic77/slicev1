import { useState } from 'react'
import Button from 'react-bootstrap/Button'
import validateCaptcha from '../../pages/api/validateCaptcha'
import ReCAPTCHA from 'react-google-recaptcha'
import axios from 'axios';
import styles from '../../styles/Register.module.css'
import Spinner from 'react-bootstrap/Spinner'

const FormRegister = ( { showSpinner, nick, lat, lon, onSetNick, onRegister }) => {

const onSubmit = async (event) => {
    event.preventDefault()
    const captcha = grecaptcha.getResponse()
        const response = await axios.post(
            '/api/validateCaptcha', 
            {
              captcha
            }
          );
          console.log('google says', response.data)

        if (grecaptcha.getResponse() === '') {
            
          alert("Please click <I'm not a robot> before sending the job")
        }
        else if (response.data ===false) {alert ('Captcha error. Try again later. Refresh page.')}
        else {onRegister()}
}
    return (
<div>
    <div className={styles.container}>
      <form className={styles.form} method='post' action='api/validateCaptcha' encType='multipart/form-data' onSubmit={onSubmit}>
      <input type='text' placeholder='Nick' value={nick} onChange={(e) => onSetNick(e.target.value)}/>
          {!showSpinner ? <p><Button type="submit" variant="outline-secondary" >Register</Button></p> : <Button variant="secondary" disabled>
                              <Spinner
                                as="span"
                                animation="grow"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                              Registering...
                            </Button>}
          <div>GPS {lat},{lon}</div>
          <div className='kapca'>
          <ReCAPTCHA size="small" sitekey="6LenlLAcAAAAAIyT3hf-WGqrYTdjoUR9Z6vw5c0n" /> 
          </div>
      </form>
    </div>
    
</div>
    )
}

export default FormRegister
