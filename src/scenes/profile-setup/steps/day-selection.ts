import { Markup } from 'telegraf'
import { type ProfileSetupWizardContext } from '../index.ts'
import { BaseStep } from '../../base-step.ts'
import type { dayKey } from '../service/week-day.ts'
import WeekDayService from '../service/week-day.ts'

export class DaySelectionStep extends BaseStep {
  async execute(ctx: ProfileSetupWizardContext) {
    if (!ctx.wizard.state.selectedDays) {
      ctx.wizard.state.selectedDays = []
    }
    const selectedDays = ctx.wizard.state.selectedDays
    await ctx[this.replyMethod](
      '📅 Выберите дни для игры (можно несколько):',
      Markup.inlineKeyboard(WeekDayService.getDaysKeyboard(selectedDays as dayKey[]))
    )
  }

  async handleInput(ctx: ProfileSetupWizardContext, action: dayKey | 'days_done') {
    let selectedDays = ctx.wizard.state.selectedDays as dayKey[]

    if (action === 'days_done') {
      if (!selectedDays?.length) {
        await ctx.answerCbQuery('Выберите хотя бы один день!')
      } else return true // Переход к следующему шагу
    } else {
      if (selectedDays?.includes(action)) {
        selectedDays = selectedDays.filter(d => d !== action)
      } else {
        selectedDays?.push(action)
      }
      ctx.wizard.state.selectedDays = selectedDays
      this.isRedraw = true
      return await this.execute(ctx) // Обновляем интерфейс
    }
  }
}