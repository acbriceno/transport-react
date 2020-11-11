import React from 'react'
import auth from './auth'



export const NavBar = props => {
  return (
      <div>
        <button
        onClick={() => {
          auth.removeAuth(() => {
            props.history.push("/");
          });
        }}
        > Logout </button>
        

      </div>
  )
}
