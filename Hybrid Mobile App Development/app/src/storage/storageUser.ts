import AsyncStorage from '@react-native-async-storage/async-storage';

// Type import
import { UserDTO } from '@dtos/UserDTO';

// Storage import
import { USER_STORAGE } from '@storage/storageConfig';

export const storageUserSave = async (user: UserDTO) => 
  await AsyncStorage.setItem(USER_STORAGE, JSON.stringify(user));

export async function storageUserGet() {
  const storage = await AsyncStorage.getItem(USER_STORAGE);

  const user: UserDTO = storage ? JSON.parse(storage) : ({} as UserDTO);

  return user;
}

export const storageUserRemove = async () => 
  await AsyncStorage.removeItem(USER_STORAGE);
