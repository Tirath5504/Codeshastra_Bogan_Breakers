import logooptima from './assests/Optimaoptima black .png'
import './css/Guide.css'
import steps from './assests/stepsinhaler.jpg'
import { useNavigate } from 'react-router-dom'
function Guide() {
  const navigate = useNavigate();
  const handleProceed = () => {
    navigate('/video');
  }
  return (<>
    <img src={logooptima} alt='guideImage' style={{ padding: "50px", width: "200px", height: "auto" }} />
    <div class='Guideback'>
      <center>
        <div class='Guidebox'>
          <h1>User Guide</h1>
          <h2>How to use a metered-dose inhaler</h2>
          <p style={{ padding: "20px" }}>Shake your inhaler for 10 seconds.<br />
            Exhale completely (away from the inhaler) and hold your breath briefly.<br />
            Place the plastic mouthpiece in your mouth.<br />
            Press down on the inhaler canister once, and simultaneously begin to inhale.<br />
            Inhale slowly and deeply for 3–5 seconds.<br />
            Hold your breath for 10 seconds, then exhale slowly.<br />
            Wait 1 minute before taking another puff (if prescribed).<br />
            When finished, rinse your mouth with water or brush your teeth.</p>
          <img src={steps} alt='guideImage' />
          <br />
          <br />
          <div class="Vid"><iframe title='youtube-guide' width="560" height="315" src="https://www.youtube.com/embed/Lx_e5nXfi5w?si=FfQdrK0VmSrN7jx9" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
          </div>
          <button onClick={handleProceed} >
            Proceed
          </button>
        </div>
      </center> </div>

  </>);
}
export default Guide;