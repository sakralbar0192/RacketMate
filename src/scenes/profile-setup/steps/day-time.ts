import { Markup } from 'telegraf'
import { BaseStep } from '../../base-step.ts'
import DayTimeService from '../service/day-time.ts'
import WeekDayService from '../service/week-day.ts'
import type { ProfileSetupWizardContext as Context, DayTime, DayTimeAction, WeekDay } from '../types.ts'

export class DayTimeStep extends BaseStep {
  isRedraw = true
  currentDay: WeekDay | null = null

  defineCurrentDay(selectedDays: WeekDay[] = [], dayTimes: Record<WeekDay, DayTime[]>, reset = false) {
    if (reset) this.currentDay = null
    return this.currentDay || selectedDays.find(day => !dayTimes[day]?.length)
  }

  async execute(ctx: Context) {
    if (!ctx.wizard.state.dayTimes) {
      ctx.wizard.state.dayTimes = {}
    }
    const selectedDays: WeekDay[] = ctx.wizard.state.selectedDays || []
    const dayTimes = ctx.wizard.state.dayTimes as Record<WeekDay, DayTime[]>
    const currentDay: WeekDay | undefined = this.defineCurrentDay(selectedDays, dayTimes)

    if (!currentDay) {
      await ctx.answerCbQuery('Выберите хотя бы один день!')
      ctx.wizard.back()
    } else {
      this.currentDay = currentDay
      await ctx[this.replyMethod](
        `⏰ ${WeekDayService.daysOfWeek[currentDay].name} - выберите время для игры  (можно несколько):`,
        Markup.inlineKeyboard(DayTimeService.getDaysKeyboard(dayTimes[currentDay] as DayTime[]))
      )
    }
  }

  async handleInput(ctx: Context, action: DayTimeAction) {
    const dayTimes = ctx.wizard.state.dayTimes as Record<WeekDay, DayTime[]>
    const selectedDays: WeekDay[] = ctx.wizard.state.selectedDays || []
    let  currentDay: WeekDay | undefined = this.defineCurrentDay(selectedDays, dayTimes)
    if (!currentDay) {
      await ctx.answerCbQuery('Выберите хотя бы один день!')
      ctx.wizard.back()
    } else {

      if (!dayTimes[currentDay]) dayTimes[currentDay] = []

      if (action === 'day-time_done') {
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
        const dayTime = this.getDataFromAction(action) as DayTime
        if (dayTimes[currentDay]?.includes(dayTime)) {
          dayTimes[currentDay] = dayTimes[currentDay].filter(time => time !== dayTime)
        } else {
          dayTimes[currentDay]?.push(dayTime)
        }
        ctx.wizard.state.dayTimes = dayTimes
        this.isRedraw = true
        this.execute(ctx)
      }
    }
  }
}