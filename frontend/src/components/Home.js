// import Navbar from "./Navbar";
import './Home.css'
import logoblack from './Optimaoptima black .png'
import {Circle} from 'react-awesome-shapes'
import {Donut} from 'react-awesome-shapes'
function Home()
{
    return (<>
    {/* <img src={Backimg} alt="landing img" className="Backimg"/>
    <div className="Divvv" style={style1}>
    <img src={Backimg} alt="landing img" className="Backimg"/>
    <img src={logoblack} className="Logogreen"/>
    </div> */}
    <Circle
    color="linear-gradient(135deg, #DAFFD0, #21A700)"
    size={['150px', '150px', '180px', '180px']}
    zIndex={2} /> 
    <div><center><img src={logoblack} alt="logo black"/> </center></div>
    <div>
    <center>
    <button class='Signupbttn'>Sign Up</button>
    <button class='Loginbttn'>Login</button>
    </center>
    </div>
    <br/>
   <div><h3 class="line-1 anim-typewriter">Optima: Real-Time Action Detection for Healthier Lives</h3></div>
   <div><center><button class="bounce">Get started with guided tour</button></center></div>
   <Donut
    color="#21A700"
    size="180px"
    width={['40px', '40px', '60px', '60px']}
    zIndex={2}
/> 
    </>);
};

export default Home;
