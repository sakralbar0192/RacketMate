import { StepFactory } from '../../step-factory.ts'
import DayTimeService from '../service/day-time.ts'
import PlayLevelService from '../service/play-level.ts'
import PlayerAgeService from '../service/player-age.ts'
import PlayerGenderService from '../service/player-gender.ts'
import PreferredAgeService from '../service/prefer-age.ts'
import PreferredGenderService from '../service/prefer-gender.ts'
import WeekDayService from '../service/week-day.ts'
import type { DayTime, DayTimeAction, PlayerAgeAction, PlayerGenderAction, PlayLevel, PlayLevelAction, PreferredAge, PreferredAgeAction, PreferredGender, PreferredGenderAction, ProfileSetupActions, ProfileSetupWizardContext, StepKey, WeekDay, WeekDayAction } from '../types.ts'
import { DayTimeStep } from './day-time.ts'
import { PlayLevelStep } from './play-level.ts'
import { PlayerAgeStep } from './player-age.ts'
import { PlayerGenderStep } from './player-gender.ts'
import { PreferredAgeStep } from './preferred-age.ts'
import { PreferredGenderStep } from './preferred-gender.ts'
import { WeekDayStep } from './week-day.ts'

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