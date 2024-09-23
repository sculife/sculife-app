import { create } from 'zustand';

interface UserStore {
  token: string;
  uid: string;
  permissions: number;
  setToken: (token: string) => void;
  setUid: (uid: string) => void;
  setPermissions: (permissions: number) => void;
}

const useUserStore = create<UserStore>((set) => ({
  token: '',
  uid: '',
  permissions: 0,
  setToken: (token) => {
    set((preData) => ({
      ...preData,
      token,
    }));
  },
  setUid: (uid) => {
    set((preData) => ({
      ...preData,
      uid,
    }));
  },
  setPermissions: (permissions) => {
    set((preData) => ({
      ...preData,
      permissions,
    }));
  },
}));

export default useUserStore;
