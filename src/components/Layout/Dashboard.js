import React from 'react';
import { connect } from 'react-redux';
import { selectCurrentUser } from '../../redux/user/user.selectors';
import { selectCurrentChannel } from '../../redux/SidePanel/sidePanel.selectors';
import ColorPanel from '../ColorPanel/ColorPanel';
import SidePanel from '../SidePanel/SidePanel';
import Messages from '../Messages/Messages';
import MetaPanel from '../MetaPanel/MetaPanel';

function Dashboard({ currentUser, currentChannel }) {
  return (
    <div>
      <div className="row" style={{ height: '100vh' }}>
        <div className="col-md-1 ml-4">
          <ColorPanel />
        </div>
        <div className="col-md-1">
          <SidePanel currentUser={currentUser} />
        </div>
        <div className="col-md-5 d-flex justify-content-center mt-3">
          <Messages currentChannel={currentChannel} />
        </div>
        <div className="col-md-4 d-flex justify-content-center mt-3">
          <MetaPanel />
        </div>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  currentUser: selectCurrentUser(state),
  currentChannel: selectCurrentChannel(state)
});

export default connect(mapStateToProps)(Dashboard);
