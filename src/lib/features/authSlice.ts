import { createSlice } from "@reduxjs/toolkit";
import { Session } from "@supabase/supabase-js";
import { Tables } from "../types";

export interface AuthState {
  session: Session | null;
  profile: Tables<"profiles"> | null;
  loading: boolean;
  isAdmin: boolean;
}

const initialState: AuthState = {
  session: null,
  profile: null,
  loading: false,
  isAdmin: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession: (state, action) => {
      state.session = action.payload;
    },
    setProfile: (state, action) => {
      state.profile = action.payload;
      if (action.payload && action.payload?.group === "ADMIN") {
        state.isAdmin = true;
      } else {
        state.isAdmin = false;
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setSession, setProfile, setLoading } = authSlice.actions;
export default authSlice.reducer;
