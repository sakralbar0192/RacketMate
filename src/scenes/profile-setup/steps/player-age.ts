import { Markup } from 'telegraf'
import { BaseStep } from '../../base-step.ts'
import type { ProfileSetupWizardContext as Context, PlayerAge, PlayerAgeAction } from '../types.ts'
import turnDataIntoAction from '../../../utils/turn-data-into-action.ts'
import PlayerAgeService from '../service/player-age.ts'

export class PlayerAgeStep extends BaseStep {
  async execute(ctx: Context) {
    await ctx[this.replyMethod](
      '🧓 Выберите вашу возрастную категорию',
      Markup.inlineKeyboard(
        PlayerAgeService.playerAgeEntries
          .map(([ key,  age ]) => [ Markup.button.callback(age.shortName, turnDataIntoAction(key, PlayerAgeService.playerAgeStepName)) ])
      )
    )
  }

  async handleInput(ctx: Context, action: PlayerAgeAction) {
    const playerAge = this.getDataFromAction(action) as PlayerAge
    if (PlayerAgeService.isLevelValid(playerAge)) {
      ctx.wizard.state.age = playerAge
      return true
    } else ctx.answerCbQuery('Неподходящее значение для возраста!')
  }
}