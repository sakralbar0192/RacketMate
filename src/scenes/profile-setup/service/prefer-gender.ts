import { Markup } from 'telegraf'

export type genderKey = 'men' | 'women'

export interface genderInfo {
  name: string,
  shortName: string
}

export default class PreferredGenderService {
  static preferredGenders: Record<genderKey, genderInfo> = {
    women: {
      name: 'женщины',
      shortName: '♀️',
    },
    men: {
      name: 'мужчины',
      shortName: '♂️',
    },
  }

  static get preferredGenderKeys() {
    return Object.keys(PreferredGenderService.preferredGenders) as genderKey[]
  }

  static getGendersKeyboard(selectedGenders: genderKey[] = []) {
    const keyboardStructure: genderKey[][] = [
      [ 'women', 'men' ],
    ]

    function createTimeButton(genderKey: genderKey): [string, genderKey] {
      const label = `${selectedGenders.includes(genderKey) ? '✅' : ''} ${PreferredGenderService.preferredGenders[genderKey].shortName}`
      return [ label, genderKey ]
    }

    const agesKeyboard = keyboardStructure.map(row =>
      row.map(timeKey => Markup.button.callback(...createTimeButton(timeKey)))
    )

    agesKeyboard.push([
      Markup.button.callback(!selectedGenders?.length || PreferredGenderService.preferredGenderKeys.every(key => selectedGenders?.includes(key)) ? '✅ Любой' : 'Готово', 'preferred_gender_done')
    ])
    return agesKeyboard
  }

  static isPreferredAgeValid(preferredGender: string) {
    return PreferredGenderService.preferredGenderKeys.includes(preferredGender as genderKey)
  }

  static getReadablePreferredGenderInfo(preferredGenders: (genderKey | 'all')[]) {
    if (preferredGenders.includes('all')) return 'любой'
    else return preferredGenders.filter(gender => gender !== 'all').map(gender => PreferredGenderService.preferredGenders[gender].name).join('и ')
  }
}