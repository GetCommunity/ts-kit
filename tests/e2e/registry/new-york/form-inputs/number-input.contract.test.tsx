import { render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"
import { createSignal } from "solid-js"

vi.mock("@/registry/new-york/ui/number-field", () => ({
  NumberField: (props: Record<string, unknown>) => (
    <div
      data-testid="number-field-boundary"
      data-name={props.name as string}
      data-value={String(props.value ?? "")}
      data-default-value={String(props.defaultValue ?? "")}
      data-validation-state={props.validationState as string}
      data-required={String(props.required)}
      data-disabled={String(props.disabled)}
      data-readonly={String(props.readOnly)}
      data-raw-value={String(props.rawValue ?? "")}
      data-format={String(props.format)}
    >
      {props.children as JSX.Element}
      <button
        type="button"
        onClick={() => (props.onChange as (value: string | null) => void)("1,234.5")}
      >
        grouped
      </button>
      <button
        type="button"
        onClick={() => (props.onChange as (value: string | null) => void)(null)}
      >
        null
      </button>
      <button
        type="button"
        onClick={() => (props.onRawValueChange as (value: number) => void)(10)}
      >
        raw
      </button>
    </div>
  ),
  NumberFieldDecrementTrigger: () => <button type="button">decrement</button>,
  NumberFieldDescription: (props: { children: JSX.Element }) => (
    <div>{props.children}</div>
  ),
  NumberFieldIncrementTrigger: () => <button type="button">increment</button>,
  NumberFieldInput: (props: Record<string, unknown>) => (
    <input id={props.id as string} placeholder={props.placeholder as string} />
  ),
  NumberFieldLabel: (props: { children: JSX.Element }) => (
    <label>{props.children}</label>
  )
}))

import type { JSX } from "solid-js"
import NumberInput from "@/registry/new-york/form-inputs/number-input"

const user = userEvent.setup()

describe("NumberInput reactive boundary", () => {
  it("reactively normalizes boundary values and reflects signal changes", async () => {
    const [value, setValue] = createSignal<number | null>()

    render(() => (
      <>
        <NumberInput
          name="contract-number"
          value={value()}
          defaultValue={5}
          onChange={setValue}
          placeholder="Amount"
        />
        <output aria-label="number value">{value() ?? "null"}</output>
      </>
    ))

    const boundary = screen.getByTestId("number-field-boundary")
    expect(boundary).toHaveAttribute("data-value", "")

    await user.click(screen.getByText("grouped"))
    expect(screen.getByLabelText("number value")).toHaveTextContent("1234.5")
    expect(boundary).toHaveAttribute("data-value", "1234.5")

    await user.click(screen.getByText("null"))
    expect(screen.getByLabelText("number value")).toHaveTextContent("null")
    expect(boundary).toHaveAttribute("data-value", "")

    await user.click(screen.getByText("raw"))
    expect(boundary).toHaveAttribute("data-raw-value", "10")
  })
})
