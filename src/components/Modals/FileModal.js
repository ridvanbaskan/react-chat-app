import React from 'react';
import { selectCurrentUser } from '../../redux/user/user.selectors';
//prettier-ignore
import {selectCurrentChannel,selectIsPrivateChannel} from '../../redux/SidePanel/sidePanel.selectors';
import { connect } from 'react-redux';
import firebase from '../../firebase/firebase.utils';
//prettier-ignore
import {uploadState,percentUploaded,closeUploadState} from '../../redux/message/message.actions';
import mime from 'mime-types';
import { v4 as uuidv4 } from 'uuid';

function FileModal({
  closeFileModal,
  currentChannel,
  currentUser,
  uploadState,
  closeUploadState,
  percentUploaded,
  isPrivateChannel
}) {
  var messagesRef = firebase.database().ref('messages');
  var privateMessagesRef = firebase.database().ref('privateMessages');
  const [file, setFile] = React.useState(null);
  const [authorized] = React.useState(['image/jpeg', 'image/png']);

  const sendFileMessage = fileUrl => {
    (isPrivateChannel ? privateMessagesRef : messagesRef)
      .child(currentChannel.id)
      .push()
      .set({
        message: {
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          user: {
            id: currentUser.uid,
            name: currentUser.displayName,
            avatar: currentUser.photoURL
          },
          content: fileUrl
        }
      })
      .catch(error => {
        console.error(error);
      });
    setFile(null);
    closeFileModal();
    closeUploadState();
  };
  const addFile = e => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
    }
  };

  const sendFile = e => {
    e.preventDefault();
    if (file !== null) {
      if (authorized.includes(mime.lookup(file.name))) {
        const metadata = { contentType: mime.lookup(file.name) };
        uploadFile(file, metadata);
      }
    }
  };
  const getPath = () => {
    if (isPrivateChannel) {
      return `chat/private-${currentChannel.id}`;
    } else {
      return `chat/public`;
    }
  };
  const uploadFile = (file, metadata) => {
    var storageRef = firebase.storage().ref();
    uploadState();
    const filePath = `${getPath()}/${uuidv4()}.jpg`;
    var uploadTask = storageRef.child(filePath).put(file, metadata);
    uploadTask.on(
      'state_changed',
      function(snapshot) {
        const percent = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        percentUploaded(percent);
      },
      function(error) {
        console.error(error);
        uploadTask = null;
      },
      function() {
        uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL) {
          sendFileMessage(downloadURL);
        });
      }
    );
  };

  return (
    <div className="channel-modal">
      <div className="channel-row row">
        <div className="col">
          <h5 className="text-light mb-5">Select an Image File</h5>
          <form onSubmit={sendFile}>
            <div className="input-group mb-3">
              <div className="input-group-prepend">
                <span
                  className="input-group-text"
                  id="inputGroup-sizing-default"
                >
                  File types: jpg,png
                </span>
              </div>
              <div className="custom-file">
                <input
                  type="file"
                  name="file"
                  className="custom-file-input"
                  onChange={addFile}
                  id="inputGroupFile01"
                  aria-describedby="inputGroupFileAddon01"
                />
                <label className="custom-file-label" htmlFor="inputGroupFile01">
                  {file ? file.name : 'Choose file'}
                </label>
              </div>
            </div>

            <button className="close-modal btn btn-outline-success float-right">
              <i className="fas fa-check mr-2"></i>
              Send
            </button>
          </form>
          <button
            className="btn btn-outline-danger float-right mr-3"
            onClick={() => closeFileModal()}
          >
            <i className="fas fa-times-circle mr-2"></i>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
const mapStateToProps = state => ({
  currentUser: selectCurrentUser(state),
  currentChannel: selectCurrentChannel(state),
  isPrivateChannel: selectIsPrivateChannel(state)
});

const mapDispatchToProps = dispatch => ({
  uploadState: () => dispatch(uploadState()),
  percentUploaded: percent => dispatch(percentUploaded(percent)),
  closeUploadState: () => dispatch(closeUploadState())
});

export default connect(mapStateToProps, mapDispatchToProps)(FileModal);
