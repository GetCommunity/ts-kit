import { getDeepErrors } from "@formisch/solid"
import { For, Show, mergeProps } from "solid-js"

import type { FormSchema, FormStore } from "@formisch/solid"

import { cn } from "@/lib/utils"
import { Alert, AlertDescription, AlertTitle } from "@/registry/new-york/ui/alert"

interface FormErrorsProps<TSchema extends FormSchema> {
  formStore: FormStore<TSchema>
  title?: string
  description?: string
  class?: string
  showAllErrors?: boolean
}

export default function FormErrors<TSchema extends FormSchema>(
  inputProps: FormErrorsProps<TSchema>
) {
  const props = mergeProps(
    {
      title: "Oops, there was an error submitting your response.",
      description: "Please fix the errors outlined and try again."
    },
    inputProps
  )
  const allErrors = () => getDeepErrors(props.formStore) ?? []
  return (
    <>
      <Show when={props.showAllErrors && allErrors().length > 0}>
        <pre>{JSON.stringify(allErrors(), null, 2)}</pre>
      </Show>
      <Show when={props.formStore.errors && props.formStore.errors.length > 0}>
        <Alert variant="destructive" class={cn("w-full mb-2", inputProps.class)}>
          <AlertTitle>{props.title}</AlertTitle>
          <AlertDescription>{props.description}</AlertDescription>
          <Show when={props.formStore.errors && props.formStore.errors.length > 0}>
            <ul class="mt-4 list-inside list-disc text-sm">
              <For each={props.formStore.errors}>
                {(error) => <li class="list-item">{error}</li>}
              </For>
            </ul>
          </Show>
        </Alert>
      </Show>
    </>
  )
}
