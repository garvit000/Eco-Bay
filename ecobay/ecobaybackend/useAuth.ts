// lib/useAuth.ts
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './lib/firebase';

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Set the user when authentication state changes
      setLoading(false);
    });
    return () => unsubscribe(); // Cleanup when component unmounts
  }, []);

  return { user, loading };
};

export default useAuth;