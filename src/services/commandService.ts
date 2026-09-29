import { CommandExecutionResult, ParseResult, SupportedLanguage } from '../types';
import { parseLocalCommand } from '../utils/parser';
import { PluginService } from './pluginService';
import { PermissionService } from './permissionService';
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

    if (!parsed.recognized || !parsed.commandId) {
      const suggestionsText = (parsed.suggestedCommands || [])
        .map(c => `• "${c}"`)
        .join('\n');

      const fallbackMsg = lang === 'en'
        ? `❌ ${parsed.unrecognizedReason || 'This command is not supported by JARVIS.'}\n\n💡 Available commands:\n${suggestionsText}\n\n⚙️ See Settings -> Commands Catalog for full list.`
        : lang === 'ru'
        ? `❌ ${parsed.unrecognizedReason || 'Данная команда не поддерживается JARVIS.'}\n\n💡 Доступные команды:\n${suggestionsText}\n\n⚙️ Полный список смотрите в Настройки -> Каталог команд.`
        : `❌ ${parsed.unrecognizedReason || 'Bu command JARVIS tomonidan qo‘llab-quvvatlanmaydi.'}\n\n💡 Mavjud lokal buyruqlar:\n${suggestionsText}\n\n⚙️ Barcha buyruqlarni ko‘rish uchun Sozlamalar -> Commandlar bo‘limiga kiring.`;

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

      switch (parsed.category) {
        case 'applications':
          return await executeApplicationCommand(parsed.commandId, lang);

        case 'windows':
          return await executeWindowsCommand(parsed.commandId, args);

        case 'files':
          return await executeFileCommand(parsed.commandId, args);

        case 'browser':
          return await executeBrowserCommand(parsed.commandId, args);

        case 'system':
        case 'automation': {
          if (parsed.commandId === 'sys_greeting') {
            const greetMsg = lang === 'en'
              ? `Hello, sir! I am JARVIS, your 100% local Windows assistant operating completely offline without any AI or cloud LLM dependencies.\n\nHow may I help you today? (e.g. "open calculator", "open cmd", "open clock", "open notepad", "open paint", "system status", "lock pc")`
              : lang === 'ru'
              ? `Здравствуйте, сэр! Я локальный ассистент JARVIS, работающий на 100% офлайн без внешних ИИ и сторонних API.\n\nЧем могу помочь? (Например: "open calculator", "open cmd", "open clock", "open notepad", "открыть проводник", "состояние системы", "заблокировать пк")`
              : `Salom, ser! Men 100% lokal rejimda ishlovchi JARVIS yordamchisiman. Hech qanday tashqi AI yoki internet LLM xizmatlariga bog‘lanmagan holda, to‘g‘ridan-to‘g‘ri kompyuteringiz dasturlari va tizim buyruqlarini bajarishga tayyorman.\n\nSizga qanday yordam bera olaman? (Masalan: "open calculator", "open cmd", "open clock", "open notepad", "open paint", "tizim holati", "Downloads papkasini och")`;

            return {
              success: true,
              message: greetMsg,
              details: 'Engine: Local Rule-Based Desktop Agent v1.4 (No AI APIs)',
            };
          }
          return await executeSystemCommand(parsed.commandId, args);
        }

        default:
          return {
            success: false,
            message: '❌ Buyruq toifasi aniqlanmadi / Unknown command category.',
          };
      }
    } catch (err: any) {
      return {
        success: false,
        message: `❌ Buyruqni bajarishda xatolik: ${err.message || 'Noma\'lum xato'}`,
      };
    }
  }
}
