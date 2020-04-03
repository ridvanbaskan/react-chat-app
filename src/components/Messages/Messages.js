import React from 'react';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectIsPrivateChannel } from '../../redux/SidePanel/sidePanel.selectors';
import { connect } from 'react-redux';
import { setFileModal } from '../../redux/message/message.actions';
import firebase from '../../firebase/firebase.utils';
import moment from 'moment';
import './Messages.css';

class Messages extends React.Component {
  state = {
    privateMessagesRef: firebase.database().ref('privateMessages'),
    messagesRef: firebase.database().ref('messages'),
    message: '',
    searchTerm: '',
    loading: false,
    currentMessages: '',
    channel: this.props.currentChannel,
    numUniqueUsers: 0,
    isExecuted: true,
    searchResults: [],
    isSearching: false,
    listeners: []
  };

  handleChange = e => {
    this.setState({ message: e.target.value });
  };
  handleChangeSearch = e => {
    this.setState(
      {
        searchTerm: e.target.value,
        isSearching: true
      },
      () => this.handleSearchMessages()
    );
  };
  handleSearchMessages = () => {
    const { currentMessages, searchTerm } = this.state;
    var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);
    if (currentMessages) {
      const results = currentMessages.reduce((acc, mess) => {
        if (
          !mess.message.content.match(regex) &&
          mess.message.content.toLowerCase().includes(searchTerm.toLowerCase())
        ) {
          acc.push(mess.message);
        }
        return acc;
      }, []);

      this.setState({ searchResults: results });
      this.setState({ isSearching: false });
    }
  };

  static getDerivedStateFromProps(props, state) {
    if (props.currentChannel !== state.channel) {
      return {
        channel: props.currentChannel
      };
    }
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.currentChannel !== this.props.currentChannel) {
      this.addMessages();
    }
  }

  addMessages = () => {
    const { isPrivateChannel, currentChannel } = this.props;
    const { privateMessagesRef, messagesRef } = this.state;

    let loadedMessages = [];
    const ref = isPrivateChannel ? privateMessagesRef : messagesRef;
    ref.child(currentChannel.id).on('child_added', snap => {
      loadedMessages.push(snap.val());
      this.setState({ currentMessages: loadedMessages });
      this.countUniqueUsers(loadedMessages);
    });
    this.addToListeners(currentChannel.id, ref, 'child_added');
  };

  componentWillUnmount() {
    this.removeListeners(this.state.listeners);
  }

  removeListeners = listeners => {
    listeners.forEach(listener => {
      listener.ref.child(listener.id).off(listener.event);
    });
  };

  addToListeners = (id, ref, event) => {
    const index = this.state.listeners.findIndex(listener => {
      return (
        listener.id === id && listener.ref === ref && listener.event === event
      );
    });

    if (index === -1) {
      const newListener = { id, ref, event };
      this.setState({ listeners: this.state.listeners.concat(newListener) });
    }
  };

  countUniqueUsers = messages => {
    const uniqueUserCount = messages.reduce((acc, mess) => {
      if (!acc.includes(mess.message.user.name)) {
        acc.push(mess.message.user.name);
      }
      return acc;
    }, []);
    this.setState({ numUniqueUsers: uniqueUserCount.length });
  };

  sendMessage = () => {
    const { message, privateMessagesRef, messagesRef } = this.state;
    const { currentChannel, currentUser, isPrivateChannel } = this.props;
    if (message) {
      this.setState({ loading: true });
      (isPrivateChannel ? privateMessagesRef : messagesRef)
        .child(currentChannel.id)
        .push()
        .set({
          message: {
            timestamp: firebase.database.ServerValue.TIMESTAMP,
            user: {
              id: currentUser.uid,
              name: currentUser.displayName,
              avatar: currentUser.photoURL
            },
            content: message
          }
        })
        .then(() => this.setState({ loading: false }))
        .catch(error => {
          console.error(error);
          this.setState({ loading: false });
        });
      this.setState({ message: '' });
    }
  };

  render() {
    //prettier-ignore
    const {currentMessages,numUniqueUsers,searchTerm,searchResults,message,isSearching,loading} = this.state;

    const { uploadState, percentUploaded, currentChannel } = this.props;

    var expression = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(expression);

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
                  onChange={this.handleChangeSearch}
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
            {searchTerm
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
                              ? moment(mes.timestamp).fromNow()
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
                              ? moment(mes.message.timestamp).fromNow()
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
                onChange={this.handleChange}
                placeholder="Write your message"
              />
            </div>
            <div className="button-group d-flex justify-content-center align-items-center">
              <button
                type="button"
                disabled={loading}
                className="btn btn-warning btn-block"
                onClick={this.sendMessage}
              >
                <i className="far fa-edit text-light float-left mt-1"></i>
                Add Reply
              </button>
              <button
                type="button"
                className="btn btn-success btn-block mb-2"
                onClick={() => this.props.setFileModal()}
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
}

const mapStateToProps = state => ({
  currentUser: selectCurrentUser(state),

  uploadState: state.message.uploadState,
  percentUploaded: state.message.percentUploaded,
  isPrivateChannel: selectIsPrivateChannel(state)
});
const mapDispatchToProps = dispatch => ({
  setFileModal: () => dispatch(setFileModal())
});

export default connect(mapStateToProps, mapDispatchToProps)(Messages);
