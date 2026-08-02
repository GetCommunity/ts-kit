import { render, screen } from "@solidjs/testing-library"

import {
  Select,
  SelectContent,
  SelectDescription,
  SelectErrorMessage,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue
} from "@/registry/kobalte/ui/select"

type Option = { label: string; value: string }

const options: Array<Option> = [
  { label: "Alpha", value: "alpha" },
  { label: "Beta", value: "beta" }
]

describe("Select", () => {
  it("renders trigger, value, options, description, and error", () => {
    render(() => (
      <Select<Option>
        options={options}
        optionValue="value"
        optionTextValue="label"
        placeholder="Choose option"
        value={options[0]}
        validationState="invalid"
        open
        itemComponent={(props) => (
          <SelectItem item={props.item} itemClass="custom-item-label">
            {props.item.rawValue.label}
          </SelectItem>
        )}
      >
        <SelectLabel>Options</SelectLabel>
        <SelectTrigger>
          <SelectValue<Option>>
            {(state) => state.selectedOption()?.label ?? "Choose option"}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup class="custom-group">Featured</SelectGroup>
          <SelectSeparator class="custom-separator" />
        </SelectContent>
        <SelectDescription>Pick one option.</SelectDescription>
        <SelectErrorMessage>Option is required.</SelectErrorMessage>
      </Select>
    ))

    expect(screen.getByText("Options")).toHaveClass("text-sm")
    expect(screen.getByRole("button")).toHaveClass("border-input")
    expect(screen.getByRole("option", { name: "Alpha" })).toBeInTheDocument()
    expect(screen.getByText("Pick one option.")).toHaveClass("text-muted-foreground")
    expect(screen.getByText("Option is required.")).toHaveClass("text-destructive")
    expect(screen.getByRole("option", { name: "Alpha" }).lastElementChild).toHaveClass(
      "custom-item-label"
    )
    expect(screen.getByText("Featured")).toHaveAttribute("data-slot", "select-group")
    expect(screen.getByText("Featured")).toHaveClass("custom-group")
    expect(document.querySelector('[data-slot="select-separator"]')).toHaveClass(
      "custom-separator"
    )
  })
})
