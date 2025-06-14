export type playLevel = 'beginner' | 'amateur' | 'pro'

export default class PlayLevelService {

  static playLevels: Record<playLevel, string> = {
    beginner: 'новичок',
    amateur: 'любитель',
    pro: 'профессионал',
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

  static getReadableLevelInfo(level: playLevel) {
    return PlayLevelService.playLevels[level]
  }
}