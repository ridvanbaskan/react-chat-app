import React from 'react';
import { connect } from 'react-redux';
import { Switch, Route, withRouter } from 'react-router-dom';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Layout/Dashboard';
import firebase from './firebase/firebase.utils';
import { setUser, clearUser } from './redux/user/user.actions';
import WithSpinner from './components/WithSpinner/WithSpinner';
import { closeModal } from './redux/SidePanel/sidePanel.actions';
import { closeFileModal } from './redux/message/message.actions';
import ChannelModal from './components/Modals/ChannelModal';
import FileModal from './components/Modals/FileModal';

import './components/SidePanel/Channel.styles.css';
import './App.css';

function App({
  history,
  setUser,
  isLoading,
  modal,
  closeModal,
  clearUser,
  fileModal,
  closeFileModal
}) {
  React.useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        setUser(user);
        history.push('/');
      } else {
        history.push('/login');
        clearUser();
      }
    });
  }, []);

  return isLoading ? (
    <WithSpinner />
  ) : (
    <div className="app">
      <Switch>
        <Route exact path="/" render={props => <Dashboard {...props} />} />
        <Route exact path="/login" render={props => <Login {...props} />} />
        <Route
          exact
          path="/Register"
          render={props => <Register {...props} />}
        />
      </Switch>
      {modal ? <ChannelModal closeModal={closeModal} /> : null}
      {fileModal ? <FileModal closeFileModal={closeFileModal} /> : null}
    </div>
  );
}

const mapStateToProps = state => ({
  isLoading: state.user.isLoading,
  modal: state.sidePanel.modal,
  fileModal: state.message.fileModal,
  channels: state.user.channels
});

const mapDispatchToProps = dispatch => ({
  setUser: user => dispatch(setUser(user)),
  clearUser: () => dispatch(clearUser()),
  closeModal: () => dispatch(closeModal()),
  closeFileModal: () => dispatch(closeFileModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(App));
