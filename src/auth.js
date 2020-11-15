import React, {useState} from 'react'

class Auth {
  constructor() {
    this.authenticated = false;
  }
  
  setAuth(authPayload){
    this.authenticated = true
    localStorage.setItem('token', authPayload.token)
    localStorage.setItem('firstName', authPayload.user.firstName)
    localStorage.setItem('lastName', authPayload.user.lastName)
    localStorage.setItem('tokenExpiration', authPayload.tokenExpiration)
    localStorage.setItem('role', authPayload.user.role.role)

  }

  removeAuth(cb){
    this.authenticated = false
    localStorage.clear()
    cb()
  }

  getRole(){
    return localStorage.getItem('role')
  }
  isAuthenticated() {
    return this.authenticated;
  }

  getName(){
    let name = localStorage.getItem('firstName').concat(" ").concat(localStorage.getItem('lastName'))
    return name
  }


}




export default new Auth();

