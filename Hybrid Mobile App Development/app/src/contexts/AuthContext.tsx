import { createContext, ReactNode, useEffect, useState } from 'react';
import { UserDTO } from '@dtos/UserDTO';
import { api } from '@services/api';
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from '@storage/storageUser';

// Type import 
import { IFeedback } from 'src/interfaces/IFeedback';
import { AppError } from '@utils/AppError';
import { useToast } from 'native-base';

export type AuthContextDataProps = {
  user: UserDTO;
  userFeedbacks: IFeedback[];
  fetchUserFeedback: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isLoadingUserStorageData: boolean;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps
);

function AuthContextProvider({ children }: AuthContextProviderProps) {
  const toast = useToast();
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [userFeedbacks, setUserFeedbacks] = useState<IFeedback[]>([]);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(true);

  async function signIn(email: string, password: string) {
    try {
      const { data } = await api.post('/login', { email, senha: password });

      await storageUserSave(data);
      setUser(data);
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível realizar o seu login. Tente novamente mais tarde.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function signOut() {
    try {
      setIsLoadingUserStorageData(true);

      setUser({} as UserDTO);
      return await storageUserRemove();
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível sair da sua conta. Tente novamente mais tarde.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  async function fetchUserFeedback() {
    try {
      if(user.id){
        const response = await api.get(`/usuarios/feedbacks/${user.id}`);
        setUserFeedbacks(response.data.content);
      }
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível buscar seus feedbacks. Tente novamente mais tarde.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  async function loadUserData() {
    try {
      setIsLoadingUserStorageData(true);

      const userLogged = await storageUserGet();

      if (userLogged) return setUser(userLogged);
    
    } catch (error) {
      const isAppError = error instanceof AppError;
      const title = isAppError
        ? error.message
        : 'Não foi possível buscar seus dados. Tente novamente mais tarde.';

      toast.show({
        title,
        placement: 'top',
        bgColor: 'red.500',
      });
    } finally {
      setIsLoadingUserStorageData(false);
    }
  }

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        userFeedbacks,
        fetchUserFeedback,
        signIn,
        signOut,
        isLoadingUserStorageData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthContextProvider };
