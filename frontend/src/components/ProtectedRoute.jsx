// import { Navigate } from "react-router-dom";

// export default function ProtectedRoute({ user, children }) {
//   if (!user) {
//     return <Navigate to="/login" />;
//   }

//   return children;
// }


// import { useEffect, useState } from "react";
// import { Navigate } from "react-router-dom";
// import { supabase } from "../supabase";

// export default function ProtectedRoute({ children }) {
//   const [session, setSession] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data }) => {
//       setSession(data.session);
//       setLoading(false);
//     });
//   }, []);

//   if (loading) return <p>Loading...</p>;

//   if (!session) return <Navigate to="/" />;

//   return children;
// }

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "../supabase";

export default function ProtectedRoute({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // Listen for login/logout changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!session) {
    return <Navigate to="/" replace />;
  }

  return children;
}