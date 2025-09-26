import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Playlist, MixCard } from '../../types';

interface PlaylistState {
  userPlaylists: Playlist[];
  topMixes: MixCard[];
  madeForYou: MixCard[];
  recentlyPlayed: MixCard[];
  jumpBackIn: MixCard[];
  uniquelyYours: MixCard[];
  justTheHits: MixCard[];
}

const initialState: PlaylistState = {
  userPlaylists: [],
  topMixes: [],
  madeForYou: [],
  recentlyPlayed: [],
  jumpBackIn: [],
  uniquelyYours: [],
  justTheHits: [],
};

const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    setTopMixes: (state, action: PayloadAction<MixCard[]>) => {
      state.topMixes = action.payload;
    },
    setMadeForYou: (state, action: PayloadAction<MixCard[]>) => {
      state.madeForYou = action.payload;
    },
    setRecentlyPlayed: (state, action: PayloadAction<MixCard[]>) => {
      state.recentlyPlayed = action.payload;
    },
    setJumpBackIn: (state, action: PayloadAction<MixCard[]>) => {
      state.jumpBackIn = action.payload;
    },
    setUniquelyYours: (state, action: PayloadAction<MixCard[]>) => {
      state.uniquelyYours = action.payload;
    },
    setJustTheHits: (state, action: PayloadAction<MixCard[]>) => {
      state.justTheHits = action.payload;
    },
    addPlaylist: (state, action: PayloadAction<Playlist>) => {
      state.userPlaylists.push(action.payload);
    },
  },
});

export const {
  setTopMixes,
  setMadeForYou,
  setRecentlyPlayed,
  setJumpBackIn,
  setUniquelyYours,
  setJustTheHits,
  addPlaylist,
} = playlistSlice.actions;

export default playlistSlice.reducer;
