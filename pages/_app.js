import Head from "next/head"
import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';


function MyApp({ Component, pageProps }) {
return (
<>
<Head>
   <meta name="viewport" content="width=device-width, initial-scale=1" />
</Head>
            <div className='wrapper'>
            
                  <Component {...pageProps}/>
            
            </div>
</>
);
}
export default MyApp;