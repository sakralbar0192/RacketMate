import { Markup } from 'telegraf'
import { type ProfileSetupWizardContext } from '../index.ts'
import type { dayKey } from '../service/week-day.ts'
import type { timeKey } from '../service/day-time.ts'
import { BaseStep } from '../../base-step.ts'
import DayTimeService from '../service/day-time.ts'
import WeekDayService from '../service/week-day.ts'

export class TimeSelectionStep extends BaseStep {
  currentDay: dayKey | null = null

  defineCurrentDay(selectedDays: dayKey[] = [], dayTimes: Record<dayKey, timeKey[]>, reset = false) {
    if (reset) this.currentDay = null
    return this.currentDay || selectedDays.find(day => !dayTimes[day]?.length)
  }

  async execute(ctx: ProfileSetupWizardContext) {
    if (!ctx.wizard.state.dayTimes) {
      ctx.wizard.state.dayTimes = {}
    }
    const selectedDays: dayKey[] = ctx.wizard.state.selectedDays || []
    const dayTimes = ctx.wizard.state.dayTimes as Record<dayKey, timeKey[]>
    const currentDay: dayKey | undefined = this.defineCurrentDay(selectedDays, dayTimes)

    if (!currentDay) {
      await ctx.answerCbQuery('Выберите хотя бы один день!')
      ctx.wizard.back()
    } else {
      this.currentDay = currentDay

      await ctx[this.replyMethod](
        `📅 ${WeekDayService.daysOfWeek[currentDay].name} - выберите время для игры  (можно несколько):`,
        Markup.inlineKeyboard(DayTimeService.getDaysKeyboard(dayTimes[currentDay] as timeKey[]))
      )
    }
  }

  async handleInput(ctx: ProfileSetupWizardContext, action: timeKey | 'times_done') {
    const dayTimes = ctx.wizard.state.dayTimes as Record<dayKey, timeKey[]>
    const selectedDays: dayKey[] = ctx.wizard.state.selectedDays || []
    let  currentDay: dayKey | undefined = this.defineCurrentDay(selectedDays, dayTimes)
    if (!currentDay) {
      await ctx.answerCbQuery('Выберите хотя бы один день!')
      ctx.wizard.back()
    } else {

      if (!dayTimes[currentDay]) dayTimes[currentDay] = []

      if (action === 'times_done') {
        if (!dayTimes[currentDay]?.length) {
          await ctx.answerCbQuery('Выберите подходящее время!')
        } else {
          currentDay = this.defineCurrentDay(selectedDays, dayTimes, true)
          if (currentDay) {
            this.currentDay = currentDay
            this.execute(ctx)
          } else return true
        }
      } else {
        if (dayTimes[currentDay]?.includes(action)) {
          dayTimes[currentDay] = dayTimes[currentDay].filter(d => d !== action)
        } else {
          dayTimes[currentDay]?.push(action)
        }
        ctx.wizard.state.dayTimes = dayTimes
        this.isRedraw = true
        this.execute(ctx) // Обновляем интерфейс
      }
    }
  }
}