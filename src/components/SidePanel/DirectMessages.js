import React from 'react';
import { connect } from 'react-redux';
import firebase, { firestore } from '../../firebase/firebase.utils';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import {
  setCurrentChannel,
  setPrivateChannel
} from '../../redux/SidePanel/sidePanel.actions';
import './Channel.styles.css';

function DirectMessages({ currentUser, setCurrentChannel, setPrivateChannel }) {
  var presenceRef = firebase.database().ref('presence');
  var connectedRef = firebase.database().ref('.info/connected');
  const [users, setUsers] = React.useState('');
  const [isTrue, setIsTrue] = React.useState(true);
  const [isActive, setIsActive] = React.useState('');

  React.useEffect(() => {
    if (currentUser) {
      firestore.collection('users').onSnapshot(snapShot => {
        const collectionsMap = snapShot.docs.map(doc => {
          let data = doc.data();
          data['uid'] = doc.id;
          data['status'] = 'offline';
          return data;
        });
        setUsers(collectionsMap);
      });

      connectedRef.on('value', function(snap) {
        if (snap.val() === true) {
          const ref = presenceRef.child(currentUser.uid);
          ref.set(true);
          ref.onDisconnect().remove(err => {
            if (err !== null) {
              console.error(err);
            }
          });
        }
      });
    }
  }, [currentUser]);

  const addStatusToUser = (userId, connected = true) => {
    if (users && isTrue) {
      const updatedUsers = users.reduce((acc, user) => {
        if (user.uid === userId) {
          user['status'] = `${connected ? 'online' : 'offline'}`;
        }
        return acc.concat(user);
      }, []);
      setIsTrue(false);
      setUsers(updatedUsers);
    }
  };
  presenceRef.on('child_added', snap => {
    addStatusToUser(snap.key);
  });
  presenceRef.on('child_removed', snap => {
    addStatusToUser(snap.key, false);
  });
  const isUserOnline = user => user.status === 'online';

  const changeChannel = user => {
    const channelId =
      user.uid < currentUser.uid
        ? `${user.uid}${currentUser.uid}`
        : `${currentUser.uid}${user.uid}`;
    console.log(channelId);
    const channelData = {
      name: user.name,
      id: channelId
    };
    setCurrentChannel(channelData);
    setPrivateChannel(true);
    setIsActive(user.uid);
  };

  return (
    <React.Fragment>
      <div className="row mt-5">
        <div className="col mx-auto mt-2">
          <div className="ml-5 text-secondary">
            <span>
              <i className="fas fa-envelope" /> DIRECT MESSAGES
            </span>{' '}
            <span>{users.length}</span>
          </div>
        </div>
      </div>
      {users &&
        users.map(user => {
          if (user.uid === currentUser.uid) {
            return null;
          } else {
            return (
              <div className="row mt-3">
                <div className="col mx-auto mt-2">
                  <div className="ml-5 text-secondary">
                    <a
                      className={`is-active ${
                        isActive === user.uid ? 'active' : ''
                      }`}
                      onClick={() => changeChannel(user)}
                    >
                      <i
                        className="fas fa-circle"
                        style={
                          isUserOnline(user)
                            ? { color: 'green' }
                            : { color: 'red' }
                        }
                      />{' '}
                      @{user.name}
                    </a>
                  </div>
                </div>
              </div>
            );
          }
        })}
    </React.Fragment>
  );
}

const mapStateToProps = state => ({
  currentUser: selectCurrentUser(state)
});

// const mapDispatchToProps = dispatch => ({
//   setCurrentChannel: (channelData) => dispatch(setCurrentChannel(channelData)),
//   setPrivateChannel: (isPrivateChannel) => dispatch(setPrivateChannel(isPrivateChannel))
// })

export default connect(mapStateToProps, {
  setCurrentChannel,
  setPrivateChannel
})(DirectMessages);
