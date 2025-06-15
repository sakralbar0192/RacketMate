import type { Scenes } from 'telegraf'

// Типы для Уровня игры (play-level)
export type PlayLevel = 'beginner' | 'amateur' | 'pro'
export type PlayLevelStepName = 'play-level'
export type PlayLevelAction = `${PlayLevelStepName}_${PlayLevel}`

// Типы для Возраста Игрока(player-age)
export type PlayerAge = 'before-twenty' | 'after-twenty-before-thirty' | 'after-thirty'
export type PlayerAgeStepName = 'player-age'
export type PlayerAgeAction = `${PlayerAgeStepName}_${PlayerAge}`

// Типы для Пола Игрока(player-gender)
export type PlayerGender = 'men' | 'women'
export type PlayerGenderStepName = 'player-gender'
export type PlayerGenderAction = `${PlayerGenderStepName}_${PlayerGender}`

// Типы для Дня Недели (week-day)
export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export type WeekDayStepName = 'week-day'
export type WeekDayAction = `${WeekDayStepName}_${WeekDay}` | `${WeekDayStepName}_done`

// Типы для Времени Дня (day-time)
export type DayTime = 'nine-am' | 'ten-am' | 'eleven-am' | 'twelve-am' | 'thirteen-pm' | 'fourteen-pm' | 'fifteen-pm' | 'sixteen-pm' | 'seventeen-pm' | 'eighteen-pm' | 'nineteen-pm' | 'twenty-pm'
export type DayTimeStepName = 'day-time'
export type DayTimeAction = `${DayTimeStepName}_${DayTime}` | `${DayTimeStepName}_done`

// Типы для Предпочтительного Возраста оппонента (preferred-age)
export type PreferredAge = PlayerAge | 'all'
export type PreferredAgeStepName = 'preferred-age'
export type PreferredAgeAction = `${PreferredAgeStepName}_${PreferredAge}` | `${PreferredAgeStepName}_done`

// Типы для Предпочтительного Пола оппонента (preferred-gender)
export type PreferredGender = PlayerGender | 'all'
export type PreferredGenderStepName = 'preferred-gender'
export type PreferredGenderAction = `${PreferredGenderStepName}_${PreferredGender}` | `${PreferredGenderStepName}_done`

// 1. Типизируем состояние сцены
interface WizardState {
  level?: PlayLevel;
  age?: PlayerAge;
  gender?: PlayerGender
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

export type ProfileSetupActions = PlayLevelAction | PlayerAgeAction | PlayerGenderAction | WeekDayAction | DayTimeAction | PreferredAgeAction | PreferredGenderAction

export type StepKey = PlayLevelStepName | PlayerAgeStepName | PlayerGenderStepName | WeekDayStepName | DayTimeStepName | PreferredAgeStepName | PreferredGenderStepName
