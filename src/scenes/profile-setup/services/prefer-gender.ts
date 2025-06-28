import { Markup } from 'telegraf'
import type { PreferredGender, PreferredGenderAction, PreferredGenderStepName } from '../types.ts'
import type { EntityInfo } from '../../types.ts'
import turnDataIntoAction from '../../../utils/turn-data-into-action.ts'

export default class PreferredGenderService {
  static PreferredGenderStepName: PreferredGenderStepName = 'preferred-gender'

  static preferredGenders: Record<Exclude<PreferredGender, 'all'>, EntityInfo> = {
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
    return Object.keys(PreferredGenderService.preferredGenders) as PreferredGender[]
  }

  static getGendersKeyboard(selectedGenders: PreferredGender[] = []) {
    const keyboardStructure: Exclude<PreferredGender, 'all'>[][] = [
      [ 'women', 'men' ],
    ]

    function createTimeButton(preferredGender: Exclude<PreferredGender, 'all'>): [string, PreferredGenderAction] {
      const label = `${selectedGenders.includes(preferredGender) ? '✅' : ''} ${PreferredGenderService.preferredGenders[preferredGender].shortName}`
      return [ label, turnDataIntoAction(preferredGender, PreferredGenderService.PreferredGenderStepName) as PreferredGenderAction ]
    }

    const gendersKeyboard = keyboardStructure.map(row =>
      row.map(gender => Markup.button.callback(...createTimeButton(gender)))
    )

    gendersKeyboard.push([
      Markup.button.callback(!selectedGenders?.length || PreferredGenderService.preferredGenderKeys.every(key => selectedGenders?.includes(key)) ? '✅ Любой' : 'Готово', 'preferred-gender_done')
    ])
    return gendersKeyboard
  }

  static isPreferredAgeValid(preferredGender: string) {
    return PreferredGenderService.preferredGenderKeys.includes(preferredGender as PreferredGender)
  }

  static getReadablePreferredGenderInfo(preferredGenders: PreferredGender[]) {
    if (preferredGenders.includes('all')) return 'любой'
    else return preferredGenders
      .filter(gender => gender !== 'all')
      .map(gender => PreferredGenderService.preferredGenders[gender].name)
      .join('и ')
  }
}