import { fireEvent, render, screen } from "@solidjs/testing-library"
import { createSignal } from "solid-js"

type UnknownRecord = Record<string, unknown>

vi.mock("@/registry/base/ui/select", async () => {
  const { For, createComponent, createContext, useContext } = await import("solid-js")

  type SelectContextValue = {
    change: (value: Array<UnknownRecord> | UnknownRecord | null) => void
    value: () => Array<UnknownRecord> | UnknownRecord | undefined
  }

  const SelectContext = createContext<SelectContextValue>()

  return {
    Select: (props: UnknownRecord) =>
      createComponent(SelectContext.Provider, {
        value: {
          change: (value) =>
            (
              props.onChange as (
                value: Array<UnknownRecord> | UnknownRecord | null
              ) => void
            )(value),
          value: () => props.value as Array<UnknownRecord> | UnknownRecord | undefined
        },
        get children() {
          const options = () => props.options as Array<UnknownRecord>
          const itemComponent = () =>
            props.itemComponent as (props: {
              item: { rawValue: UnknownRecord }
            }) => JSX.Element
          return (
            <>
              <div
                data-testid="select-boundary"
                data-name={props.name as string}
                data-default-value={JSON.stringify(props.defaultValue)}
                data-validation-state={props.validationState as string}
                data-required={String(props.required)}
                data-disabled={String(props.disabled)}
                data-readonly={String(props.readOnly)}
                data-placeholder={props.placeholder as string}
                data-close-on-selection={String(props.closeOnSelection)}
              />
              <For each={options()}>
                {(option) => (
                  <div
                    data-disabled={String(
                      (props.optionDisabled as (value: UnknownRecord) => boolean)?.(
                        option
                      )
                    )}
                  >
                    {itemComponent()({ item: { rawValue: option } })}
                  </div>
                )}
              </For>
              {props.children as JSX.Element}
            </>
          )
        }
      }),
    SelectContent: (props: UnknownRecord) => (
      <div class={props.class as string}>content</div>
    ),
    SelectDescription: (props: { children: JSX.Element }) => (
      <div>{props.children}</div>
    ),
    SelectHiddenSelect: (props: UnknownRecord) => (
      <select aria-label="hidden select" name={props.name as string} />
    ),
    SelectItem: (props: { children: JSX.Element }) => <div>{props.children}</div>,
    SelectLabel: (props: { children: JSX.Element }) => <label>{props.children}</label>,
    SelectTrigger: (props: UnknownRecord) => (
      <div
        class={props.class as string}
        aria-label={props["aria-label"] as string}
        autofocus={props.autofocus as boolean}
      >
        {props.children as JSX.Element}
      </div>
    ),
    SelectValue: (props: {
      children: (state: {
        clear: () => void
        remove: (option: UnknownRecord) => void
        selectedOption: () => UnknownRecord | undefined
        selectedOptions: () => Array<UnknownRecord>
      }) => JSX.Element
    }) => {
      const context = useContext(SelectContext)
      if (!context) {
        throw new Error("SelectValue must be rendered inside Select")
      }
      const selectedOptions = () => {
        const value = context.value()
        return Array.isArray(value) ? value : value ? [value] : []
      }
      return (
        <div data-testid="select-value">
          {props.children({
            clear: () => context.change([]),
            remove: (option) =>
              context.change(
                selectedOptions().filter((selected) => selected !== option)
              ),
            selectedOption: () => selectedOptions()[0],
            selectedOptions
          })}
        </div>
      )
    }
  }
})

import SelectInput from "@/registry/base/form-inputs/select-input.ui"
import SelectMultipleInput from "@/registry/base/form-inputs/select-multi-input.ui"
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

describe("select input reactive boundaries", () => {
  it("reactively displays a newly selected single value", () => {
    const [value, setValue] = createSignal<Option>()

    render(() => (
      <>
        <SelectInput
          name="single-contract"
          value={value()}
          defaultValue={options[0]}
          onChange={setValue}
          options={options}
          optionValue="value"
          optionTextValue="label"
          optionDescriptionValue="description"
          optionDisabled={() => false}
          placeholder="Single"
          readOnly
          disabled
          closeOnSelection
        />
        <button type="button" onClick={() => setValue(options[1])}>
          choose beta
        </button>
      </>
    ))

    expect(screen.getByTestId("select-value")).toBeEmptyDOMElement()
    fireEvent.click(screen.getByText("choose beta"))
    expect(screen.getByTestId("select-value")).toHaveTextContent("Beta")
    expect(screen.getByText("A, B")).toBeInTheDocument()
    expect(screen.getByText("Words")).toBeInTheDocument()
    expect(screen.getByText("3")).toBeInTheDocument()
  })

  it("reactively removes and clears multi-select values", () => {
    const [value, setValue] = createSignal<Array<Option> | null | undefined>([
      options[0]!,
      options[1]!
    ])

    render(() => (
      <>
        <SelectMultipleInput
          name="multi-contract"
          value={value()}
          defaultValue={[options[2]!]}
          onChange={setValue}
          options={options}
          optionValue="value"
          optionTextValue="label"
          optionDescriptionValue="description"
          optionDisabled={() => false}
          placeholder="Multiple"
          readOnly
          disabled
          closeOnSelection
        />
        <output aria-label="selected values">
          {value()
            ?.map((option) => option.label)
            .join(",") ?? ""}
        </output>
        <button type="button" onClick={() => setValue(undefined)}>
          unset selection
        </button>
      </>
    ))

    const selectedValue = screen.getByTestId("select-value")
    expect(selectedValue).toHaveTextContent("Alpha")
    expect(selectedValue).toHaveTextContent("Beta")

    fireEvent.click(screen.getAllByRole("button")[0]!)
    expect(screen.getByLabelText("selected values")).toHaveTextContent("Beta")
    expect(selectedValue).not.toHaveTextContent("Alpha")

    fireEvent.click(screen.getAllByRole("button")[1]!)
    expect(screen.getByLabelText("selected values").textContent).toBe("")
    expect(selectedValue).not.toHaveTextContent("Alpha")
    expect(selectedValue).not.toHaveTextContent("Beta")

    fireEvent.click(screen.getByText("unset selection"))
    expect(screen.getByLabelText("selected values").textContent).toBe("")
  })
})
