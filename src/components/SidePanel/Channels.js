import React from 'react';
import firebase, { firestore } from '../../firebase/firebase.utils';
import { connect } from 'react-redux';
import { selectCurrentChannel } from '../../redux/SidePanel/sidePanel.selectors';
import { selectChannels } from '../../redux/user/user.selectors';
import {
  setModal,
  setCurrentChannel,
  setPrivateChannel
} from '../../redux/SidePanel/sidePanel.actions';
import { fetchCollectionsStartAsync } from '../../redux/user/user.actions';
import './Channel.styles.css';
import WithSpinner from '../WithSpinner/WithSpinner';

function Channels({
  setModal,
  fetchCollectionsStartAsync,
  allChannels,
  setCurrentChannel,
  currentChannel,
  setPrivateChannel
}) {
  const [channel, setChannel] = React.useState(null);
  const [notifications, setNotifications] = React.useState([]);
  const [firstLoad, setFirstLoad] = React.useState(true);

  React.useEffect(() => {
    if (channel && currentChannel) {
      firestore
        .collection('channels')
        .doc(channel.id)
        .collection('messages')
        .onSnapshot(snapShot => {
          if (channel) {
            let lastTotal = 0;
            let index = notifications.findIndex(
              notification => notification.id === channel.id
            );

            if (index !== -1) {
              if (channel.id !== currentChannel.id) {
                lastTotal = notifications[index].total;
              }
              if (snapShot.docChanges().length - lastTotal > 0) {
                notifications[index].count =
                  snapShot.docChanges().length - lastTotal;
              }
              notifications[
                index
              ].lastKnownTotal = snapShot.docChanges().length;
            } else {
              notifications.push({
                id: channel.id,
                total: snapShot.docChanges().length,
                lastKnownTotal: snapShot.docChanges().length,
                count: 0
              });
            }
            setNotifications(notifications);
          }
        });
    }
  });

  React.useEffect(() => {
    fetchCollectionsStartAsync();
  }, [fetchCollectionsStartAsync]);

  const changeChannel = channel => {
    clearNotifications();
    setCurrentChannel(channel);
    setPrivateChannel(false);
    setChannel(channel);
  };

  const clearNotifications = () => {
    let index = notifications.findIndex(
      notification => notification.id === channel.id
    );
    if (index !== -1) {
      let updatedNotifications = [...notifications];
      updatedNotifications[index].total = notifications[index].lastKnownTotal;
      updatedNotifications[index].count = 0;
      setNotifications(updatedNotifications);
    }
  };

  if (allChannels) {
    const setFirstChannel = () => {
      const firstChannel = allChannels[0];
      if (firstLoad && allChannels.length > 0) {
        setCurrentChannel(firstChannel);
        setFirstLoad(false);
        setChannel(firstChannel);
      }
    };
    setFirstChannel();

    console.log(notifications);

    const getNotificationsCount = channel => {
      let count = 0;
      notifications.forEach(notification => {
        if (notification.id === channel.id) {
          count = notification.count;
        }
      });
      if (count > 0) {
        return count;
      }
    };
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
                  onClick={() => changeChannel(channel)}
                >
                  #{channel.name}
                  {getNotificationsCount(channel) && (
                    <p className="text-warning">{getNotificationsCount}</p>
                  )}
                </a>
              ))}
          </div>
        </div>
      </React.Fragment>
    );
  } else {
    return <WithSpinner />;
  }
}
const mapStateToProps = state => ({
  allChannels: selectChannels(state),
  currentChannel: selectCurrentChannel(state),
  isLoading: state.user.isLoading
});

const mapDispatchToProps = dispatch => ({
  setModal: () => dispatch(setModal()),
  fetchCollectionsStartAsync: () => dispatch(fetchCollectionsStartAsync()),
  setCurrentChannel: channel => dispatch(setCurrentChannel(channel)),
  setPrivateChannel: isPrivateChannel =>
    dispatch(setPrivateChannel(isPrivateChannel))
});

export default connect(mapStateToProps, mapDispatchToProps)(Channels);
