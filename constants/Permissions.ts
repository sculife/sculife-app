const PERMISSIONS = {
  ADMIN: 1 << 0,

  CREATE_DEPARTMENTS: 1 << 1,
  DELETE_DEPARTMENTS: 1 << 2,

  CREATE_POSTS: 1 << 3,
  DELETE_POSTS: 1 << 4,

  CREATE_USERS: 1 << 5,
  DELETE_USERS: 1 << 6,
  // MANAGE_USERS: 1 << 7, // included create, change and delete
};

export default PERMISSIONS;
