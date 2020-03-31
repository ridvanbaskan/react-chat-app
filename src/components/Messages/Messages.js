import React from 'react';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import {
  selectCurrentChannel,
  selectIsPrivateChannel
} from '../../redux/SidePanel/sidePanel.selectors';
import { connect } from 'react-redux';
import { setFileModal } from '../../redux/message/message.actions';
import firebase, { firestore } from '../../firebase/firebase.utils';
import moment from 'moment';
import './Messages.css';

function Messages({
  currentChannel,
  currentUser,
  setFileModal,
  uploadState,
  percentUploaded,
  isPrivateChannel
}) {
  var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
  var regex = new RegExp(expression);
  const [message, setMessage] = React.useState('');
  const [searchTerm, setSearchTerm] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [currentMessages, setCurrentMessages] = React.useState('');
  const [numUniqueUsers, setNumUniqueUsers] = React.useState(0);
  const [isExecuted, setIsExecuted] = React.useState(true);
  const [searchResults, setSearchResults] = React.useState([]);
  const [isSearching, setIsSearching] = React.useState(false);

  const handleChange = e => {
    setMessage(e.target.value);
  };
  const handleChangeSearch = e => {
    setSearchTerm(e.target.value);
    setIsSearching(true);
  };
  React.useEffect(() => {
    if (currentMessages) {
      const results = currentMessages.reduce((acc, mess) => {
        if (
          !mess.message.content.match(regex) &&
          mess.message.content.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          acc.push(mess.message);
          console.log(mess.message.content);
        }
        return acc;
      }, []);

      setSearchResults(results);
      setIsSearching(false);
    }
  }, [searchTerm]);

  React.useEffect(() => {
    if (currentChannel) {
      const collectionRef = firestore
        .collection('channels')
        .doc(currentChannel.id)
        .collection(isPrivateChannel ? 'privateMessages' : 'messages');

      collectionRef.onSnapshot(snapShot => {
        const collectionsMap = snapShot.docs.map(doc => {
          const data = doc.data();
          return data;
        });
        setCurrentMessages(collectionsMap);
      });
    }
  }, [currentChannel]);

  const sendMessage = () => {
    if (message) {
      setLoading(true);
      firestore
        .collection('channels')
        .doc(currentChannel.id)
        .collection(isPrivateChannel ? 'privateMessages' : 'messages')
        .add({
          message: {
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            user: {
              id: currentUser.uid,
              name: currentUser.displayName,
              avatar: currentUser.photoURL
            },
            content: message
          }
        })
        .then(() => setLoading(false))
        .catch(error => {
          console.error(error);
          setLoading(false);
        });
      setMessage('');
    }
  };

  if (isExecuted && currentMessages) {
    const uniqueUserCount = currentMessages.reduce((acc, mess) => {
      if (!acc.includes(mess.message.user.name)) {
        acc.push(mess.message.user.name);
      }
      return acc;
    }, []);
    setIsExecuted(false);
    setNumUniqueUsers(uniqueUserCount.length);
  }

  return (
    <div className="messages ml-4 d-flex- flex-column">
      <div className="card">
        <div className="card-body d-flex justify-content-between">
          <div className="d-flex flex-column">
            <h3>
              {currentChannel ? currentChannel.name : 'Channel'}{' '}
              <i className="far fa-star"></i>
            </h3>
            <p>
              {numUniqueUsers} User{numUniqueUsers > 1 ? 's' : ''}
            </p>
          </div>
          <form>
            <div className="search-group input-group mb-2">
              <input
                type="search"
                onChange={handleChangeSearch}
                value={searchTerm}
                className="form-control"
                name="search"
                placeholder="Search Messages"
              />
              <div className="search-icon input-group-append">
                {isSearching ? (
                  <div className="spinner-border" role="status"></div>
                ) : (
                  <i className="fas fa-search text-secondary"></i>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
      <div className="message-body card mt-4">
        <div className="card-body">
          {searchTerm.length > 0
            ? searchResults.map(mes => {
                return (
                  <div
                    key={mes.content}
                    className="messages-content d-flex mb-2"
                  >
                    <span>
                      <img src={mes.user.avatar} alt="" />
                    </span>
                    <span className="divider mx-2" />
                    <span className="d-flex flex-column">
                      <div className="d-flex">
                        <h6 className="mr-2 mb-2 font-weight-bold">
                          {mes.user.name}
                        </h6>
                        <small className="text-muted ">
                          {mes.timestamp
                            ? moment(mes.timestamp.toDate()).fromNow()
                            : null}
                        </small>
                      </div>
                      {mes.content.match(regex) ? (
                        <img
                          className="upload-photo"
                          src={mes.content}
                          alt=""
                        />
                      ) : (
                        <p className="user ">{mes.content}</p>
                      )}
                    </span>
                  </div>
                );
              })
            : currentMessages &&
              currentMessages.map(mes => {
                return (
                  <div
                    key={mes.message.content}
                    className="messages-content d-flex mb-2"
                  >
                    <span>
                      <img src={mes.message.user.avatar} alt="" />
                    </span>
                    <span className="divider mx-2" />
                    <span className="d-flex flex-column">
                      <div className="d-flex">
                        <h6 className="mr-2 mb-2 font-weight-bold">
                          {mes.message.user.name}
                        </h6>
                        <small className="text-muted ">
                          {mes.message.timestamp
                            ? moment(mes.message.timestamp.toDate()).fromNow()
                            : null}
                        </small>
                      </div>
                      {mes.message.content.match(regex) ? (
                        <img
                          className="upload-photo"
                          src={mes.message.content}
                          alt=""
                        />
                      ) : (
                        <p className="user ">{mes.message.content}</p>
                      )}
                    </span>
                  </div>
                );
              })}
        </div>
      </div>
      {uploadState ? (
        <div className="progress mt-4">
          <div
            className="progress-bar"
            role="progressbar"
            style={{ width: `${percentUploaded}%` }}
            aria-valuenow="25"
            aria-valuemin="0"
            aria-valuemax="100"
          >
            {percentUploaded}%
          </div>
        </div>
      ) : null}

      <div className="message-form card mt-4">
        <div className="card-body">
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text" id="basic-addon1">
                +
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              value={message}
              onChange={handleChange}
              placeholder="Write your message"
            />
          </div>
          <div className="button-group d-flex justify-content-center align-items-center">
            <button
              type="button"
              disabled={loading}
              className="btn btn-warning btn-block"
              onClick={sendMessage}
            >
              <i className="far fa-edit text-light float-left mt-1"></i>
              Add Reply
            </button>
            <button
              type="button"
              className="btn btn-success btn-block mb-2"
              onClick={() => setFileModal()}
            >
              Upload Media
              <i className="fas fa-cloud-upload-alt text-light float-right mt-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  currentUser: selectCurrentUser(state),
  currentChannel: selectCurrentChannel(state),
  uploadState: state.message.uploadState,
  percentUploaded: state.message.percentUploaded,
  isPrivateChannel: selectIsPrivateChannel(state)
});
const mapDispatchToProps = dispatch => ({
  setFileModal: () => dispatch(setFileModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
