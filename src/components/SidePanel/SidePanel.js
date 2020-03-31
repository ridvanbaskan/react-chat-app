import React from 'react';
import './SidePanel.styles.css';
import { auth } from '../../firebase/firebase.utils';
import Channels from './Channels';
import DirectMessages from './DirectMessages';

export default function SidePanel({ currentUser }) {
  const handleSignout = () => {
    auth.signOut().then(() => console.log('Signed out'));
  };

  return (
    <div className="sidebar">
      <div className="row mt-4 mx-auto">
        <div className="col text-light d-flex justify-content-center align-items-center">
          <i className="fas fa-code fa-3x mr-2"></i>
          <h2>DevChat</h2>
        </div>
      </div>
      <div className="row">
        <div className="col">
          <div className="dropdown float-left ml-5 mt-3">
            <a
              className="btn btn-link dropdown-toggle text-light p-0"
              href="#/"
              role="button"
              id="dropdownMenuLink"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <span>
                <img
                  className="mr-2"
                  src={currentUser.photoURL}
                  alt="avatar"
                  style={{ width: '40px', borderRadius: '50%' }}
                />
                {currentUser.displayName}
              </span>
            </a>

            <div className="dropdown-menu" aria-labelledby="dropdownMenuLink">
              <a className="dropdown-item disabled" href="#/">
                Signed in as {currentUser.displayName}
              </a>
              <a className="dropdown-item" href="#/">
                Change Avatar
              </a>
              <a className="dropdown-item" href="#/" onClick={handleSignout}>
                Sign out
              </a>
            </div>
          </div>
        </div>
      </div>
      <br />

      <Channels />
      <DirectMessages />
    </div>
  );
}
