import { LocalCommandDefinition, CommandCategory } from '../types';
import { APPLICATION_COMMANDS_META } from './applicationCommands';
import { WINDOWS_COMMANDS_META } from './windowsCommands';
import { FILE_COMMANDS_META } from './fileCommands';
import { BROWSER_COMMANDS_META } from './browserCommands';
import { SYSTEM_COMMANDS_META } from './systemCommands';

export const ALL_COMMANDS_META: LocalCommandDefinition[] = [
  ...APPLICATION_COMMANDS_META,
  ...WINDOWS_COMMANDS_META,
  ...FILE_COMMANDS_META,
  ...BROWSER_COMMANDS_META,
  ...SYSTEM_COMMANDS_META,
];

export function getCommandsByCategory(category: CommandCategory): LocalCommandDefinition[] {
  return ALL_COMMANDS_META.filter(c => c.category === category);
}

export function getCommandsByPlugin(pluginId: string): LocalCommandDefinition[] {
  return ALL_COMMANDS_META.filter(c => c.pluginId === pluginId);
}

export function findCommandById(id: string): LocalCommandDefinition | undefined {
  return ALL_COMMANDS_META.find(c => c.id === id);
}
