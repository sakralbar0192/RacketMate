import type { Scenes } from 'telegraf'

// Типы для Уровня игры (play-level)
export type PlayLevel = 'beginner' | 'amateur' | 'pro'
export type PlayLevelStepName = 'play-level'
export type PlayLevelAction = `${PlayLevelStepName}_${PlayLevel}`

// Типы для Дня Недели (week-day)
export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type WeekDayStepName = 'week-day'
export type WeekDayAction = `${WeekDayStepName}_${WeekDay}` | `${WeekDayStepName}_done`

// Типы для Времени Дня (day-time)
export type DayTime = 'nine-am' | 'ten-am' | 'eleven-am' | 'twelve-am' | 'thirteen-pm' | 'fourteen-pm' | 'fifteen-pm' | 'sixteen-pm' | 'seventeen-pm' | 'eighteen-pm' | 'nineteen-pm' | 'twenty-pm'
export type DayTimeStepName = 'day-time'
export type DayTimeAction = `${DayTimeStepName}_${DayTime}` | `${DayTimeStepName}_done`

// Типы для Предпочтительного Возраста оппонента (preferred-age)
export type PreferredAge = 'before-twenty' | 'after-twenty-before-thirty' | 'after-thirty' | 'all'
export type PreferredAgeStepName = 'preferred-age'
export type PreferredAgeAction = `${PreferredAgeStepName}_${PreferredAge}` | `${PreferredAgeStepName}_done`

// Типы для Предпочтительного Пола оппонента (preferred-gender)
export type PreferredGender = 'men' | 'women' | 'all'
export type PreferredGenderStepName = 'preferred-gender'
export type PreferredGenderAction = `${PreferredGenderStepName}_${PreferredGender}` | `${PreferredGenderStepName}_done`

// 1. Типизируем состояние сцены
interface WizardState {
  level?: PlayLevel;
  selectedDays?: WeekDay[];
  dayTimes?: Record<WeekDay, DayTime[]> | object;
  preferAges?: PreferredAge[];
  preferGenders?: PreferredGender[]
}

// 2. Объявляем кастомный контекст
export interface ProfileSetupWizardContext extends Scenes.WizardContext {
  wizard: Scenes.WizardContextWizard<ProfileSetupWizardContext> & {
    state: WizardState; // Жёстко типизируем state
  };
}

export type ProfileSetupActions = PlayLevelAction | WeekDayAction | DayTimeAction | PreferredAgeAction | PreferredGenderAction

export type StepKey = PlayLevelStepName | WeekDayStepName | DayTimeStepName | PreferredAgeStepName | PreferredGenderStepName
