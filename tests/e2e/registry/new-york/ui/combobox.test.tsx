import { render, screen } from "@solidjs/testing-library"

import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxHiddenSelect,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIndicator,
  ComboboxItemLabel,
  ComboboxLabel,
  ComboboxSection,
  ComboboxTrigger
} from "@/registry/new-york/ui/combobox"

type Option = { label: string; value: string }

const options: Array<Option> = [
  { label: "Alpha", value: "alpha" },
  { label: "Beta", value: "beta" }
]

describe("Combobox", () => {
  it("renders label, input, trigger, and options", () => {
    render(() => (
      <Combobox<Option>
        options={options}
        optionValue="value"
        optionTextValue="label"
        optionLabel="label"
        placeholder="Choose option"
        value={options[0]}
        open
        itemComponent={(props) => (
          <ComboboxItem item={props.item}>
            <ComboboxItemLabel>{props.item.rawValue.label}</ComboboxItemLabel>
            <ComboboxItemIndicator />
          </ComboboxItem>
        )}
      >
        <ComboboxLabel>Options</ComboboxLabel>
        <ComboboxControl>
          <ComboboxInput />
          <ComboboxTrigger>
            <span data-testid="trigger-icon">Toggle</span>
          </ComboboxTrigger>
        </ComboboxControl>
        <ComboboxHiddenSelect />
        <ComboboxContent />
        <ComboboxSection class="custom-section">Featured</ComboboxSection>
      </Combobox>
    ))

    expect(screen.getByText("Options")).toHaveClass("text-sm")
    expect(screen.getByRole("combobox")).toBeInTheDocument()
    expect(screen.getByRole("option", { name: "Alpha" })).toBeInTheDocument()
    expect(screen.getByTestId("trigger-icon")).toHaveTextContent("Toggle")
    expect(screen.getByText("Featured")).toHaveClass("custom-section")
    expect(document.querySelector("select")).toBeInTheDocument()
  })

  it("renders default trigger and selected-item indicator icons", () => {
    const { container } = render(() => (
      <Combobox<Option>
        options={options}
        optionValue="value"
        optionTextValue="label"
        optionLabel="label"
        value={options[0]}
        open
        itemComponent={(props) => (
          <ComboboxItem item={props.item}>
            <ComboboxItemLabel>{props.item.rawValue.label}</ComboboxItemLabel>
            <ComboboxItemIndicator>
              <span data-testid="selected-icon">Selected</span>
            </ComboboxItemIndicator>
          </ComboboxItem>
        )}
      >
        <ComboboxControl>
          <ComboboxInput />
          <ComboboxTrigger />
        </ComboboxControl>
        <ComboboxContent />
      </Combobox>
    ))

    expect(container.querySelectorAll("svg").length).toBeGreaterThan(0)
    expect(screen.getByTestId("selected-icon")).toHaveTextContent("Selected")
  })
})
