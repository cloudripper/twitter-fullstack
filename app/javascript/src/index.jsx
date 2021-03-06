import React from 'react';
import ReactDOM from 'react-dom';
import { useState } from 'react';
import { fetchLogin, fetchSignUp } from './utils';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter } from '@fortawesome/free-brands-svg-icons';
import './index.scss';



///LAYOUT COMPONENT
const Layout = (props) => {
  return (
      <>
          <nav className="navbar navbar-default navbar-fixed-top">
              <div className="container">
                  <div className="navbar-header">
                      <a className="navbar-brand" href="#">
                          <FontAwesomeIcon icon={faTwitter} />
                      </a>
                  </div>
                  <ul className="nav navbar-nav navbar-right">
                      <li className="dropdown">
                          <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">language: <strong>English </strong><span className="caret"></span></a>
                          <ul className="dropdown-menu row text-center" id="navMenu" role="menu">
                              <li className="col-xs-12"><a href="#">Bahasa Malaya</a></li>
                              <li className="col-xs-12"><a href="#">Dansk</a></li>
                              <li className="col-xs-12"><a href="#">English</a></li>
                              <li className="col-xs-12"><a href="#">Suomi</a></li>
                          </ul>
                      </li>
                  </ul>
              </div>
          </nav>
          {props.children}
      </>
  );
}
// -- END LAYOUT COMPONENT --//


//HOME COMPONENT
const Home = (props) => { 
  const [ failedLogin, setFailedLogin ] = useState(null)
  const [ signupSuccess, setSignupSuccess ] = useState(null)
  
  //New User function
  const handleSignUp = async (e) => {
    e.preventDefault()
    const data = { 
        user: {
            username: e.target[0].value,
            password: e.target[2].value,
            email: e.target[1].value
            }
        }
    const signup = await fetchSignUp(data)
    await (signup) ? setSignupSuccess(<div className="ml-3 mb-2 text-success"><small><i>Sign up successful. Please log in above.</i></small></div>) : setSignupSuccess(<div className="ml-3 mb-2 text-danger"><small><i>Sign up error. Please try again.</i></small></div>)
  }    

  //Login function
  async function handleLogin(e) {
    e.preventDefault()
    if ((e.target[0].value) && (e.target[1].value)) { 
      const data = { 
          user: {
              username: e.target[0].value,
              password: e.target[1].value,
              }
          }
      const success = await fetchLogin(data)
      await (success) ? props.changeLoginStatus(success, e.target[0].value) : setFailedLogin(<div className="ml-3 mb-2 text-danger"><small><i>The username and password you entered did not match our records. Please double-check and try again.</i></small></div>)
    }
  };

  return ( 
    <div className="main mt-0 bg-secondary">
        <div className="container">
            <div className="d-flex flex-row front-card">
                
                    <div className="flex-item col-6 welcome">
                        <div id="welcome-text">
                            <h1><strong>Welcome to Twitter.</strong></h1>
                            <p>Connect with your friends &#8212; and other fascinating people. Get in-the-moment updates on the things that interest you. And watch events unfold, in real time, from every angle.</p>
                        </div>
                        <p><a href="#" id="twit-info">Hack Pacific - Backendium Twitter Project</a></p>
                        <p><a href="#" id="twit-account">Tweet and photo by @Hackpacific<br/>3:20 PM - 15 December 2016</a></p>
                    </div>
                    <div className="flex-item col-6">
                      <div className="log-in">
                          <form onSubmit={handleLogin} >
                              <div className="form-group">
                              {failedLogin}
                              <input type="text" className="form-control username" placeholder="Username" />
                              </div>
                              <div className="form-group col-8">
                              <input type="password" className="form-control password" placeholder="Password" />
                              </div>
                              <button id="log-in-btn" className="btn btn-default btn-primary col-3 col-offset-1 mr-2">Log in</button>
                              <label>
                              <input type="checkbox" />
                              <span>Remember me</span>
                              <span> &#183; </span>
                              </label>
                              <a href="#">Forgot password?</a>
                          </form>
                      </div>
                      <div className="sign-up">
                          <form onSubmit={handleSignUp}>
                              <div className="new-to-t">
                                <p><strong>New to Twitter?</strong><span> Sign Up</span></p>
                              </div>
                              {signupSuccess}
                              <div className="form-group">
                              <input type="text" className="form-control username" placeholder="Username" />
                              </div>
                              <div className="form-group">
                              <input type="email" className="form-control email" placeholder="Email" />
                              </div>
                              <div className="form-group">
                              <input type="password" className="form-control password" placeholder="Password" />
                              </div>
                              <button id="sign-up-btn" className="btn btn-default btn-warning pull-right">Sign up for Twitter</button>
                          </form>
                      </div>
                  
                </div>
            </div>
        </div>
    </div>
  )
}
// -- END HOME COMPONENT --//

// HOMEAPP COMPONENT -- Login pathway
const HomeApp = () => { 
  const [ loggedIn, setLoggedIn ] = useState(false)
  const [ user, setUser ] = useState("User")

  const loginCheck = async (status, username) => {
      await setUser(username)
      await setLoggedIn(status)
  }

  //Login Component - pass to "/feed", fail to Home Component
  const Login = () => {
    window.location.replace("/feed")
    return null
  }

  return (
    (loggedIn) ? <Login /> : <Layout><Home changeLoginStatus={loginCheck} /></Layout>
  )
}
// -- END HOMEAPP COMPONENT -- //


document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <React.StrictMode>
          <HomeApp />
        </React.StrictMode>,
        document.getElementById('root')
      )
})

