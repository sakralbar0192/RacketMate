import { Markup } from 'telegraf'
import { type ProfileSetupWizardContext } from '../index.ts'
import { BaseStep } from '../../base-step.ts'
import type { playLevel } from '../service/play-level.ts'
import PlayLevelService from '../service/play-level.ts'

export class LevelSelectionStep extends BaseStep {
  async execute(ctx: ProfileSetupWizardContext) {
    const state = ctx.wizard.state

    if (!state.level) {
      state.level = PlayLevelService.defaultLevel
    }

    await ctx[this.replyMethod](
      '🎾 Выберите ваш уровень игры',
      Markup.inlineKeyboard(
        PlayLevelService.playLevelEntries
          .map(([ key,  level ]) => [ Markup.button.callback(level, key) ])
      )
    )
  }

  async handleInput(ctx: ProfileSetupWizardContext, action: string) {
    if (PlayLevelService.isLevelValid(action)) {
      ctx.wizard.state.level = action as playLevel
      return true
    } else {
      this.isRedraw = true
      await ctx.answerCbQuery('Неподходящее значение для уровня!')
      return await this.execute(ctx) // Обновляем интерфейс
    }

  }
}