import { Markup } from 'telegraf'
import { BaseStep } from '../../base-step.ts'
import WeekDayService from '../service/week-day.ts'
import type { ProfileSetupWizardContext as Context, WeekDay, WeekDayAction } from '../types.ts'

export class WeekDayStep extends BaseStep {
  isRedraw = true
  async execute(ctx: Context) {
    if (!ctx.wizard.state.selectedDays) {
      ctx.wizard.state.selectedDays = []
    }

    await ctx[this.replyMethod](
      '📅 Выберите дни для игры (можно несколько):',
      Markup.inlineKeyboard(WeekDayService.getDaysKeyboard(ctx.wizard.state.selectedDays))
    )
  }

  async handleInput(ctx: Context, action: WeekDayAction) {
    let selectedDays = ctx.wizard.state.selectedDays as WeekDay[]

    if (action === 'week-day_done') {
      if (!selectedDays?.length) {
        await ctx.answerCbQuery('Выберите хотя бы один день!')
      } else return true
    } else {
      const weekDay = this.getDataFromAction(action) as WeekDay
      if (selectedDays.includes(weekDay)) {
        selectedDays = selectedDays.filter(day => day !== weekDay)
      } else {
        selectedDays.push(weekDay)
      }
      ctx.wizard.state.selectedDays = selectedDays
      this.isRedraw = true
      this.execute(ctx)
    }
  }
}