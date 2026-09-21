import { CommandExecutionResult, ParseResult } from '../types';
import { parseLocalCommand } from '../utils/parser';
import { PluginService } from './pluginService';
import { PermissionService } from './permissionService';
import { executeApplicationCommand } from '../commands/applicationCommands';
import { executeWindowsCommand } from '../commands/windowsCommands';
import { executeFileCommand } from '../commands/fileCommands';
import { executeBrowserCommand } from '../commands/browserCommands';
import { executeSystemCommand } from '../commands/systemCommands';

export class CommandService {
  static parse(rawInput: string): ParseResult {
    return parseLocalCommand(rawInput);
  }

  static async execute(rawInput: string, forceConfirmed: boolean = false): Promise<CommandExecutionResult> {
    const parsed = this.parse(rawInput);

    if (!parsed.recognized || !parsed.commandId) {
      const suggestionsText = (parsed.suggestedCommands || [])
        .map(c => `• "${c}"`)
        .join('\n');

      return {
        success: false,
        message: `❌ ${parsed.unrecognizedReason || 'Bu command JARVIS tomonidan qo‘llab-quvvatlanmaydi.'}\n\n💡 Mavjud lokal buyruqlar:\n${suggestionsText}\n\n⚙️ Barcha buyruqlarni ko‘rish uchun Sozlamalar -> Commandlar bo‘limiga kiring.`,
      };
    }

    // 1. Check Plugin status
    if (parsed.pluginId && !PluginService.isPluginEnabled(parsed.pluginId)) {
      return {
        success: false,
        message: `⚠️ Ushbu buyruqni bajarish uchun "${parsed.pluginId}" plugini o‘chirilgan.\n\nIltimos, yon menyudagi "Pluginlar" yoki "Sozlamalar" bo‘limiga o‘tib ushbu pluginni faollashtiring.`,
      };
    }

    // 2. Check Permission status
    if (parsed.permissionType && !PermissionService.isPermissionEnabled(parsed.permissionType)) {
      return {
        success: false,
        message: `⛔ Ushbu amal uchun kerak bo‘lgan huquq (${parsed.permissionType}) Sozlamalar -> Permissionlar bo‘limida o‘chirib qo‘yilgan.`,
      };
    }

    // 3. Check if Confirmation is required (and not yet confirmed)
    if (!forceConfirmed && parsed.permissionType) {
      const needsConfirm = PermissionService.doesRequireConfirmation(
        parsed.permissionType,
        parsed.requiresConfirmation
      );

      if (needsConfirm) {
        return {
          success: false,
          requiresConfirmation: true,
          permissionType: parsed.permissionType,
          confirmationMessage: parsed.confirmationMessage || `⚠️ Ushbu amal (${parsed.title}) kompyuteringizda bajarilishidan oldin tasdiqlashingiz kerak. Ruxsat berasizmi?`,
          message: 'Ushbu amal uchun ruxsat tasdig‘i kutilmoqda...',
        };
      }
    }

    // 4. Execute the command based on category
    try {
      const args = parsed.args || {};

      switch (parsed.category) {
        case 'applications':
          return await executeApplicationCommand(parsed.commandId);

        case 'windows':
          return await executeWindowsCommand(parsed.commandId, args);

        case 'files':
          return await executeFileCommand(parsed.commandId, args);

        case 'browser':
          return await executeBrowserCommand(parsed.commandId, args);

        case 'system':
        case 'automation': {
          if (parsed.commandId === 'sys_greeting') {
            return {
              success: true,
              message: `Salom, ser! Men 100% lokal rejimda ishlovchi JARVIS yordamchisiman. Hech qanday tashqi AI yoki internet LLM xizmatlariga bog‘lanmagan holda, to‘g‘ridan-to‘g‘ri kompyuteringiz dasturlari va tizim buyruqlarini bajarishga tayyorman.\n\nSizga qanday yordam bera olaman? (Masalan: "Chrome och", "Notepad och", "Downloads papkasini och", "Kompyuterni blokla")`,
              details: 'Rejim: Local Rule-Based Desktop Agent (No AI APIs)',
            };
          }
          return await executeSystemCommand(parsed.commandId);
        }

        default:
          return {
            success: false,
            message: '❌ Buyruq toifasi aniqlanmadi.',
          };
      }
    } catch (err: any) {
      return {
        success: false,
        message: `❌ Buyruqni bajarishda xatolik yuz berdi: ${err.message || 'Noma\'lum xato'}`,
      };
    }
  }
}
