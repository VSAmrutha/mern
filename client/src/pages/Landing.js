import {Logo} from "../components"
import main from "../assets/images/main.svg"
import Wrapper from "../assets/wrappers/LandingPage"
import {Link} from 'react-router-dom';
const Landing = () => {
  return (
    <Wrapper>
        <nav><Logo/></nav>
        <div className="container page" >
        {/* Info */}
            <div className="info">
                <h1>Job <span>App</span></h1>
                <p>I'm baby af adaptogen edison bulb banh mi cred, man bun DSA brunch. Trust fund drinking vinegar crucifix pork belly gastropub, woke pop-up edison bulb banh mi. Adaptogen hell of woke, cloud bread tote bag whatever fixie authentic synth.</p>
                <Link to="/register" className="btn btn-hero">Login/Register</Link>
            </div>
 {/* image only in big screen */}
 <img src={main} alt="job hunt" className="img main-img"/>
        </div>
    </Wrapper>
  )
}

export default  Landing

