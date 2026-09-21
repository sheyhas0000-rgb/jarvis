import { LocalPlugin } from '../types';
import { StorageService } from './storageService';

export class PluginService {
  static getPlugins(): LocalPlugin[] {
    return StorageService.getPlugins();
  }

  static isPluginEnabled(pluginId: string): boolean {
    const plugins = this.getPlugins();
    const found = plugins.find(p => p.id === pluginId);
    return found ? found.enabled : true;
  }

  static togglePlugin(pluginId: string): LocalPlugin[] {
    const plugins = this.getPlugins();
    const updated = plugins.map(p => {
      if (p.id === pluginId) {
        const nextState = !p.enabled;
        return {
          ...p,
          enabled: nextState,
          status: nextState ? ('active' as const) : ('disabled' as const),
        };
      }
      return p;
    });
    StorageService.savePlugins(updated);
    return updated;
  }
}
