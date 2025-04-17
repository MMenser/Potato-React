import "./styles.css";
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { FIREBASE_AUTH } from '../firebase';
import Box from "./components/box";
import Login from "./components/login";
import { useEffect, useState } from "react";

function App() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user); // Ensure state updates
    });
    return unsubscribe; // Cleanup the listener
  }, []);


  return (
    <div>
      {user ? (<div className="bg-black min-h-screen flex flex-row">
        <div className="w-full">
          <Box id={1} />
        </div>

      </div>) : (
        <Login></Login>
      )}
    </div>


  );
}

export default App;

/*

      <div className="w-full flex-col">
        <div className="w-full h-1/2 flex-auto flex-row">
          <Box id={1} />
          <Box id={2} />
        </div>
      </div>

      <div className="w-full flex-col">
        <div className="w-full h-1/2 flex-auto flex-row">
          <Box id={3} />
          <Box id={4} />
        </div>
      </div>

*/