import { Markup } from 'telegraf'

export type dayKey = 'day_mon' | 'day_tue' | 'day_wed' | 'day_thu' | 'day_fri' | 'day_sat' | 'day_sun'

export interface dayInfo {
  name: string,
  shortName: string
}

export default class WeekDayService {
  static daysOfWeek: Record<dayKey, dayInfo> = {
    'day_mon': {
      name: 'Понедельник',
      shortName: 'Пн'
    },
    'day_tue': {
      name: 'Вторник',
      shortName: 'Вт'
    },
    'day_wed': {
      name: 'Среда',
      shortName: 'Ср'
    },
    'day_thu': {
      name: 'Четверг',
      shortName: 'Чт'
    },
    'day_fri': {
      name: 'Пятница',
      shortName: 'Пт'
    },
    'day_sat': {
      name: 'Суббота',
      shortName: 'Сб'
    },
    'day_sun': {
      name: 'Воскресенье',
      shortName: 'Вс'
    }
  }

  static getDaysKeyboard(selectedDays: dayKey[] = []) {
    const keyboardStructure: dayKey[][] = [
      // Первая строка: Пн-Вт
      [ 'day_mon', 'day_tue' ],
      // Вторая строка: Ср-Чт
      [ 'day_wed', 'day_thu' ],
      // Третья строка: Пт-Сб
      [ 'day_fri', 'day_sat' ],
      // Четвертая строка: Вс
      [ 'day_sun' ]
    ]

    function createDayButton(dayKey: dayKey): [string, dayKey] {
      const label = `${selectedDays.includes(dayKey) ? '✅' : ''} ${WeekDayService.daysOfWeek[dayKey].shortName}`
      return [ label, dayKey ]
    }

    const daysKeyboard = keyboardStructure.map(row =>
      row.map(dayKey => Markup.button.callback(...createDayButton(dayKey)))
    )

    // Добавляем кнопку "Готово"
    daysKeyboard.push([ Markup.button.callback('Готово', 'days_done') ])
    return daysKeyboard
  }
}