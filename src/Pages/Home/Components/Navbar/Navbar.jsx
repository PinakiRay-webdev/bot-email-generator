import { useState, useEffect } from "react";
import { navItems } from "../../../../Utils/Utils";
import { supabase } from "../../../../../supabaseClient";
const Navbar = () => {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
  };

  const signUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        scopes: "https://www.googleapis.com/auth/calendar", // Request the calendar scope
      },
    });
  };

  return (
    <section className="h-fit">
      <nav className="px-12 flex h-[10vh] justify-between items-center">
        <h1 className="text-3xl font-semibold cursor-pointer">
          Smart<span className="text-purple-900">Draft</span>
        </h1>
        <div className="flex gap-5">
          {navItems.map((item) => (
            <p className="capitalize cursor-pointer font-semibold">{item}</p>
          ))}
        </div>
        {!session ? (
          <button onClick={signUp} className="bg-purple-900 px-5 py-2 rounded-2xl text-white cursor-pointer">
            Login
          </button>
        ) : (
          <button onClick={signOut} className="bg-purple-900 px-5 py-2 rounded-2xl text-white cursor-pointer">
            Logout
          </button>
        )}
      </nav>
    </section>
  );
};

export default Navbar;
