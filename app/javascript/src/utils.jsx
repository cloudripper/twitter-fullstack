import { safeCredentials, safeImgCredentials, handleErrors } from './utils/fetchHelper';
import React from 'react';



// CREATE New Session
export async function fetchLogin(data) {
    const apiRequest = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    }
    return await fetch('/api/sessions', safeCredentials(apiRequest))
    .then(response => response.json()).then(data => { 
        return data.success
    }).catch(error => console.log("Error: ", error))   
}


// GET Authentication
export async function fetchSession() {
    const apiRequest = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
    return await fetch('/api/authenticated', apiRequest)
    .then(response => response.json()).then(data => { 
        return data
    }).catch(error => console.log("Error: ", error))   
}

// Logout // Delete Session
export async function destroySession() {
    const apiRequest = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    }
    return await fetch('/api/sessions', safeCredentials(apiRequest))
    .then(response => response).catch(error => console.log("Error: ", error))   
}

// SIGNUP / Create New User
export async function fetchSignUp(data) {
    const apiRequest = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    }
    return await fetch('/api/users', safeCredentials(apiRequest))
    .then(response => response.json()).then(() => { return true }).catch(() => { return false }) 
}

// GET all tweets
export async function fetchFeed() {
    const apiRequest = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
    return await fetch('/api/tweets', apiRequest)
    .then(response => response.json()).then(data => { 
        return data
    }).catch(error => console.log("Error: ", error))   
}

// GET user tweets
export async function fetchUserTweets(user) {
    const url = `/api/users/${user}/tweets`
    const apiRequest = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    }
    return await fetch(url, apiRequest)
    .then(response => response.json()).then(data => { 
        return data
    }).catch(error => console.log("Error: ", error))   
}

// DELETE User Tweet
export async function delTweet(id) {
    const url = "/api/tweets/" + id
    const apiRequest = {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    }
    return await fetch(url, safeCredentials(apiRequest))
    .then(response => response.json()).then(data => { 
        return data
    }).catch(error => console.log("Error: ", error))   
}

// POST tweet
export async function postTweet(data) {
    console.log(data)
    const apiRequest = {
        method: 'POST',
        body: data,
    }
    return await fetch('/api/tweets', safeImgCredentials(apiRequest))
    .then(response => response.json()).catch(error => handleErrors(error))   
}

//  ERROR BOUNDARY
export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.log(error, ": ", errorInfo)
    }

    render() {
        if (this.state.hasError) {
            return <p><small>Something went wrong.</small></p>
        }

        return this.props.children;
    }
}

export default fetchLogin