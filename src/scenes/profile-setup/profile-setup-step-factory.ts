import Schedule from '../../../db/models/Schedule.ts'
import Profile from '../../../db/models/Profile.ts'
import User from '../../../db/models/User.ts'
import { StepFactory } from '../step-factory.ts'
import DayTimeService from './service/day-time.ts'
import PlayLevelService from './service/play-level.ts'
import PlayerAgeService from './service/player-age.ts'
import PlayerGenderService from './service/player-gender.ts'
import PreferredAgeService from './service/prefer-age.ts'
import PreferredGenderService from './service/prefer-gender.ts'
import WeekDayService from './service/week-day.ts'
import type { DayTime, DayTimeAction, PlayerAgeAction, PlayerGenderAction, PlayLevel, PlayLevelAction, PreferredAge, PreferredAgeAction, PreferredGender, PreferredGenderAction, ProfileSetupActions, ProfileSetupWizardContext, StepKey, WeekDay, WeekDayAction } from './types.ts'
import { DayTimeStep } from './steps/day-time.ts'
import { PlayLevelStep } from './steps/play-level.ts'
import { PlayerAgeStep } from './steps/player-age.ts'
import { PlayerGenderStep } from './steps/player-gender.ts'
import { PreferredAgeStep } from './steps/preferred-age.ts'
import { PreferredGenderStep } from './steps/preferred-gender.ts'
import { WeekDayStep } from './steps/week-day.ts'

const playLevelStep = new PlayLevelStep()
const playerAgeStep = new PlayerAgeStep()
const playerGenderStep = new PlayerGenderStep()
const weekDayStep = new WeekDayStep()
const dayTimeStep = new DayTimeStep()
const preferredAgeStep = new PreferredAgeStep()
const preferredGenderStep = new PreferredGenderStep()

