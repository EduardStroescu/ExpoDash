import { Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setLoading, setProfile, setSession } from "../features/authSlice";
import { supabase } from "../supabase/supabase";

export const useSession = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const updateProfile = async (session: Session | null) => {
      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single();
        dispatch(setProfile(data || null));
      }
      dispatch(setLoading(false));
    };

    const fetchSession = async () => {
      dispatch(setLoading(true));
      const {
        data: { session },
      } = await supabase.auth.getSession();
      dispatch(setSession(session));
    };

    fetchSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
      updateProfile(session);
    });
  }, []);
};
