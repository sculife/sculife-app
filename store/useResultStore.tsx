import { create } from 'zustand';

// TODO: find smth to replace `[key]: string`
const subjects: {
  [key: string]: string;
} = {
  BM: 'Bahasa Melayu',
  SEJ: 'Sejarah',
  AKAUN: 'Prinsip Akaun',
  BC: 'Bahasa Cina',
  BI: 'Bahasa Inggeris',
  BIO: 'Biology',
  CHE: 'Chemistry',
  EKO: 'Ekonomi',
  MM: 'Mathematics',
  MT: 'Matematik Tambahan',
  PHY: 'Physics',
  PI: 'Pendidikan Islam',
  PM: 'Pendidikan Moral',
  PN: 'Perniagaan',
  RC: 'Reka Cipta',
  SAINS: 'Science',
  SKOM: 'Sains Komputer',
  SSUKAN: 'Sains Sukan',
};

type ResultStoreData = {
  [key in keyof typeof subjects]: number;
};

interface ResultStore {
  data: ResultStoreData;
  setData: (callback: (preData: ResultStoreData) => ResultStoreData) => void;
}

const useResultStore = create<ResultStore>((set) => ({
  data: {},
  setData: (callback) => {
    set((preData) => ({
      data: { ...callback(preData.data) },
    }));
  },
}));

export default useResultStore;
export { subjects };
