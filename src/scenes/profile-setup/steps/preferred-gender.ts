import { Markup } from 'telegraf'
import { BaseStep } from '../../base-step.ts'
import PreferredGenderService from '../service/prefer-gender.ts'
import type { ProfileSetupWizardContext as Context, PreferredGender, PreferredGenderAction } from '../types.ts'

export class PreferredGenderStep extends BaseStep {
  isRedraw = true
  async execute(ctx: Context) {
    if (!ctx.wizard.state.preferGenders) {
      ctx.wizard.state.preferGenders = []
    }

    await ctx[this.replyMethod](
      '🧑🤝👧 Выберите предпочтительный пол оппонентов',
      Markup.inlineKeyboard(PreferredGenderService.getGendersKeyboard(ctx.wizard.state?.preferGenders as PreferredGender[]))
    )
  }

  async handleInput(ctx: Context, action: PreferredGenderAction) {
    if (action === 'preferred-gender_done') {
      if (!ctx.wizard.state.preferGenders?.length ||
        PreferredGenderService.preferredGenderKeys.every(age => ctx.wizard.state.preferGenders?.includes(age))) {
        ctx.wizard.state.preferGenders = [ 'all' ]
      }
      return true
    } else {
      const preferredGender = this.getDataFromAction(action) as PreferredGender
      if (ctx.wizard.state.preferGenders?.includes(preferredGender)) {
        ctx.wizard.state.preferGenders = ctx.wizard.state.preferGenders.filter(gender => gender !== preferredGender)
      } else {
        ctx.wizard.state.preferGenders?.push(preferredGender)
      }
      this.isRedraw = true
      return await this.execute(ctx)
    }
  }
}