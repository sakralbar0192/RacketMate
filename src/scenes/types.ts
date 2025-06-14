import type { WizardContext } from 'telegraf/scenes'

// Тип для описания шага
export type StepDefinition<N extends string, A extends string,C extends WizardContext> = {
  name: N;
  step: {
    execute(ctx: C): Promise<void>;
    handleInput(ctx: C, action: A): Promise<boolean | void>;
  };
};

// Тип для конфигурации фабрики
export type StepFactoryConfig<N extends string, A extends string, C extends WizardContext> = {
  steps: StepDefinition<N, A, C>[];
  defaultStep: N;
  finalizeFunction: (ctx: C) => Promise<void>
};

export interface EntityInfo {
  name: string,
  shortName: string
}