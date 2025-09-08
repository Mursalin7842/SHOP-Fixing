import { createSlice, nanoid } from '@reduxjs/toolkit';

function loadFromStorage() {
  try {
    const raw = localStorage.getItem('seller_profile_state');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const initialState = loadFromStorage() || {
  id: nanoid(8),
  name: 'Demo Seller',
  email: 'seller@example.com',
  phone: '',
  avatarDataUrl: '',
  passwordMeta: {
    lastChangedAt: null,
  },
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    updateProfile(state, action) {
      const { name, phone } = action.payload;
      if (typeof name === 'string') state.name = name;
      if (typeof phone === 'string') state.phone = phone;
    },
    setAvatar(state, action) {
      state.avatarDataUrl = action.payload || '';
    },
    setPasswordMeta(state, action) {
      state.passwordMeta = { ...state.passwordMeta, ...action.payload };
    },
  },
});

export const { updateProfile, setAvatar, setPasswordMeta } = profileSlice.actions;
export default profileSlice.reducer;
