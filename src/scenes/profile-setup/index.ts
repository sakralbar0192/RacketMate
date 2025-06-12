import { Scenes } from "telegraf";
import { WizardScene } from "telegraf/scenes";
import { LevelSelectionStep } from "./steps/level-selection.ts";
import { DaySelectionStep } from "./steps/day-selection.ts";
import { TimeSelectionStep } from "./steps/time-selection.ts";

// 1. Типизируем состояние сцены
interface WizardState {
  level?: 'beginner' | 'amateur' | 'pro';
  selectedDays?: string[];
  dayTimes?: Record<string, string[]>;
}

// 2. Объявляем кастомный контекст
export interface ProfileSetupWizardContext extends Scenes.WizardContext {
  wizard: Scenes.WizardContextWizard<ProfileSetupWizardContext> & {
    state: WizardState; // Жёстко типизируем state
  };
}

// Сцена настройки профиля
export default new WizardScene<ProfileSetupWizardContext>(
  'profile-setup',
  // Шаг 1: Выбор уровня
  async (ctx) => {
    LevelSelectionStep.execute(ctx)
    return ctx.wizard.next();
  },
  // Шаг 2: Выбор дней недели
  async (ctx) => {
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const shouldProceed = await LevelSelectionStep.handleInput(ctx, ctx.callbackQuery.data);
      if (shouldProceed) {
        await DaySelectionStep.execute(ctx);
        return ctx.wizard.next();
      } else {
        await ctx.reply('❌ Ошибка: что то пошло не так');
        return ctx.scene.leave();
      }
    }
  },
  // Шаг 3 Выбор Времени игры
  async (ctx) => {
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const shouldProceed = await DaySelectionStep.handleInput(ctx, ctx.callbackQuery.data);
      if (shouldProceed) {
        await TimeSelectionStep.execute(ctx);
        return ctx.wizard.next();
      } else {
        await ctx.reply('❌ Ошибка: что то пошло не так');
        return ctx.scene.leave();
      }
    }
  },
  // Шаг 6: Финализация профиля
  async (ctx) => {
    // Здесь можно сохранить данные в БД
    await ctx.reply(
      `✅ Профиль настроен!\n\n` +
      `Уровень: ${ctx.wizard.state.level}\n` +
      `Дни: ${ctx.wizard.state.selectedDays?.join(', ')}\n` +
      `Время: ${Object.entries(ctx.wizard.state.dayTimes || {}).map(([day, times]) => `${day}: ${times.join(', ')}`).join('\n')}`
    );
    return ctx.scene.leave();
  }
);
