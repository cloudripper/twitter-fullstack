import React from 'react';
import ReactDOM from 'react-dom';
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch, NavLink } from "react-router-dom";

import UserFeed from './User';
import { fetchSession, destroySession, fetchFeed, postTweet, delTweet, fetchUserTweets, ErrorBoundary } from './utils';
import './Feed.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter } from '@fortawesome/free-brands-svg-icons'

// PRIMARY FEED Component
export const Feed = (props) => {
  const user = props.user
  const userId = props.userId
  const [ feedTweets, setFeedTweets ] = useState(null)
  const [ userTweetCount, setUserTweetCount ] = useState(0)
  const [ tweetCount, setTweetCount ] = useState(0)
  const [ tweetLength, setTweetLength ] = useState(140)
  const [ sideUser, setSideUser ] = useState(user)
  const [ sideUserId, setSideUserId ] = useState(userId)
  const [ fileName, setFileName ]  = useState(null)
  const [ imgPreview, setImgPreview ]  = useState(null)
  const [ imgFile, setImgFile ]  = useState(null)
   
  useEffect(() => {
    getFeed() //Fetching all tweets from database on mount
  }, [])

    // NAVBAR Component
    const NavBar = (props) => {
      // Placeholder function for Search feature
      const search = (e) => {
        e.preventDefault()
        console.log("Search placeholder")
      }

      return (
        <nav className="navbar">
          <div className="navbar-header">
          <Link className="navbar-brand ml-5" to="/feed">
              <FontAwesomeIcon icon={faTwitter} />
          </Link>
          </div>
          <form className="search-bar col-xs-3 nav navbar-right ml-auto mr-4" onSubmit={search}>
            <div className="input-group border rounded" id="searchBox">
              <input type="text" className="form-control search-input" id="searchInput" placeholder="Search for..."/>
              <span className="input-group-btn">
                <button className="btn btn-default search-btn" id="searchBtn">Go!</button>
              </span>
            </div>
          </form>
          <div className="nav navbar-nav btn-group dropdown">
            <a href="#" className="dropdown-toggle mr-5" data-toggle="dropdown" role="button" aria-expanded="false"><span id="user-icon">{user}</span></a>
            <ul className="dropdown-menu dropdown-menu-right pl-2 mr-auto" id="navMenu" role="menu">
              <NavLink to="/feed" exact activeClassName="d-none"  ><li> All Tweets </li></NavLink>
              <NavLink to={{ pathname: `/feed/user/${userId}`, state: { user: props.user, id: userId }}} activeClassName="d-none" ><li >{user}</li></NavLink>
              <li role="presentation" className="dropdown-divider"></li>
              <li><a disabled href="#">Lists</a></li>
              <li role="presentation" className="dropdown-divider"></li>
              <li><a disabled href="#">Help</a></li>
              <li role="presentation" className="dropdown-divider"></li>
              <li><a disabled href="#">Keyboard shortcuts</a></li>
              <li role="presentation" className="dropdown-divider"></li>
              <li><a disabled href="#">Settings</a></li>
              <li role="presentation" className="dropdown-divider"></li>
              <li ><a id="log-out" href="#" onClick={props.logout}>Log out</a></li>
            </ul>
          </div> 
        </nav>
     )    
    }

    //SIDEBAR Component
    const SideBar = () => {
      
      return (
        <div className="profile-trends" key={sideUser}>
          <div className="pl-2 profileCard col-10">
            <div className="profileCard-content">
              <div className="user-field col-10">
                <Link className="username" to={{ pathname: `/feed/user/${sideUserId}`, state: { user: sideUser, id: sideUserId  }}}>{sideUser}</Link><br/>
                <Link className="screenName" to={{ pathname: `/feed/user/${sideUserId}`, state: { user: sideUser, id: sideUserId  }}}>@{sideUser}</Link>
              </div>
              <div className="user-stats d-flex flex-row justify-content-around">
                <div className="flex-item">
                  <a href="" disabled>
                    <span>Tweets<br/></span>
                    <span className="user-stats-tweets">{tweetCount}</span>
                  </a>
                </div>
                <div className="flex-item">
                  <a href="">
                    <span>Following<br/></span>
                    <span className="user-stats-following">0</span>
                  </a>
                </div>
                <div className="flex-item">
                  <a href="">
                    <span>Followers<br/></span>
                    <span className="user-stats-followers">0</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div className="trends col-10">
            <div className="">
              <div className="trends-header">
                <span>Trends</span><span> &#183; </span><small><a href="">Change</a></small>
              </div>
              <ul className="trends-list ml-2">
                <li><a href="#" disabled>#Hongkong</a></li>
                <li><a href="#" disabled>#Ruby</a></li>
                <li><a href="#" disabled>#foobarbaz</a></li>
                <li><a href="#" disabled>#rails</a></li>
                <li><a href="#" disabled>#API</a></li>
              </ul>
            </div>
          </div> 
        </div>
      )
    }

  // GET tweets from db
  const getFeed = async () => {
    const feedData = await fetchFeed()
    const userData = await fetchUserTweets(user)
    await setFeedTweets(feedData.tweets)
    await setUserTweetCount(userData.tweets.length)
    await setTweetCount(userData.tweets.length)
  }

  // POST new tweet and GET full updated list of all tweets from db
  const handleTweet = async (e) => { 
    e.preventDefault()
    console.log(e.target)
    let file = null
    const form = e.target
    //let data = {}
    const formData = new FormData()
    if (e.target[1].files.length > 0) {
      const imageFile = form[1].files[0]  
      formData.append('tweet[image]', imageFile, imageFile.name)
    }
    if (e.target[0].value) {
      //data['message'] = e.target[0].value
      formData.append('tweet[message]', e.target[0].value)
      e.target[0].value = null
      setFileName(null)
      setTweetLength(140)
      setImgPreview(null)
      await postTweet(formData)
      await getFeed()
    }
  }

  // DELETE tweet from db; GET updated list of tweets from db
  const deleteTweet = async (e) => {
    e.preventDefault()
     await delTweet(e.target.id)  
     await getFeed()
  }

  // Process Tweet Feed
  const LoadTweets = () => {
    


    //Reset SIDEBAR User to Logged-in User on Mount of LoadTweets
    useEffect(() => { 
      setSideUser(user)
      setSideUserId(userId)
      setTweetCount(userTweetCount)
    }, [])
    
    if (feedTweets) {    
      return feedTweets.map((tweet) => {
        let deleteButton = null

        if (user === tweet.username) {
          deleteButton = <button className="delete-tweet btn bg-primary text-light ml-auto mt-auto py-1" id={tweet.id} onClick={deleteTweet}>Delete</button>
        }

        return (
              <div className="tweet col-xs-12" key={`user${tweet.id}`}>
                <Link className="tweet-username" to={{ pathname: `/feed/user/${tweet.id}`, state: { user: tweet.username, id: tweet.id }}}>{tweet.username}</Link>
                <Link className="ml-2 tweet-screenName" to={{ pathname: `/feed/user/${tweet.id}`, state: { user: tweet.username, id: tweet.id }}}>@{tweet.username}</Link>
                <div className="d-flex"> 
                  <div className="flex-column">
                    <p className="pt-2">{tweet.message}</p>
                    {(tweet.image) ? <p className="pt-2 imageCont"><img className="tweetImage" src={tweet.image}/></p> : null}
                  </div>
                  {deleteButton}
                </div>
              </div>)
      })
    } else {
      return <p>Loading</p>
    }
  }

  
  function imgReader(img) {
    const reader = new FileReader()
    reader.addEventListener("load", function () {
      setImgPreview(<img className="pr-2" id="image-preview" src={reader.result} alt="image preview" />)
    }, false);
    reader.readAsDataURL(img)
  }
  
  async function handleFileInput(e) {
    const file = e.currentTarget.files
    console.log(e.currentTarget.files)
    if (file.length > 0) {
      if (file[0].size > 2000000) {
        setFileName(<p className="mr-2 my-0 font-italic"><small>File too large. Max File Size is 2MB</small></p>)
      } else {
        imgReader(file[0])
        setFileName(<p className="mr-2 my-0 font-italic"><small>{file[0].name}</small></p>)
        
      }
    } else {
      setFileName(null)
    }
  }

  // Live count of number of characters in a tweet
  const charCount = (e) => {
    const count = 140 - e.target.value.length
    setTweetLength(count)
  }

  // Function to Update User displayed on SideBar
  const handleSideUser = (user, id, count) => {
    setSideUserId(id)
    setTweetCount(count)
    setSideUser(user)
  }

  return (
    <Router>
      <NavBar logout={props.logout} user={user} />
        <div className="main container my-0 px-0 w-100" id="bgImg">     
          <div className="d-flex flex-row mx-0">
            <div className="flex-item ml-4 mr-auto"><SideBar /></div>
            <div className="flex-item mr-auto">
              <div className="feed-box">
                <form onSubmit={handleTweet}>
                  <div className="col-10 post-tweet-box">
                    <textarea type="text" className="form-control post-input" rows="3" onChange={charCount} maxLength="140" placeholder="What's happening?"></textarea>
                    <div className="d-flex align-items-center">
                      <div className="form-group ml-auto d-flex flex-row">
                        {fileName}
                        {imgPreview}
                        <label className="mb-0" id="upload-image-btn" type="button" >Upload image
                          <input onChange={handleFileInput} type="file" className="form-control" id="image-select" name="image" accept="image/*" />
                        </label>
                      </div>
                      <span className="post-char-counter ml-1">{tweetLength}</span>
                      <button className="btn btn-primary" id="post-tweet-btn">Tweet</button>
                    </div>
                  </div>
                </form>
                <div className="feed col-10 mb-5">  
                <Switch>
                  <Route path="/feed" exact ><LoadTweets/></Route>
                  <Route path="/feed/user/:id" exact><UserFeed user={user} userId={userId} delete={deleteTweet} handleSideUser={handleSideUser} /></Route>
                </Switch>
                </div>
              </div>
            </div>
            <div className="col-xs-3 follow-suggest">
            </div>
          </div>
        </div> 
    </Router>
  )  
}


// MAIN COMPONENT FOR ALL-FEED and USER-FEED
export const FeedApp = () => { 
  const [ user, setUser ] = useState("User")
  const [ userId, setUserId ] = useState(null)
  const [ loadFeed, setLoadFeed ] = useState(<small>Authenticating...</small>)

  useEffect(() => {
    authenticate()
  }, [])

  //LOGOUT function
   const handleLogout = async (e) => {
      e.preventDefault()
      await destroySession()
      await authenticate()
  }

  const NoAuth = () => {
    window.location.replace("/")
    return null
  }

  //LOGIN function
  async function authenticate() {
    const session = await fetchSession()
    if (session.user) {
      await setUser(session.username)
      await setUserId(session.user.id)
    }
    await (session.authenticated) ? setLoadFeed(<Feed user={session.username} userId={session.user.id} logout={handleLogout} />) : setLoadFeed(<NoAuth />)
  }

  return ( 
  <ErrorBoundary>
    <Router>
      {loadFeed}
    </Router>
  </ErrorBoundary>
  )
}


//RENDERING
document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
      <React.StrictMode>
        <FeedApp />
      </React.StrictMode>,
      document.getElementById('root')
    );
})
export default Feed