import { CommandExecutionResult, ParseResult, SupportedLanguage } from '../types';
import { parseLocalCommand } from '../utils/parser';
import { PluginService } from './pluginService';
import { PermissionService } from './permissionService';
import { StorageService } from './storageService';
import { LogService } from './logService';
import { executeApplicationCommand } from '../commands/applicationCommands';
import { executeWindowsCommand } from '../commands/windowsCommands';
import { executeFileCommand } from '../commands/fileCommands';
import { executeBrowserCommand } from '../commands/browserCommands';
import { executeSystemCommand } from '../commands/systemCommands';
import { normalizeLang } from '../utils/i18n';

export class CommandService {
  static parse(rawInput: string): ParseResult {
    return parseLocalCommand(rawInput);
  }

  static async execute(
    rawInput: string, 
    forceConfirmed: boolean = false, 
    language?: string
  ): Promise<CommandExecutionResult> {
    const lang: SupportedLanguage = normalizeLang(language);
    const parsed = this.parse(rawInput);

    // Save to command history (last 20)
    StorageService.addCommandToHistory(rawInput);

    if (!parsed.recognized || !parsed.commandId) {
      const suggestionsText = (parsed.suggestedCommands || [])
        .map(c => `• "${c}"`)
        .join('\n');

      const fallbackMsg = lang === 'en'
        ? `❌ Unknown command. Type "help" to view all available commands and syntax.\n\n💡 Quick suggestions:\n${suggestionsText}\n\n⚙️ See Settings -> Commands Catalog for full list.`
        : lang === 'ru'
        ? `❌ Неизвестная команда. Введите "help", чтобы просмотреть список всех команд.\n\n💡 Быстрые подсказки:\n${suggestionsText}\n\n⚙️ Полный список смотрите в Настройки -> Каталог команд.`
        : `❌ Noma‘lum buyruq kiritildi. Barcha buyruqlar va qo‘llanmani ko‘rish uchun "help" deb yozing.\n\n💡 Tavsiya etilgan buyruqlar:\n${suggestionsText}\n\n⚙️ Barcha buyruqlarni ko‘rish uchun Sozlamalar -> Commandlar bo‘limiga kiring.`;

      LogService.addLog(rawInput, 'error', 'Command unrecognized. Recommended: help', 'unknown');

      return {
        success: false,
        message: fallbackMsg,
      };
    }

    // 1. Check Plugin status
    if (parsed.pluginId && !PluginService.isPluginEnabled(parsed.pluginId)) {
      const pluginMsg = lang === 'en'
        ? `⚠️ Plugin "${parsed.pluginId}" is disabled. Enable it in Plugins or Settings.`
        : lang === 'ru'
        ? `⚠️ Плагин "${parsed.pluginId}" отключен. Включите его в разделе «Плагины» или «Настройки».`
        : `⚠️ Ushbu buyruqni bajarish uchun "${parsed.pluginId}" plugini o‘chirilgan.\n\nIltimos, yon menyudagi "Pluginlar" yoki "Sozlamalar" bo‘limiga o‘tib ushbu pluginni faollashtiring.`;

      LogService.addLog(rawInput, 'error', `Plugin disabled: ${parsed.pluginId}`, parsed.category);

      return {
        success: false,
        message: pluginMsg,
      };
    }

    // 2. Check Permission status
    if (parsed.permissionType && !PermissionService.isPermissionEnabled(parsed.permissionType)) {
      const permMsg = lang === 'en'
        ? `⛔ Required permission (${parsed.permissionType}) is disabled in Settings -> Permissions.`
        : lang === 'ru'
        ? `⛔ Требуемое разрешение (${parsed.permissionType}) отключено в Настройки -> Разрешения.`
        : `⛔ Ushbu amal uchun kerak bo‘lgan huquq (${parsed.permissionType}) Sozlamalar -> Permissionlar bo‘limida o‘chirib qo‘yilgan.`;

      LogService.addLog(rawInput, 'error', `Permission denied: ${parsed.permissionType}`, parsed.category);

      return {
        success: false,
        message: permMsg,
      };
    }

    // 3. Check if Confirmation is required (and not yet confirmed)
    if (!forceConfirmed && parsed.permissionType) {
      const needsConfirm = PermissionService.doesRequireConfirmation(
        parsed.permissionType,
        parsed.requiresConfirmation
      );

      if (needsConfirm) {
        const confirmMsg = lang === 'en'
          ? `⚠️ Action (${parsed.title}) requires your confirmation before executing. Allow?`
          : lang === 'ru'
          ? `⚠️ Действие (${parsed.title}) требует вашего подтверждения перед запуском. Разрешить?`
          : `⚠️ Ushbu amal (${parsed.title}) kompyuteringizda bajarilishidan oldin tasdiqlashingiz kerak. Ruxsat berasizmi?`;

        LogService.addLog(rawInput, 'info', `Confirmation required: ${parsed.title}`, parsed.category);

        return {
          success: false,
          requiresConfirmation: true,
          permissionType: parsed.permissionType,
          confirmationMessage: parsed.confirmationMessage || confirmMsg,
          message: lang === 'en' 
            ? 'Waiting for security confirmation...' 
            : lang === 'ru' 
            ? 'Ожидание подтверждения безопасности...' 
            : 'Ushbu amal uchun ruxsat tasdig‘i kutilmoqda...',
        };
      }
    }

    // 4. Execute the command based on category
    try {
      const args = parsed.args || {};
      let result: CommandExecutionResult;

      switch (parsed.category) {
        case 'applications':
          result = await executeApplicationCommand(parsed.commandId, lang);
          break;

        case 'windows':
          result = await executeWindowsCommand(parsed.commandId, args);
          break;

        case 'files':
          result = await executeFileCommand(parsed.commandId, args);
          break;

        case 'browser':
          result = await executeBrowserCommand(parsed.commandId, args);
          break;

        case 'system':
        case 'automation': {
          if (parsed.commandId === 'sys_greeting') {
            const greetMsg = lang === 'en'
              ? `Hello, sir! I am JARVIS, your 100% local Windows assistant operating completely offline without any AI or cloud LLM dependencies.\n\nType "help" to view all available commands, or speak using the microphone button.`
              : lang === 'ru'
              ? `Здравствуйте, сэр! Я локальный ассистент JARVIS, работающий на 100% офлайн без внешних ИИ и сторонних API.\n\nВведите "help", чтобы просмотреть все команды, или воспользуйтесь голосовым вводом через микрофон.`
              : `Salom, ser! Men 100% lokal rejimda ishlovchi JARVIS yordamchisiman. Hech qanday tashqi AI yoki internet LLM xizmatlariga bog‘lanmagan holda, to‘g‘ridan-to‘g‘ri kompyuteringiz dasturlari va tizim buyruqlarini bajarishga tayyorman.\n\nBarcha buyruqlarni ko‘rish uchun "help" deb yozing yoki mikrofondan foydalaning.`;

            result = {
              success: true,
              message: greetMsg,
              details: 'Engine: Local Rule-Based Desktop Agent v1.5 (No AI APIs)',
            };
          } else {
            result = await executeSystemCommand(parsed.commandId, args, lang);
          }
          break;
        }

        default:
          result = {
            success: false,
            message: '❌ Buyruq toifasi aniqlanmadi / Unknown command category.',
          };
      }

      LogService.addLog(
        rawInput,
        result.success ? 'success' : 'error',
        result.windowsCommand || result.details || result.message.slice(0, 80),
        parsed.category
      );

      return result;
    } catch (err: any) {
      const errText = err.message || 'Noma\'lum xato';
      LogService.addLog(rawInput, 'error', errText, parsed.category);
      return {
        success: false,
        message: `❌ Buyruqni bajarishda xatolik: ${errText}`,
      };
    }
  }
}
