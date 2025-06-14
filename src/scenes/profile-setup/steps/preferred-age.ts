import { Markup } from 'telegraf'
import { BaseStep } from '../../base-step.ts'
import PreferredAgeService from '../service/prefer-age.ts'
import type { ProfileSetupWizardContext as Context, PreferredAge, PreferredAgeAction } from '../types.ts'

export class PreferredAgeStep extends BaseStep {
  isRedraw = true
  async execute(ctx: Context) {
    if (!ctx.wizard.state.preferAges) {
      ctx.wizard.state.preferAges = []
    }

    await ctx[this.replyMethod](
      '🧓 Выберите предпочтительный возраст оппонентов',
      Markup.inlineKeyboard(PreferredAgeService.getAgesKeyboard(ctx.wizard.state?.preferAges as PreferredAge[]))
    )
  }

  async handleInput(ctx: Context, action: PreferredAgeAction) {
    if (action === 'preferred-age_done') {
      if (!ctx.wizard.state.preferAges?.length ||
        PreferredAgeService.preferredAgeKeys.every(age => ctx.wizard.state.preferAges?.includes(age))
      ) ctx.wizard.state.preferAges = [ 'all' ]

      return true
    } else {
      const preferredAge = this.getDataFromAction(action) as PreferredAge
      if (ctx.wizard.state.preferAges?.includes(preferredAge)) {
        ctx.wizard.state.preferAges = ctx.wizard.state.preferAges.filter(age => age !== preferredAge)
      } else {
        ctx.wizard.state.preferAges?.push(preferredAge)
      }
      this.isRedraw = true
      return await this.execute(ctx)
    }
  }
}