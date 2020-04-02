import React from 'react';
import firebase from '../../firebase/firebase.utils';

export default function ChannelModal({ closeModal }) {
  const [channelName, setChannelName] = React.useState('');
  const [channelDetails, setChannelDetails] = React.useState('');

  const handleChannelName = e => {
    setChannelName(e.target.value);
  };
  const handleChannelDetails = e => {
    setChannelDetails(e.target.value);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    var channelsRef = firebase.database().ref('channels');
    const key = channelsRef.push().key;

    const newChannel = {
      id: key,
      name: channelName,
      details: channelDetails,
      createdBy: {
        name: firebase.auth().currentUser.displayName,
        avatar: firebase.auth().currentUser.photoURL
      }
    };

    await channelsRef
      .child(key)
      .update(newChannel)
      .then(() => {
        setChannelName('');
        setChannelDetails('');
        console.log('channel added');
      })
      .catch(err => {
        console.error(err);
      });
  };
  return (
    <div className="channel-modal">
      <div className="channel-row row">
        <div className="col">
          <h5 className="text-light mb-5">Add A Channel</h5>
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  Name of Channel
                </span>
              </div>
              <input
                type="text"
                value={channelName}
                className="form-control"
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
                onChange={handleChannelName}
              />
            </div>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  About the Channel
                </span>
              </div>
              <input
                type="text"
                className="form-control"
                value={channelDetails}
                aria-label="Sizing example input"
                aria-describedby="inputGroup-sizing-default"
                onChange={handleChannelDetails}
              />
            </div>

            <button className="close-modal btn btn-outline-success float-right">
              <i className="fas fa-check mr-2"></i>
              Add
            </button>
          </form>
          <button
            className="btn btn-outline-danger float-right mr-3"
            onClick={() => closeModal()}
          >
            <i className="fas fa-times-circle mr-2"></i>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
