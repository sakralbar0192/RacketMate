import { Markup } from 'telegraf'

export type ageCategoryKey = 'before_twenty' | 'after_twenty_before_thirty' | 'after_thirty'

export interface ageCategoryInfo {
  name: string,
  shortName: string
}

export default class PreferredAgeService {
  static preferredAges: Record<ageCategoryKey, ageCategoryInfo> = {
    before_twenty: {
      name: 'До двадцати',
      shortName: '< 20',
    },
    after_twenty_before_thirty: {
      name: 'От двадцати до тридцати',
      shortName: '20 – 30',
    },
    after_thirty: {
      name: 'После тридцати',
      shortName: '30 <',
    },
  }

  static get preferredAgeKeys() {
    return Object.keys(PreferredAgeService.preferredAges) as ageCategoryKey[]
  }

  static getAgesKeyboard(selectedAges: ageCategoryKey[] = []) {
    const keyboardStructure: ageCategoryKey[][] = [
      [ 'before_twenty', 'after_twenty_before_thirty', 'after_thirty' ],
    ]

    function createTimeButton(ageCategoryKey: ageCategoryKey): [string, ageCategoryKey] {
      const label = `${selectedAges.includes(ageCategoryKey) ? '✅' : ''} ${PreferredAgeService.preferredAges[ageCategoryKey].shortName}`
      return [ label, ageCategoryKey ]
    }

    const agesKeyboard = keyboardStructure.map(row =>
      row.map(timeKey => Markup.button.callback(...createTimeButton(timeKey)))
    )

    agesKeyboard.push([
      Markup.button.callback(!selectedAges?.length || PreferredAgeService.preferredAgeKeys.every(key => selectedAges?.includes(key)) ? '✅ Любой' : 'Готово', 'preferred_age_done')
    ])
    return agesKeyboard
  }

  static isPreferredAgeValid(preferredAge: string) {
    return PreferredAgeService.preferredAgeKeys.includes(preferredAge as ageCategoryKey)
  }
}