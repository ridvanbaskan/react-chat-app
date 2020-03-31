import { createSelector } from 'reselect';

const selectSidePanel = state => state.sidePanel;

export const selectCurrentChannel = createSelector(
  [selectSidePanel],
  sidePanel => sidePanel.currentChannel
);
export const selectIsPrivateChannel = createSelector(
  [selectSidePanel],
  sidePanel => sidePanel.isPrivateChannel
);
