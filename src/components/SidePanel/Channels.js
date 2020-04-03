import React from 'react';
import firebase from '../../firebase/firebase.utils';
import { connect } from 'react-redux';
import { selectCurrentChannel } from '../../redux/SidePanel/sidePanel.selectors';
import {
  setModal,
  setCurrentChannel,
  setPrivateChannel
} from '../../redux/SidePanel/sidePanel.actions';
import './Channel.styles.css';

class Channels extends React.Component {
  state = {
    channelsRef: firebase.database().ref('channels'),
    messagesRef: firebase.database().ref('messages'),
    allChannels: [],
    firstLoad: true,
    notifications: [],
    channel: null
  };

  componentDidMount() {
    let loadedChannels = [];
    this.state.channelsRef.on('child_added', snap => {
      loadedChannels.push(snap.val());
      this.setState({ allChannels: loadedChannels }, () =>
        this.setFirstChannel()
      );
      this.addNotificationListener(snap.key);
    });
  }

  componentWillUnmount() {
    this.removeListeners();
  }

  removeListeners = () => {
    this.state.channelsRef.off();
    this.state.allChannels.forEach(channel => {
      this.state.messagesRef.child(channel.id).off();
    });
  };

  setFirstChannel = () => {
    const firstChannel = this.state.allChannels[0];
    if (this.state.firstLoad && this.state.allChannels.length > 0) {
      this.props.setCurrentChannel(firstChannel);
      this.setActiveChannel(firstChannel);
      this.setState({ channel: firstChannel });
    }
    this.setState({ firstLoad: false });
  };

  addNotificationListener = channelId => {
    const { messagesRef, notifications, channel } = this.state;
    const { currentChannel } = this.props;
    messagesRef.child(channelId).on('value', snap => {
      if (channel && currentChannel) {
        let lastTotal = 0;

        let index = notifications.findIndex(
          notification => notification.id === channelId
        );

        if (index !== -1) {
          if (channelId !== currentChannel.id) {
            lastTotal = notifications[index].total;

            if (snap.numChildren() - lastTotal > 0) {
              notifications[index].count = snap.numChildren() - lastTotal;
            }
          }
          notifications[index].lastKnownTotal = snap.numChildren();
        } else {
          notifications.push({
            id: channelId,
            total: snap.numChildren(),
            lastKnownTotal: snap.numChildren(),
            count: 0
          });
        }

        this.setState({ notifications });
      }
    });
  };

  changeChannel = channel => {
    this.setActiveChannel(channel);
    this.clearNotifications();
    this.props.setCurrentChannel(channel);
    this.props.setPrivateChannel(false);
    this.setState({ channel: channel });
  };

  setActiveChannel = channel => {
    this.setState({ activeChannel: channel.id });
  };

  clearNotifications = () => {
    let index = this.state.notifications.findIndex(
      notification => notification.id === this.state.channel.id
    );

    if (index !== -1) {
      let updatedNotifications = [...this.state.notifications];
      updatedNotifications[index].total = this.state.notifications[
        index
      ].lastKnownTotal;
      updatedNotifications[index].count = 0;
      this.setState({ notifications: updatedNotifications });
    }
  };

  getNotificationCount = channel => {
    let count = 0;

    this.state.notifications.forEach(notification => {
      if (notification.id === channel.id) {
        count = notification.count;
      }
    });

    if (count > 0) return count;
  };

  render() {
    const { setModal, currentChannel } = this.props;
    const { allChannels } = this.state;
    return (
      <React.Fragment>
        <div className="row">
          <div className="col mx-auto mt-2">
            <div className="ml-5 text-secondary">
              <span>
                <i className="fas fa-exchange-alt" /> CHANNELS
              </span>{' '}
              <span>
                ({allChannels.length}){' '}
                <i
                  className="fas fa-plus float-right mr-5 mt-1"
                  onClick={() => setModal()}
                />
              </span>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col mx-auto mt-3">
            {allChannels.length &&
              allChannels.map(channel => (
                <a
                  href="#/"
                  key={channel.id}
                  className={`text-secondary ml-5 p-0 ${
                    currentChannel && channel.id === currentChannel.id
                      ? 'text-light'
                      : null
                  }`}
                  onClick={() => this.changeChannel(channel)}
                >
                  #{channel.name}
                  {this.getNotificationCount(channel) && (
                    <span className="text-light ml-2 bg-danger px-2">
                      {this.getNotificationCount(channel)}
                    </span>
                  )}
                </a>
              ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
  currentChannel: selectCurrentChannel(state),
  isLoading: state.user.isLoading
});

const mapDispatchToProps = dispatch => ({
  setModal: () => dispatch(setModal()),
  setCurrentChannel: channel => dispatch(setCurrentChannel(channel)),
  setPrivateChannel: isPrivateChannel =>
    dispatch(setPrivateChannel(isPrivateChannel))
});

export default connect(mapStateToProps, mapDispatchToProps)(Channels);
