import { fireEvent, render, screen } from "@solidjs/testing-library"
import { createSignal } from "solid-js"

type UnknownRecord = Record<string, unknown>

vi.mock("@/registry/new-york/ui/combobox", async () => {
  const { For, createComponent, createContext, useContext } = await import("solid-js")

  type ComboContextValue = {
    change: (value: Array<UnknownRecord> | UnknownRecord | null) => void
    textKey: () => string
    value: () => Array<UnknownRecord> | UnknownRecord | undefined
  }

  const ComboContext = createContext<ComboContextValue>()
  const useCombo = () => {
    const context = useContext(ComboContext)
    if (!context) {
      throw new Error("Combobox part must be rendered inside Combobox")
    }
    return context
  }
  const getSelectedOptions = (context: ComboContextValue) => {
    const value = context.value()
    return Array.isArray(value) ? value : value ? [value] : []
  }

  return {
    Combobox: (props: UnknownRecord) =>
      createComponent(ComboContext.Provider, {
        value: {
          change: (value) =>
            (
              props.onChange as (
                value: Array<UnknownRecord> | UnknownRecord | null
              ) => void
            )(value),
          textKey: () => props.optionTextValue as string,
          value: () => props.value as Array<UnknownRecord> | UnknownRecord | undefined
        },
        get children() {
          const options = () => props.options as Array<UnknownRecord>
          const itemComponent = () =>
            props.itemComponent as (props: {
              item: { rawValue: UnknownRecord }
            }) => JSX.Element
          const sectionComponent = () =>
            props.sectionComponent as (props: {
              section: { rawValue: UnknownRecord }
            }) => JSX.Element
          return (
            <>
              <div
                data-testid="combobox-boundary"
                data-name={props.name as string}
                data-default-filter={props.defaultFilter as string}
                data-default-value={JSON.stringify(props.defaultValue)}
                data-option-label={props.optionLabel as string}
                data-validation-state={props.validationState as string}
                data-required={String(props.required)}
                data-disabled={String(props.disabled)}
                data-readonly={String(props.readOnly)}
                data-placeholder={props.placeholder as string}
                data-open={String(props.open)}
                data-default-open={String(props.defaultOpen)}
                data-remove-on-backspace={String(props.removeOnBackspace)}
                data-duplicate-events={String(props.allowDuplicateSelectionEvents)}
                data-disallow-empty={String(props.disallowEmptySelection)}
                data-close-on-selection={String(props.closeOnSelection)}
                data-selection-behavior={props.selectionBehavior as string}
                data-virtualized={String(props.virtualized)}
                data-modal={String(props.modal)}
                data-prevent-scroll={String(props.preventScroll)}
              />
              <For each={options()}>
                {(option) => (
                  <div
                    data-disabled={String(
                      (props.optionDisabled as (value: UnknownRecord) => boolean)(
                        option
                      )
                    )}
                  >
                    {itemComponent()({ item: { rawValue: option } })}
                  </div>
                )}
              </For>
              {sectionComponent()({ section: { rawValue: options()[0]! } })}
              {props.children as JSX.Element}
            </>
          )
        }
      }),
    ComboboxContent: (props: UnknownRecord) => (
      <div class={props.class as string}>content</div>
    ),
    ComboboxControl: (props: {
      children?:
        | JSX.Element
        | ((state: {
            clear: () => void
            remove: (option: UnknownRecord) => void
            selectedOptions: () => Array<UnknownRecord>
          }) => JSX.Element)
      class?: string
    }) => {
      const context = useCombo()
      const selectedOptions = () => getSelectedOptions(context)
      return (
        <div class={props.class}>
          {typeof props.children === "function"
            ? props.children({
                clear: () => context.change([]),
                remove: (option) =>
                  context.change(
                    selectedOptions().filter((selected) => selected !== option)
                  ),
                selectedOptions
              })
            : props.children}
        </div>
      )
    },
    ComboboxInput: (props: UnknownRecord) => {
      const context = useCombo()
      const selected = () => getSelectedOptions(context)[0]
      return (
        <input
          id={props.id as string}
          class={props.class as string}
          aria-label="combo input"
          value={(selected()?.[context.textKey()] as string | number | undefined) ?? ""}
        />
      )
    },
    ComboboxItem: (props: { children: JSX.Element }) => <div>{props.children}</div>,
    ComboboxItemIndicator: () => <span>selected</span>,
    ComboboxItemLabel: (props: { children: JSX.Element }) => (
      <div>{props.children}</div>
    ),
    ComboboxSection: (props: { children: JSX.Element }) => <div>{props.children}</div>,
    ComboboxTrigger: (props: UnknownRecord) => (
      <button type="button" class={props.class as string}>
        trigger
      </button>
    )
  }
})

