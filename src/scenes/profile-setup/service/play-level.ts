export type playLevel = 'beginner' | 'amateur' | 'pro'

export default class PlayLevelService {

  static playLevels: Record<playLevel, string> = {
    beginner: 'Новичок',
    amateur: 'Любитель',
    pro: 'Профессионал',
  }

  static get defaultLevel() {
    return PlayLevelService.playLevelKeys[0]
  }

  static get playLevelKeys() {
    return Object.keys(PlayLevelService.playLevels) as playLevel[]
  }

  static get playLevelEntries() {
    return Object.entries(PlayLevelService.playLevels) as [playLevel, string][]
  }

  static isLevelValid(level: string) {
    return PlayLevelService.playLevelKeys.includes(level as playLevel)
  }
}