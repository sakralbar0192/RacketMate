import { Markup } from 'telegraf';
import { type ProfileSetupWizardContext } from '../index.ts';

export class TimeSelectionStep {
  static async execute(ctx: ProfileSetupWizardContext) {
    const state = ctx.wizard.state;
    
    if (!state.selectedDays) {
      state.selectedDays = [];
    }

    await ctx.reply(
      'Пока не реализовано',
      Markup.inlineKeyboard([Markup.button.callback('Ну и нафига это тут тогда?', 'time_done')])
    );
  }

  static async handleInput(ctx: ProfileSetupWizardContext, action: string) {
    const state = ctx.wizard.state;
    
    return Boolean(state && action);
  }
}