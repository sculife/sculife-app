import Url from '@/constants/Url';
import { ApiObject, DepartmentApiObject } from '@/typings/api';
import axios from 'axios';

export default async function findDepartment(departmentId: string) {
  const res = await axios.get(
    `${Url.BASE_URL}/api/departments/${departmentId}`
  );
  const { data } = res.data as ApiObject<DepartmentApiObject>;
  return data;
}
