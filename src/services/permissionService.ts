import { PermissionType, PermissionSettings } from '../types';
import { StorageService } from './storageService';

export class PermissionService {
  static getPermissions(): PermissionSettings {
    const settings = StorageService.getSettings();
    return settings.permissions;
  }

  static isPermissionEnabled(type: PermissionType): boolean {
    const perms = this.getPermissions();
    return perms[type]?.enabled ?? true;
  }

  static doesRequireConfirmation(type: PermissionType, isDangerous: boolean = false): boolean {
    const perms = this.getPermissions();
    if (isDangerous) return true;
    return perms[type]?.requireConfirmation ?? false;
  }

  static updatePermission(type: PermissionType, enabled: boolean, requireConfirmation: boolean): void {
    const settings = StorageService.getSettings();
    settings.permissions[type] = {
      ...settings.permissions[type],
      enabled,
      requireConfirmation,
    };
    StorageService.saveSettings(settings);
  }
}
