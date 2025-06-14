import { Markup } from 'telegraf'

export type timeKey = 'time_nine_am' | 'time_ten_am' | 'time_eleven_am' | 'time_twelve_am' | 'time_thirteen_pm' | 'time_fourteen_pm' | 'time_fifteen_pm' | 'time_sixteen_pm' | 'time_seventeen_pm' | 'time_eighteen_pm' | 'time_nineteen_pm' | 'time_twenty_pm'

export default class DayTimeService {
  static timeOfDay: Record<timeKey, string> = {
    'time_nine_am': '09:00',
    'time_ten_am': '10:00',
    'time_eleven_am': '11:00',
    'time_twelve_am': '12:00',
    'time_thirteen_pm': '13:00',
    'time_fourteen_pm': '14:00',
    'time_fifteen_pm': '15:00',
    'time_sixteen_pm': '16:00',
    'time_seventeen_pm': '17:00',
    'time_eighteen_pm': '18:00',
    'time_nineteen_pm': '19:00',
    'time_twenty_pm': '20:00',
  }

  static getDaysKeyboard(selectedTimes: timeKey[] = []) {
    const keyboardStructure: timeKey[][] = [
      [ 'time_nine_am', 'time_ten_am', 'time_eleven_am' ],
      [ 'time_twelve_am', 'time_thirteen_pm', 'time_fourteen_pm' ],
      [ 'time_fifteen_pm', 'time_sixteen_pm', 'time_seventeen_pm' ],
      [ 'time_eighteen_pm', 'time_nineteen_pm', 'time_twenty_pm' ],
    ]

    function createTimeButton(timeKey: timeKey): [string, timeKey] {
      const label = `${selectedTimes.includes(timeKey) ? '✅' : ''} ${DayTimeService.timeOfDay[timeKey]}`
      return [ label, timeKey ]
    }

    const daysKeyboard = keyboardStructure.map(row =>
      row.map(timeKey => Markup.button.callback(...createTimeButton(timeKey)))
    )

    // Добавляем кнопку "Готово"
    daysKeyboard.push([ Markup.button.callback('Готово', 'times_done') ])
    return daysKeyboard
  }
}