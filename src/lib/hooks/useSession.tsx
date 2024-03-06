import { useEffect } from "react";
import { supabase } from "../supabase";
import { useDispatch } from "react-redux";
import { setLoading, setProfile, setSession } from "../features/authSlice";

export const useSession = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSession = async () => {
      dispatch(setLoading(true));
      const {
        data: { session },
      } = await supabase.auth.getSession();
      dispatch(setSession(session));

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

    fetchSession();
    supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession(session));
    });
  }, []);
};
