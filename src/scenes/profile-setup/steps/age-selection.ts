import { Markup } from 'telegraf'
import { type ProfileSetupWizardContext } from '../index.ts'
import { BaseStep } from '../../base-step.ts'
import type { ageCategoryKey } from '../service/prefer-age.ts'
import PreferredAgeService from '../service/prefer-age.ts'

export class AgeSelectionStep extends BaseStep {
  async execute(ctx: ProfileSetupWizardContext) {
    if (!ctx.wizard.state.preferAges) {
      ctx.wizard.state.preferAges = []
    }

    await ctx[this.replyMethod](
      '🎾 Выберите предпочтительный возраст оппонентов',
      Markup.inlineKeyboard(PreferredAgeService.getAgesKeyboard(ctx.wizard.state?.preferAges as ageCategoryKey[]))
    )
  }

  async handleInput(ctx: ProfileSetupWizardContext, action: ageCategoryKey | 'preferred_age_done') {
    if (action === 'preferred_age_done') {
      if (!ctx.wizard.state.preferAges?.length ||
        PreferredAgeService.preferredAgeKeys.every(age => ctx.wizard.state.preferAges?.includes(age))) {
        ctx.wizard.state.preferAges = [ 'all' ]
      }
      return true
    } else {
      if (ctx.wizard.state.preferAges?.includes(action)) {
        ctx.wizard.state.preferAges = ctx.wizard.state.preferAges.filter(age => age !== action)
      } else {
        ctx.wizard.state.preferAges?.push(action)
      }
      this.isRedraw = true
      return await this.execute(ctx) // Обновляем интерфейс
    }
  }
}