export const profileSetupStepFactory = new StepFactory<StepKey, ProfileSetupActions, ProfileSetupWizardContext>({
  steps: [
    {
      name: PlayLevelService.playLevelStepName,
      step: {
        execute: (ctx) => playLevelStep.execute(ctx),
        handleInput: (ctx, action: Extract<ProfileSetupActions, PlayLevelAction>) => playLevelStep.handleInput(ctx, action)
      }
    },
    {
      name: PlayerAgeService.playerAgeStepName,
      step: {
        execute: (ctx) => playerAgeStep.execute(ctx),
        handleInput: (ctx, action: Extract<ProfileSetupActions, PlayerAgeAction>) => playerAgeStep.handleInput(ctx, action)
      }
    },
    {
      name: PlayerGenderService.playerGenderStepName,
      step: {
        execute: (ctx) => playerGenderStep.execute(ctx),
        handleInput: (ctx, action: Extract<ProfileSetupActions, PlayerGenderAction>) => playerGenderStep.handleInput(ctx, action)
      }
    },
    {
      name: WeekDayService.WeekDayStepName,
      step: {
        execute: (ctx) => weekDayStep.execute(ctx),
        handleInput: (ctx, action: Extract<ProfileSetupActions, WeekDayAction>) => weekDayStep.handleInput(ctx, action)
      }
    },
    {
      name: DayTimeService.DayTimeStepName,
      step: {
        execute: (ctx) => dayTimeStep.execute(ctx),
        handleInput: (ctx, action: Extract<ProfileSetupActions, DayTimeAction>) => dayTimeStep.handleInput(ctx, action)
      }
    },
    {
      name: PreferredAgeService.PreferredAgeStepName,
      step: {
        execute: (ctx) => preferredAgeStep.execute(ctx),
        handleInput: (ctx, action: Extract<ProfileSetupActions, PreferredAgeAction>) => preferredAgeStep.handleInput(ctx, action)
      }
    },
    {
      name: PreferredGenderService.PreferredGenderStepName,
      step: {
        execute: (ctx) => preferredGenderStep.execute(ctx),
        handleInput: (ctx, action: Extract<ProfileSetupActions, PreferredGenderAction>) => preferredGenderStep.handleInput(ctx, action)
      }
    }
  ],
  defaultStep: PlayLevelService.playLevelStepName,
  finalizeFunction: async (ctx) => {
    try {
      let currentUser = await User.findByPk(ctx.from?.id)

      if (currentUser) {
        await currentUser.update({
          gender: ctx.wizard.state.gender,
          age: ctx.wizard.state.age
        })
      } else {
        currentUser = await User.create({
          id: ctx.from?.id || '',
          first_name: ctx.from?.first_name || '',
          username: ctx.from?.username || '',
          gender: ctx.wizard.state.gender,
          age: ctx.wizard.state.age
        })
      }

      console.log('User Save finished')

      let currentProfile = await Profile.findByPk(ctx.from?.id)

      if (currentProfile) {
        await currentProfile.update({
          gender: ctx.wizard.state.gender,
          age: ctx.wizard.state.age
        })
      } else {
        currentProfile = await Profile.create({
          user_id: ctx.from?.id || '',
          preferred_genders: ctx.wizard.state.preferGenders?.join(', '),
          preferred_ages: ctx.wizard.state.preferAges?.join(', '),
          play_level: ctx.wizard.state.level,
        })
      }

      console.log('Profile Save finished')

      let currentSchedule = await Schedule.findByPk(ctx.from?.id)

      if (currentSchedule) {
        await currentSchedule.update({
          monday: ctx.wizard.state.dayTimes?.monday.join(', ') || '',
          tuesday: ctx.wizard.state.dayTimes?.tuesday.join(', ') || '',
          wednesday: ctx.wizard.state.dayTimes?.wednesday.join(', ') || '',
          thursday: ctx.wizard.state.dayTimes?.thursday.join(', ') || '',
          friday: ctx.wizard.state.dayTimes?.friday.join(', ') || '',
          saturday: ctx.wizard.state.dayTimes?.saturday.join(', ') || '',
          sunday: ctx.wizard.state.dayTimes?.sunday.join(', ') || '',
        })
      } else {
        currentSchedule = await Schedule.create({
          user_id: ctx.from?.id || '',
          monday: (ctx.wizard.state.dayTimes?.monday || []).join(', ') || '',
          tuesday: (ctx.wizard.state.dayTimes?.tuesday || []).join(', ') || '',
          wednesday: (ctx.wizard.state.dayTimes?.wednesday || []).join(', ') || '',
          thursday: (ctx.wizard.state.dayTimes?.thursday || []).join(', ') || '',
          friday: (ctx.wizard.state.dayTimes?.friday || []).join(', ') || '',
          saturday: (ctx.wizard.state.dayTimes?.saturday || []).join(', ') || '',
          sunday: (ctx.wizard.state.dayTimes?.sunday || []).join(', ') || '',
        })
      }

      console.log('Schedule Save finished')
    } catch (e) {
      console.log('Error', e)
    }

    await ctx.editMessageText(
      '✅ Профиль настроен!\n\n' +
        `Уровень: ${PlayLevelService.getReadableLevelInfo(ctx.wizard.state.level as PlayLevel)}\n` +
        `Дни: ${WeekDayService.getReadableWeekDayInfo(ctx.wizard.state.selectedDays as WeekDay[])}\n` +
        `Время: ${DayTimeService.getReadableDayTimeInfo(ctx.wizard.state.dayTimes as Record<WeekDay, DayTime[]>)}\n` +
        `Предпочтительный возраст: ${PreferredAgeService.getReadablePreferredAgeInfo(ctx.wizard.state.preferAges as PreferredAge[])}\n` +
        `Предпочтительный пол: ${PreferredGenderService.getReadablePreferredGenderInfo(ctx.wizard.state.preferGenders as PreferredGender[])}\n`
    )
  }
})