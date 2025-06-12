import { WizardContext, WizardSessionData } from "telegraf/scenes";

export abstract class BaseStep {
  abstract execute(ctx: WizardContext<WizardSessionData>): Promise<void>;
  abstract handleInput(
    ctx: WizardContext<WizardSessionData>,
    action: string
  ): Promise<boolean>; // true = переход дальше
}