import ComboboxInput from "@/registry/new-york/form-inputs/combobox-input"
import ComboboxMultiInput from "@/registry/new-york/form-inputs/combobox-multi-input"
import type { JSX } from "solid-js"

type Option = {
  description?: Array<string> | string | number
  label: string
  value: string
}

const options: Array<Option> = [
  { description: ["A", "B"], label: "Alpha", value: "alpha" },
  { description: "Words", label: "Beta", value: "beta" },
  { description: 3, label: "Gamma", value: "gamma" },
  { label: "Delta", value: "delta" }
]

const sharedProps = {
  name: "combo-contract",
  options,
  optionValue: "value" as const,
  optionTextValue: "label" as const,
  optionLabel: "label" as const,
  optionDescriptionValue: "description" as const,
  optionDisabled: () => false,
  placeholder: "Search",
  defaultFilter: "contains" as const,
  defaultOpen: true,
  removeOnBackspace: true,
  allowDuplicateSelectionEvents: true,
  disallowEmptySelection: true,
  closeOnSelection: false,
  selectionBehavior: "replace" as const,
  virtualized: false,
  modal: false,
  preventScroll: false,
  readOnly: true,
  disabled: true
}

describe("combobox input reactive boundaries", () => {
  it("reactively displays a newly selected single value", () => {
    const [value, setValue] = createSignal<Option>()

    render(() => (
      <>
        <ComboboxInput
          {...sharedProps}
          value={value()}
          defaultValue={options[0]}
          onChange={setValue}
          open={false}
          label="Contract combobox"
        />
        <button type="button" onClick={() => setValue(options[1])}>
          choose beta
        </button>
      </>
    ))

    expect(screen.getByLabelText("combo input")).toHaveValue("")
    fireEvent.click(screen.getByText("choose beta"))
    expect(screen.getByLabelText("combo input")).toHaveValue("Beta")
    expect(screen.getAllByText("Alpha").length).toBeGreaterThan(1)
    expect(screen.getByText("A, B")).toBeInTheDocument()
    expect(screen.getByText("Words")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("reactively removes and clears multi-combobox values", () => {
    const [value, setValue] = createSignal<Array<Option>>([options[0]!, options[1]!])

    render(() => (
      <>
        <ComboboxMultiInput
          {...sharedProps}
          value={value()}
          defaultValue={[options[2]!]}
          onChange={setValue}
          open={false}
          label="Contract multi combobox"
        />
        <output aria-label="combobox values">
          {value()
            .map((option) => option.label)
            .join(",")}
        </output>
      </>
    ))

    expect(screen.getByLabelText("combobox values")).toHaveTextContent("Alpha,Beta")
    const tagButtons = screen.getAllByRole("button")

    fireEvent.click(tagButtons[0]!)
    expect(screen.getByLabelText("combobox values")).toHaveTextContent("Beta")

    fireEvent.click(screen.getAllByRole("button")[1]!)
    expect(screen.getByLabelText("combobox values").textContent).toBe("")
  })
})
