import { type WizardContext, type WizardSessionData } from 'telegraf/scenes'
import getDataFromAction from '../utils/get-data-from-action.ts'

type replyMethod = 'editMessageText' | 'reply'

export abstract class BaseStep {
  abstract execute(ctx: WizardContext<WizardSessionData>): Promise<void>;
  abstract handleInput(
    ctx: WizardContext<WizardSessionData>,
    action: string
  ): Promise<boolean | void>; // true = переход дальше
  isRedraw = false
  get replyMethod(): replyMethod {
    return this.isRedraw ? 'editMessageText' : 'reply'
  }
  getDataFromAction = getDataFromAction
}
