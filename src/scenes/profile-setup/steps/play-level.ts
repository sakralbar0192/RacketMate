import { Markup } from 'telegraf'
import { BaseStep } from '../../base-step.ts'
import PlayLevelService from '../services/play-level.ts'
import type { ProfileSetupWizardContext as Context, PlayLevel, PlayLevelAction } from '../types.ts'
import turnDataIntoAction from '../../../utils/turn-data-into-action.ts'

export class PlayLevelStep extends BaseStep {
  isFirstStep = true

  async execute(ctx: Context) {
    if (!ctx.wizard.state.level) {
      ctx.wizard.state.level = PlayLevelService.defaultLevel
    }

    await ctx[this.replyMethod](
      '🎾 Выберите ваш уровень игры',
      Markup.inlineKeyboard(
        PlayLevelService.playLevelEntries
          .map(([ key,  level ]) => [ Markup.button.callback(level, turnDataIntoAction(key, PlayLevelService.playLevelStepName)) ])
      )
    )
  }

  async handleInput(ctx: Context, action: PlayLevelAction) {
    const playLevel = this.getDataFromAction(action) as PlayLevel
    if (PlayLevelService.isLevelValid(playLevel)) {
      ctx.wizard.state.level = playLevel
      return true
    } else ctx.answerCbQuery('Неподходящее значение для уровня!')
  }
}