import axios from 'axios';

import Url from '@/constants/Url';
import {
  ApiObject,
  Department,
  Post,
  PostApiObject,
  User,
  UserApiObject,
} from '@/typings/api';
import findDepartment from './findDepartment';

export default async function handlePostObject(
  obj: PostApiObject,
  token: string
): Promise<Post> {
  let retObj = {
    author: null as User | null,
    department: null as Department | null,
  };

  try {
    const res = await axios.get(`${Url.BASE_URL}/api/users/${obj.authorUid}`, {
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    let { data } = res.data as ApiObject<UserApiObject>;
    let user = data as any as User;
    user.department = null;
    retObj.author = user;
  } catch (e) {
    console.log(
      'handlePostObject:',
      e,
      `${Url.BASE_URL}/api/users/${obj.authorUid}`
    );
  }

  if (obj.departmentId) {
    try {
      const res = await findDepartment(obj.departmentId);
      console.log(res);
      retObj.department = res;
    } catch (e) {
      console.log(
        'handlePostObject:',
        e,
        `${Url.BASE_URL}/api/departments/${obj.departmentId}`
      );
    }
  }

  return {
    ...obj,
    ...retObj,
  };
}
