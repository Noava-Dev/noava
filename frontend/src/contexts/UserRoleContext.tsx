import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useUser } from "@clerk/clerk-react";
import { authService } from "../services/AuthService";
import type { User, UserRole } from "../models/User";

interface UserRoleContextType {
  userRole: UserRole | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
}

export const UserRoleContext = createContext<UserRoleContextType>({
  userRole: null,
  loading: true,
  refreshUser: async () => {},
});

interface UserRoleProviderProps {
  children: ReactNode;
}

export const UserRoleProvider = ({ children }: UserRoleProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { isSignedIn, isLoaded } = useUser();
  const { getMe } = authService();

  const fetchUser = async () => {
    if (!isSignedIn) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const userData = await getMe();
      setUser(userData);
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoaded) {
      fetchUser();
    }
  }, [isLoaded, isSignedIn]);

  const refreshUser = async () => {
    setLoading(true);
    await fetchUser();
  };

  return (
    <UserRoleContext.Provider 
      value={{ 
        userRole: user?.role || null, 
        loading, 
        refreshUser 
      }}
    >
      {children}
    </UserRoleContext.Provider>
  );
};