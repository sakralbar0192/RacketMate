import type { WizardContext } from 'telegraf/scenes'
import type { StepDefinition, StepFactoryConfig } from './types.ts'

export class StepFactory<
  StepType extends string,
  ActionType extends string,
  ContextType extends WizardContext
> {
  private steps: Map<string, StepDefinition<StepType, ActionType, ContextType>>
  private currentStep: StepType | null
  defaultStep: StepType
  finalizeFunction: (ctx: ContextType) => Promise<void>

  constructor(config: StepFactoryConfig<StepType, ActionType, ContextType>) {
    this.steps = new Map()

    this.defaultStep = config.defaultStep
    this.finalizeFunction = config.finalizeFunction
    this.currentStep = null

    config.steps.forEach(step => {
      this.steps.set(step.name, step)
    })
  }

  async execute(
    ctx: ContextType,
    stepName: StepType
  ): Promise<void> {
    const step = this.steps.get(stepName)
    if (!step) throw new Error(`Step ${stepName} not found`)
    if (step.name !== this.currentStep) {
      this.currentStep = step.name
      await step.step.execute(ctx)
    }
  }

  async handle(
    ctx: ContextType,
    action: ActionType
  ): Promise<StepType | null> {
    // Находим шаг по префиксу действия
    const stepName = this.getStepNameByAction(action)
    if (!stepName) return null

    const step = this.steps.get(stepName)
    if (!step) return null

    const shouldProceed = await step.step.handleInput(ctx, action)
    if (shouldProceed) {
      const nextStep = this.getNextStep(stepName)
      return nextStep ? nextStep : null
    } else return stepName as StepType
  }

  private getStepNameByAction(action: string): string | undefined {
    for (const [ key, value ] of this.steps) {
      if (action.startsWith(key)) {
        return value.name
      }
    }
    return undefined
  }

  private getNextStep(currentStep: string): StepType | null {
    const steps = Array.from(this.steps.keys())
    const currentIndex = steps.indexOf(currentStep)
    return steps[currentIndex + 1] as StepType || null
  }
}