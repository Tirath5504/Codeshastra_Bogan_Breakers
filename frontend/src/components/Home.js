// import Navbar from "./Navbar";
import './css/Home.css'
import logoblack from './assests/Optimaoptima black .png'
import {Circle} from 'react-awesome-shapes'
import {Donut} from 'react-awesome-shapes'
import { useNavigate } from "react-router-dom"
function Home()
{
    const navigate = useNavigate();
 
    const LoginPage = () => {
        navigate("/login");
    }
    const SignPage = () => {
        navigate("/signup");
    }
    return (<>
    {/* <img src={Backimg} alt="landing img" className="Backimg"/>
    <div className="Divvv" style={style1}>
    <img src={Backimg} alt="landing img" className="Backimg"/>
    <img src={logoblack} className="Logogreen"/>
    </div> */}
    <div className="Homebg">
    <Circle
    color="linear-gradient(135deg, #DAFFD0, #21A700)"
    size={['250px', '250px', '250px', '250px']}
    zIndex={2} /> 
    <div style={{marginLeft:"1700px", marginTop:"-50px"}}><Donut
    color="#21A700"
    size="400px"
    width={['40px', '40px', '60px', '60px']}
    zIndex={2}
/> </div>
    <div><center><img src={logoblack} alt="logo black" style={{marginTop:"100px"}}/> </center></div>
    <div>
    <center>
    <button className='Signupbttn' onClick={SignPage}>Sign Up</button>
    <button className='Loginbttn' onClick={LoginPage}>Login</button>
    </center>
    </div>
    <br/>
   <center><div><h3 className="line-1 anim-typewriter">Optima: Real-Time Action Detection for Healthier Lives</h3></div> </center>
   <div><center><button className="bounce" onClick={SignPage}>Get started with guided tour</button></center></div>
   <div style={{marginLeft:"200px"}}><Donut
    color="#21A700"
    size="180px"
    width={['40px', '40px', '60px', '60px']}
    zIndex={2}
/> </div>
<div style={{marginLeft:"1200px"}}><Circle
    color="linear-gradient(135deg, #DAFFD0, #21A700)"
    size={['450px', '450px', '450px', '450px']}
    zIndex={2} />  </div>
</div>
    </>);
};

export default Home;
