import { WizardScene } from 'telegraf/scenes'
import type { ProfileSetupWizardContext as Context, ProfileSetupActions } from './types.ts'
import { profileSetupStepFactory } from './steps/profile-setup-step-factory.ts'

// Сцена настройки профиля
export default new WizardScene<Context>(
  'profile-setup',
  async (ctx) => {
    await profileSetupStepFactory.execute(ctx, profileSetupStepFactory.defaultStep)
    return ctx.wizard.next()
  },
  async (ctx) => {
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const nextStep = await profileSetupStepFactory.handle(
        ctx,
        ctx.callbackQuery.data as ProfileSetupActions
      )
      if (nextStep) {
        await profileSetupStepFactory.execute(ctx, nextStep)
      } else {
        profileSetupStepFactory.finalizeFunction(ctx)
        ctx.scene.leave()
      }
    }
  }
)
