import { Markup } from 'telegraf';
import { type ProfileSetupWizardContext } from '../index.ts';

export class LevelSelectionStep {
  static async execute(ctx: ProfileSetupWizardContext) {
    const state = ctx.wizard.state;
    
    if (!state.level) {
      state.level = 'beginner';
    }

    await ctx.reply(
      '🎾 Выберите ваш уровень игры:',
      Markup.inlineKeyboard([
        [Markup.button.callback('Новичок', 'beginner')],
        [Markup.button.callback('Любитель', 'amateur')],
        [Markup.button.callback('Профессионал', 'pro')],
      ])
    );
  }

  static async handleInput(ctx: ProfileSetupWizardContext, action: string) {
    ctx.wizard.state.level = action === 'beginner' || action === 'amateur' || action === 'pro'
      ? action
      : 'beginner';
    return true;
  }
}