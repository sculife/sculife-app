import { User } from '@/typings/interfaces';
import { create } from 'zustand';

interface UserStore {
  uid: string;
  setUid: (uid: string) => void;
  user: Partial<User>;
  setUser: (user: Partial<User>) => void;
}

const useUserStore = create<UserStore>((set) => ({
  uid: '',
  setUid: (uid) => {
    set((preData) => ({
      ...preData,
      uid,
    }));
  },
  user: {},
  setUser: (user) => {
    set((preData) => ({
      ...preData,
      ...user,
    }));
  },
}));

export default useUserStore;
