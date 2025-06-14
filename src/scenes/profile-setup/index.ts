import type { Scenes } from 'telegraf'
import { WizardScene } from 'telegraf/scenes'
import { LevelSelectionStep } from './steps/level-selection.ts'
import { DaySelectionStep } from './steps/day-selection.ts'
import { TimeSelectionStep } from './steps/time-selection.ts'
import type { timeKey } from './service/day-time.ts'
import type { dayKey } from './service/week-day.ts'
import type { ageCategoryKey } from './service/prefer-age.ts'
import { AgeSelectionStep } from './steps/age-selection.ts'
import type { genderKey } from './service/prefer-gender.ts'
import { GenderSelectionStep } from './steps/gender-selection.ts'

// 1. Типизируем состояние сцены
interface WizardState {
  level?: 'beginner' | 'amateur' | 'pro';
  selectedDays?: dayKey[];
  dayTimes?: Record<dayKey, timeKey[]> | object;
  preferAges?: (ageCategoryKey | 'all')[];
  preferGenders?: (genderKey | 'all')[]
}

// 2. Объявляем кастомный контекст
export interface ProfileSetupWizardContext extends Scenes.WizardContext {
  wizard: Scenes.WizardContextWizard<ProfileSetupWizardContext> & {
    state: WizardState; // Жёстко типизируем state
  };
}

const levelSelectionStep = new LevelSelectionStep()
const daySelectionStep = new DaySelectionStep()
const timeSelectionStep = new TimeSelectionStep()
const ageSelectionStep = new  AgeSelectionStep()
const genderSelectionStep = new GenderSelectionStep()

// Сцена настройки профиля
export default new WizardScene<ProfileSetupWizardContext>(
  'profile-setup',
  // Шаг 1: Выбор уровня
  async (ctx) => {
    levelSelectionStep.execute(ctx)
    return ctx.wizard.next()
  },
  // Шаг 2: Выбор дней недели
  async (ctx) => {
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const shouldProceed = await levelSelectionStep.handleInput(ctx, ctx.callbackQuery.data)
      if (shouldProceed) {
        await daySelectionStep.execute(ctx)
        return ctx.wizard.next()
      }
    }
  },
  // Шаг 3 Выбор Времени игры
  async (ctx) => {
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const shouldProceed = await daySelectionStep.handleInput(ctx, ctx.callbackQuery.data as dayKey | 'days_done')

      if (shouldProceed) {
        await timeSelectionStep.execute(ctx)
        return ctx.wizard.next()
      }
    }
  },
  // Шаг 4 Выбор предпочтительного возраста оппонента
  async (ctx) => {
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const shouldProceed = await timeSelectionStep.handleInput(ctx, ctx.callbackQuery.data as timeKey | 'times_done')

      if (shouldProceed) {
        await ageSelectionStep.execute(ctx)
        return ctx.wizard.next()
      }
    }
  },
  // Шаг 4 Выбор предпочтительного пола оппонента
  async (ctx) => {
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const shouldProceed = await ageSelectionStep.handleInput(
        ctx,
        ctx.callbackQuery.data as ageCategoryKey | 'preferred_age_done'
      )

      if (shouldProceed) {
        await genderSelectionStep.execute(ctx)
        return ctx.wizard.next()
      }
    }
  },
  // Шаг 6: Финализация профиля
  async (ctx) => {
    if (ctx.callbackQuery && 'data' in ctx.callbackQuery) {
      const shouldProceed = await genderSelectionStep.handleInput(
        ctx,
        ctx.callbackQuery.data as genderKey | 'preferred_gender_done'
      )

      if (shouldProceed) {
        await ctx.reply(
          '✅ Профиль настроен!\n\n' +
          `Уровень: ${ctx.wizard.state.level}\n` +
          `Дни: ${ctx.wizard.state.selectedDays?.join(', ')}\n` +
          `Время: ${Object.entries(ctx.wizard.state.dayTimes || {}).map(([ day, times ]) => `${day}: ${times.join(', ')}`).join('\n')}\n` +
          `Возраст: ${ctx.wizard.state.preferAges?.join(', ')}\n` +
          `Пол: ${ctx.wizard.state.preferGenders?.join(', ')}\n`
        )
        return ctx.scene.leave()
      }
    }

  }
)
