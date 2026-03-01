import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user: null,
  loading: true,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload
    },
    clearUser(state) {
      state.user = null
    },
    setAuthLoading(state, action) {
      state.loading = action.payload
    },
  },
})

export const { setUser, clearUser, setAuthLoading } = userSlice.actions
export default userSlice.reducer
