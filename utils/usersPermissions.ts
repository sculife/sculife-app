import PERMISSIONS from "@/constants/Permissions";

export const addPermissions = (
  permissions: number,
  permission: keyof typeof PERMISSIONS
) => {
  return permissions | PERMISSIONS[permission];
};

export const hasPermissions = (
  permissions: number,
  permission: keyof typeof PERMISSIONS
) => {
  return (permissions & PERMISSIONS[permission]) === PERMISSIONS[permission];
};

export const removePermissions = (
  permissions: number,
  permission: keyof typeof PERMISSIONS
) => {
  return permissions & ~PERMISSIONS[permission];
};
