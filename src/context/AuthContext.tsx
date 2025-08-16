import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type User = {
  user_id: string;
  email: string;
  access_token: string;
  firstname: string;
  lastname: string;
  phone: string;
  user_verified: boolean;
  referral_code: string;
  role: string;
  expires_at: number;
};

type AuthContextType = {
  user: User | null;
  login: (apiResponse: any) => void;
  logout: () => void;
  isLoading: boolean;
  updateUser: (updatedUser: Partial<User>) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 6 hours in milliseconds
const SESSION_DURATION = 6 * 60 * 60 * 1000;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Debug function to log auth state
  const logAuthState = (message: string) => {
    // console.log(`[Auth] ${message}`, {
    //   user,
    //   localStorage: {
    //     access_token: localStorage.getItem("access_token"),
    //     user: localStorage.getItem("user"),
    //     expires_at: localStorage.getItem("expires_at")
    //   }
    // });
  };

  const login = (apiResponse: {
    user: Omit<User, 'access_token' | 'expires_at'>;
    session: { access_token: string };
  }) => {
    try {
      const { user: userData, session } = apiResponse;
      const expires_at = Date.now() + SESSION_DURATION;
      
      const userWithToken = { 
        ...userData, 
        access_token: session.access_token,
        expires_at
      };

      localStorage.setItem("access_token", session.access_token);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("expires_at", expires_at.toString());
      
      setUser(userWithToken);
      logAuthState("Login successful");
    } catch (error) {
      // console.error("Login error:", error);
      logAuthState("Login failed");
      throw error;
    }
  };

  const logout = () => {
    logAuthState("Logging out");
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("expires_at");
    setUser(null);
  };

  const updateUser = (updatedUser: Partial<User>) => {
    if (!user) return;
    
    const newUser = { ...user, ...updatedUser };
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  useEffect(() => {
    const initializeAuth = () => {
      try {
        logAuthState("Initializing auth");
        
        const access_token = localStorage.getItem("access_token");
        const userData = localStorage.getItem("user");
        const expires_at = localStorage.getItem("expires_at");

        if (!access_token || !userData || !expires_at) {
          logAuthState("Missing auth data in localStorage");
          return;
        }

        const expirationTime = parseInt(expires_at, 10);
        
        if (isNaN(expirationTime)) {
          logAuthState("Invalid expiration time");
          localStorage.clear();
          return;
        }

        if (Date.now() < expirationTime) {
          const parsedUser = JSON.parse(userData);
          setUser({
            ...parsedUser,
            access_token,
            expires_at: expirationTime
          });
          logAuthState("Session restored");
        } else {
          logAuthState("Session expired");
          logout();
        }
      } catch (error) {
        // console.error("Auth initialization error:", error);
        logAuthState("Initialization error");
        localStorage.clear();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Set up interval to check for session expiration
    const checkSessionInterval = setInterval(() => {
      const expires_at = localStorage.getItem("expires_at");
      if (expires_at && Date.now() >= parseInt(expires_at, 10)) {
        logAuthState("Session expired (interval check)");
        logout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkSessionInterval);
  }, []);

  const contextValue = {
    user,
    login,
    logout,
    isLoading,
    updateUser
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};