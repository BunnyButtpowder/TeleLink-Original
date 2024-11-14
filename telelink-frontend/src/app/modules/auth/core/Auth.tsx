/* eslint-disable react-refresh/only-export-components */
import { FC, useState, useEffect, createContext, useContext, Dispatch, SetStateAction } from 'react'
import { LayoutSplashScreen } from '../../../../_metronic/layout/core'
import { AuthModel, UserModel } from './_models'
import * as authHelper from './AuthHelpers'
import { getUserByToken } from './_requests'
import { WithChildren } from '../../../../_metronic/helpers'

type AuthContextProps = {
  auth: AuthModel | undefined
  saveAuth: (auth: AuthModel | undefined) => void
  currentUser: UserModel | undefined
  setCurrentUser: Dispatch<SetStateAction<UserModel | undefined>>
  setCurrentUserData: (data: Partial<UserModel>) => void;
  logout: () => void
}

const initAuthContextPropsState = {
  auth: authHelper.getAuth(),
  saveAuth: () => { },
  currentUser: undefined,
  setCurrentUser: () => { },
  setCurrentUserData: () => { },
  logout: () => { },
}

const AuthContext = createContext<AuthContextProps>(initAuthContextPropsState)

const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context;
}

const AuthProvider: FC<WithChildren> = ({ children }) => {
  const [auth, setAuth] = useState<AuthModel | undefined>(authHelper.getAuth())
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>(() => {
    const storedUser = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser')!) : null;
    if (storedUser && storedUser.id) {
      try {
        const dataDetailsKey = localStorage.getItem(`dataDetails_${storedUser.id}`);
        storedUser.dataDetails = dataDetailsKey ? JSON.parse(dataDetailsKey) : null;
      } catch (error) {
        console.error('Error parsing dataDetails:', error);
        storedUser.dataDetails = null;
      }
    }
    return storedUser;
  });

  const saveAuth = (auth: AuthModel | undefined) => {
    setAuth(auth)
    if (auth) {
      authHelper.setAuth(auth)
    } else {
      authHelper.removeAuth()
    }
  }

  const setCurrentUserData = (data: Partial<UserModel>) => {
    setCurrentUser((prevUser) => {
      const updatedUser: UserModel = { ...prevUser, ...data } as UserModel;
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      return updatedUser;
    });
  };

  useEffect(() => {
    const userId = currentUser?.id;

    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      if (currentUser.dataDetails) {
        localStorage.setItem(`dataDetails_${userId}`, JSON.stringify(currentUser.dataDetails));
      } else {
        localStorage.removeItem(`dataDetails_${userId}`);
      }
    } else {
      localStorage.removeItem('currentUser');
      if (userId) {
        localStorage.removeItem(`dataDetails_${userId}`);
      }
    }
  }, [currentUser]);

  const logout = () => {
    saveAuth(undefined)
    setCurrentUser(undefined)
  }

  return (
    <AuthContext.Provider value={{ auth, saveAuth, currentUser, setCurrentUser, setCurrentUserData, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

const AuthInit: FC<WithChildren> = ({ children }) => {
  const { auth, currentUser, logout, setCurrentUser } = useAuth()
  const [showSplashScreen, setShowSplashScreen] = useState(true)

  // We should request user by authToken (IN OUR EXAMPLE IT'S API_TOKEN) before rendering the application
  useEffect(() => {
    const requestUser = async (apiToken: string) => {
      try {
        if (!currentUser) {
          const { data } = await getUserByToken(apiToken)
          if (data) {
            setCurrentUser(data) // Set current user
          }
        }
      } catch (error) {
        console.error('Error while fetching user by token', error)
        if (currentUser) {
          logout()
        }
      } finally {
        setShowSplashScreen(false)
      }
    }

    if (auth && auth.api_token) {
      requestUser(auth.api_token);  // Verify token using /verify_token endpoint
    } else {
      logout();
      setShowSplashScreen(false);
    }
    // eslint-disable-next-line
  }, [])

  return showSplashScreen ? <LayoutSplashScreen /> : <>{children}</>
}

export { AuthProvider, AuthInit, useAuth }
