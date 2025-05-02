import { MODULES } from './enums/modules';
export interface PERMISSIONDATA {
  MODULE: string;
  CREATE: string;
  READ: string;
  UPDATE: string;
  DELETE: string;
  // DOWNLOAD: string;
}

export const PERMISSION_VERBS = [
  'CREATE',
  'READ',
  'UPDATE',
  'DELETE',
  // 'DOWNLOAD',
] as const;

export function PERMISSIONS(module_name: (typeof MODULES)[number]) {
  return PERMISSION_VERBS.reduce(
    (acc, current) => {
      acc = {
        ...acc,
        [current]: `${module_name}:${current}`,
      };
      return acc;
    },
    {} as Record<(typeof PERMISSION_VERBS)[number], string>,
  );
}

export type Module = typeof MODULES[number];

export type PermissionType =
  | 'CREATE'
  | 'READ'
  | 'UPDATE'
  | 'DELETE'
  // | 'DOWNLOAD';

export function formatPermission(
  module: Module,
  permissionType: PermissionType,
): string {
  return `${module}:${permissionType}`;
}
export function generateModulePermissions(module: Module): string[] {
  return PERMISSION_VERBS.map((permissionType) =>
    formatPermission(module, permissionType),
  );
}
export function generateModulePermissionsGrid(): PERMISSIONDATA[] {
  return MODULES.map((MODULE) => {
    const data: PERMISSIONDATA = {
      ...PERMISSION_VERBS.reduce(
        (prev, permission) => ({
          ...prev,
          [permission]: formatPermission(MODULE, permission),
        }),
        {} as PERMISSIONDATA,
      ),
      MODULE,
    };
    return data;
  });
}
