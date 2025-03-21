// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [userId, setUserId] = useState("");


//   return (
//     <AuthContext.Provider value={{ userId, setUserId }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };




// import React, { createContext, useState, useEffect } from 'react';
// import axios from 'axios';
// import Cookies from 'js-cookie';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [userId, setUserId] = useState("");

//   useEffect(() => {
//     const fetchUserId = async () => {
//       const token = Cookies.get('jwtToken');
//       if (!token) return;

//       try {
//         const { data } = await axios.post(
//           'https://pdf-flipper.vercel.app/checkAuth',
//           { token },
//           { withCredentials: true }
//         );

//         console.log("decodedtoken", data);
//         setUserId(data.userId);  
//       } catch (error) {
//         console.error("Token verification failed:", error);
//       }
//     };

//     fetchUserId();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ userId, setUserId }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);  // Initially null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = Cookies.get('jwtToken');
      if (!token) {
        setUserId(null);
        setLoading(false);
        return;
      }

      try {
        const { data } = await axios.post(
          'https://pdf-flipper.vercel.app/checkAuth',
          { token },
          { withCredentials: true }
        );

        console.log("Decoded Token:", data);
        setUserId(data.userId);
      } catch (error) {
        console.error("Token verification failed:", error);
        setUserId(null);
      }
      setLoading(false);
    };

    fetchUserId();
  }, []);

  return (
    <AuthContext.Provider value={{ userId, setUserId, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
