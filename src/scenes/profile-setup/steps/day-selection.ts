import { Markup } from 'telegraf';
import { type ProfileSetupWizardContext } from '../index.ts';

export class DaySelectionStep {
  static async execute(ctx: ProfileSetupWizardContext) {
    const state = ctx.wizard.state;
    
    if (!state.selectedDays) {
      state.selectedDays = [];
    }

    await ctx.reply(
      '📅 Выберите дни для игры (можно несколько):',
      Markup.inlineKeyboard([
        [
          Markup.button.callback(ctx.wizard.state.selectedDays?.includes('Пн') ? '✅ Пн' : 'Пн', 'day_mon'),
          Markup.button.callback(ctx.wizard.state.selectedDays?.includes('Вт') ? '✅ Вт' : 'Вт', 'day_tue'),
        ],
        [
          Markup.button.callback(ctx.wizard.state.selectedDays?.includes('Ср') ? '✅ Ср' : 'Ср', 'day_wed'),
          Markup.button.callback(ctx.wizard.state.selectedDays?.includes('Чт') ? '✅ Чт' : 'Чт', 'day_thu'),
        ],
        [
          Markup.button.callback(ctx.wizard.state.selectedDays?.includes('Пт') ? '✅ Пт' : 'Пт', 'day_fri'),
          Markup.button.callback(ctx.wizard.state.selectedDays?.includes('Сб') ? '✅ Сб' : 'Сб', 'day_sat'),
        ],
        [Markup.button.callback(ctx.wizard.state.selectedDays?.includes('Вс') ? '✅ Вс' : 'Вс', 'day_sun')],
        [Markup.button.callback('Готово', 'days_done')],
      ])
    );
  }

  static async handleInput(ctx: ProfileSetupWizardContext, action: string) {
    const state = ctx.wizard.state;
    const dayMap: Record<string, string> = {
      'day_mon': 'Пн', 'day_tue': 'Вт', /* ... */
    };

    if (action === 'days_done') {
      if (state.selectedDays?.length === 0) {
        await ctx.answerCbQuery('Выберите хотя бы один день!');
        return false;
      }
      return true; // Переход к следующему шагу
    }

    const day = dayMap[action];
    if (day) {
      if (state.selectedDays?.includes(day)) {
        state.selectedDays = state.selectedDays.filter((d: string) => d !== day);
      } else {
        state.selectedDays?.push(day);
      }
      await this.execute(ctx); // Обновляем интерфейс
    }
    return false;
  }
}