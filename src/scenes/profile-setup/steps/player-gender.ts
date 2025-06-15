import { Markup } from 'telegraf'
import { BaseStep } from '../../base-step.ts'
import type { ProfileSetupWizardContext as Context, PlayerGender, PlayerGenderAction } from '../types.ts'
import turnDataIntoAction from '../../../utils/turn-data-into-action.ts'
import PlayerGenderService from '../service/player-gender.ts'

export class PlayerGenderStep extends BaseStep {
  async execute(ctx: Context) {
    await ctx[this.replyMethod](
      '🧑🤝👧 Выберите ваш пол',
      Markup.inlineKeyboard(
        PlayerGenderService.playerGenderEntries
          .map(([ key,  gender ]) => [ Markup.button.callback(gender.shortName, turnDataIntoAction(key, PlayerGenderService.playerGenderStepName)) ])
      )
    )
  }

  async handleInput(ctx: Context, action: PlayerGenderAction) {
    const playerGender= this.getDataFromAction(action) as PlayerGender
    if (PlayerGenderService.isLevelValid(playerGender)) {
      ctx.wizard.state.gender = playerGender
      return true
    } else ctx.answerCbQuery('Неподходящее значение для пола!')
  }
}