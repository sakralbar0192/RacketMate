import { Markup } from 'telegraf'
import { type ProfileSetupWizardContext } from '../index.ts'
import { BaseStep } from '../../base-step.ts'
import type { genderKey } from '../service/prefer-gender.ts'
import PreferredGenderService from '../service/prefer-gender.ts'

export class GenderSelectionStep extends BaseStep {
  async execute(ctx: ProfileSetupWizardContext) {
    if (!ctx.wizard.state.preferGenders) {
      ctx.wizard.state.preferGenders = []
    }

    await ctx[this.replyMethod](
      '🎾 Выберите предпочтительный пол оппонентов',
      Markup.inlineKeyboard(PreferredGenderService.getGendersKeyboard(ctx.wizard.state?.preferGenders as genderKey[]))
    )
  }

  async handleInput(ctx: ProfileSetupWizardContext, action: genderKey | 'preferred_gender_done') {
    if (action === 'preferred_gender_done') {
      if (!ctx.wizard.state.preferGenders?.length ||
        PreferredGenderService.preferredGenderKeys.every(age => ctx.wizard.state.preferGenders?.includes(age))) {
        ctx.wizard.state.preferGenders = [ 'all' ]
      }
      return true
    } else {
      if (ctx.wizard.state.preferGenders?.includes(action)) {
        ctx.wizard.state.preferGenders = ctx.wizard.state.preferGenders.filter(age => age !== action)
      } else {
        ctx.wizard.state.preferGenders?.push(action)
      }
      this.isRedraw = true
      return await this.execute(ctx) // Обновляем интерфейс
    }
  }
}