import { Time } from "@internationalized/date"
import { fireEvent, render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"
import { createSignal } from "solid-js"

import FileInput from "@/registry/new-york/form-inputs/file-input"
import FormInputDescription from "@/registry/new-york/form-inputs/form-input-description"
import FormInputErrors from "@/registry/new-york/form-inputs/form-input-errors"
import HiddenInput from "@/registry/new-york/form-inputs/hidden-input"
import NumberInput from "@/registry/new-york/form-inputs/number-input"
import NumberRangeInput from "@/registry/new-york/form-inputs/number-range-input"
import TextInput from "@/registry/new-york/form-inputs/text-input.ui"
import TimeInput from "@/registry/new-york/form-inputs/time-input.ui"

const user = userEvent.setup()

describe("form input messages", () => {
  it("renders descriptions and every error, including custom classes", async () => {
    render(() => (
      <>
        <FormInputDescription description="Helpful context" class="description-class" />
        <FormInputDescription />
        <FormInputErrors
          error={["First problem", "Second problem"]}
          class="error-class"
        />
        <FormInputErrors />
      </>
    ))

    expect(screen.getByText("Helpful context")).toHaveClass("description-class")
    expect(screen.getByText("First problem").parentElement).toHaveClass("error-class")
    expect(screen.getByText("Second problem")).toBeInTheDocument()
  })
})

describe("HiddenInput", () => {
  it.each([
    ["text", "alpha"],
    ["array", ["alpha", "beta"]],
    ["number", 42],
    ["true boolean", true],
    ["false boolean", false],
    ["null", null],
    ["undefined", undefined]
  ] as const)("serializes a %s value", (_case, value) => {
    const { container } = render(() => (
      // @ts-expect-error - value is nullish/undefinable
      <HiddenInput name="hidden-field" value={value} />
    ))
    const input = container.querySelector("input") as HTMLInputElement

    expect(input).toHaveAttribute("type", "hidden")
    if (Array.isArray(value)) {
      expect(input.value).toBe("alpha,beta")
    } else if (typeof value === "boolean") {
      expect(input.value).toBe(value ? "true" : "false")
      expect(input.checked).toBe(value)
    } else if (value == null) {
      expect(input.value).toBe("")
    } else {
      expect(input.value).toBe(String(value))
    }
  })

  it("shows its first error and forwards disabled state", async () => {
    const { container } = render(() => (
      <HiddenInput
        name="account-id"
        value="abc"
        error={["Invalid account", "Ignored detail"]}
        disabled
      />
    ))

    expect(container.querySelector("input")).toBeDisabled()
    expect(screen.getByText("account-id Error: Invalid account")).toBeInTheDocument()
  })

  it("supports the defensive non-array error rendering path", async () => {
    render(() => (
      <HiddenInput
        name="legacy-field"
        value="abc"
        error={"Legacy error" as unknown as [string, ...Array<string>]}
      />
    ))
    expect(screen.getByText("legacy-field Error: Legacy error")).toBeInTheDocument()
  })
})

describe("TextInput", () => {
  it("renders and changes a single-line field", async () => {
    const [value, setValue] = createSignal<string | null>(null)
    render(() => (
      <TextInput
        type="email"
        name="email"
        value={value()}
        onChange={setValue}
        label="Email"
        description="We will contact you."
        placeholder="name@example.com"
        required
        error={["Email is required"]}
        autoComplete="email"
        autoFocus
        tabIndex={2}
        class="field-class"
        inputClass="input-class"
      />
    ))

    const input = screen.getByLabelText(/Email/) as HTMLInputElement
    expect(input).toHaveValue("")
    expect(input).toHaveAttribute("type", "email")
    expect(input).toHaveAttribute("autocomplete", "email")
    expect(input).toHaveAttribute("tabindex", "2")
    expect(input).toHaveClass("input-class")
    expect(screen.getByText("We will contact you.")).toBeInTheDocument()
    expect(screen.getByText("Email is required")).toBeInTheDocument()

    fireEvent.input(input, { target: { value: "person@example.com" } })
    expect(input).toHaveValue("person@example.com")
    fireEvent.input(input, { target: { value: "" } })
    expect(input).toHaveValue("")
  })

  it("renders and changes a multiline field", async () => {
    const [value, setValue] = createSignal<string | null>("Existing")
    render(() => (
      <TextInput
        type="text"
        name="notes"
        value={value()}
        onChange={setValue}
        multiline
        rows={4}
        autoResize
        placeholder="Notes"
      />
    ))

    const textarea = screen.getByPlaceholderText("Notes")
    expect(textarea.tagName).toBe("TEXTAREA")
    expect(textarea).toHaveAttribute("rows", "4")
    fireEvent.input(textarea, { target: { value: "Updated" } })
    expect(textarea).toHaveValue("Updated")
  })
})

describe("NumberInput", () => {
  it("renders decorations and reports numeric, grouped, and empty input", async () => {
    const [value, setValue] = createSignal<number | null>(12)
    render(() => (
      <NumberInput
        name="quantity"
        value={value()}
        onChange={setValue}
        label="Quantity"
        description="Enter an amount."
        placeholder="0"
        required
        error={["Invalid amount"]}
        class="number-class"
      />
    ))

    const input = screen.getByRole("spinbutton")
    expect(screen.getByText("Quantity")).toBeInTheDocument()
    expect(screen.getByText("Enter an amount.")).toBeInTheDocument()
    expect(screen.getByText("Invalid amount")).toBeInTheDocument()

    fireEvent.input(input, { target: { value: "1234.5" } })
    expect(input).toHaveValue("1234.5")
    fireEvent.input(input, { target: { value: "" } })
    expect(input).toHaveValue("")
  })
})

describe("NumberRangeInput", () => {
  it("renders a labeled two-thumb error range and value label", async () => {
    const rectSpy = vi
      .spyOn(HTMLElement.prototype, "getBoundingClientRect")
      .mockReturnValue({
        bottom: 20,
        height: 20,
        left: 0,
        right: 100,
        top: 0,
        width: 100,
        x: 0,
        y: 0,
        toJSON: () => ({})
      })
    const setPropertySpy = vi
      .spyOn(CSSStyleDeclaration.prototype, "setProperty")
      .mockImplementation(() => {})

    const { container } = render(() => (
      <NumberRangeInput
        name="price"
        value={[10, 30]}
        onChange={vi.fn()}
        label="Price"
        description="Choose a range."
        getValueLabel={({ values }) => values.join(" to ")}
        minValue={0}
        maxValue={100}
        required
        disabled
        error={["Range is unavailable"]}
      />
    ))

    expect(screen.getByText("Price")).toBeInTheDocument()
    expect(screen.getByText("10 to 30")).toBeInTheDocument()
    expect(screen.getByText("Choose a range.")).toBeInTheDocument()
    expect(screen.getByText("Range is unavailable")).toBeInTheDocument()
    expect(container.querySelectorAll('[role="slider"]')).toHaveLength(2)

    rectSpy.mockRestore()
    setPropertySpy.mockRestore()
  })

  it("renders one thumb for a single value and two when multiple is requested", async () => {
    const setPropertySpy = vi
      .spyOn(CSSStyleDeclaration.prototype, "setProperty")
      .mockImplementation(() => {})
    const first = render(() => (
      <NumberRangeInput name="single" value={[5]} onChange={vi.fn()} />
    ))
    expect(first.container.querySelectorAll('[role="slider"]')).toHaveLength(1)
    first.unmount()

    const second = render(() => (
      <NumberRangeInput name="multiple" value={null} onChange={vi.fn()} multiple />
    ))
    expect(second.container.querySelectorAll('[role="slider"]')).toHaveLength(2)
    second.unmount()

    const empty = render(() => (
      <NumberRangeInput name="empty" value={null} onChange={vi.fn()} />
    ))
    expect(empty.container.querySelectorAll('[role="slider"]')).toHaveLength(1)
    setPropertySpy.mockRestore()
  })

  it("updates its value signal from slider input", async () => {
    const [value, setValue] = createSignal([5])
    const setPropertySpy = vi
      .spyOn(CSSStyleDeclaration.prototype, "setProperty")
      .mockImplementation(() => {})
    render(() => (
      <>
        <NumberRangeInput name="reactive-range" value={value()} onChange={setValue} />
        <output aria-label="range value">{value().join(",")}</output>
      </>
    ))

    fireEvent.keyDown(screen.getAllByRole("slider")[0]!, { key: "ArrowRight" })
    expect(screen.getByLabelText("range value")).toHaveTextContent("6")
    setPropertySpy.mockRestore()
  })
})

describe("FileInput", () => {
  const handlers = () => ({
    ref: vi.fn(),
    onInput: vi.fn(),
    onChange: vi.fn(),
    onBlur: vi.fn()
  })

  it("renders an empty single-file drop zone and forwards input events", async () => {
    const events = handlers()
    render(() => (
      <FileInput
        {...events}
        name="attachment"
        label="Attachment"
        description="PDF only."
        accept=".pdf"
      />
    ))

    const input = screen.getByLabelText("Click or drag and drop file.")
    expect(screen.getByText("PDF only.")).toBeInTheDocument()
    expect(input).toHaveAttribute("accept", ".pdf")
    expect(events.ref).toHaveBeenCalledWith(input, undefined)

    fireEvent.input(input)
    fireEvent.change(input)
    fireEvent.blur(input)
    expect(events.onInput).toHaveBeenCalledOnce()
    expect(events.onChange).toHaveBeenCalledOnce()
    expect(events.onBlur).toHaveBeenCalledOnce()
  })

  it("renders plural empty-drop copy when multiple files are accepted", async () => {
    render(() => (
      <FileInput {...handlers()} name="empty-documents" label="Documents" multiple />
    ))
    expect(screen.getByText("Click or drag and drop files.")).toBeInTheDocument()
  })

  it("reactively displays files selected through onChange", async () => {
    const [value, setValue] = createSignal<Array<File>>([])
    const selectedFile = new File(["selected"], "selected.txt")
    render(() => (
      <FileInput
        ref={vi.fn()}
        name="reactive-file"
        value={value()}
        label="Reactive file"
        onInput={vi.fn()}
        onBlur={vi.fn()}
        onChange={(event) => setValue(Array.from(event.currentTarget.files ?? []))}
      />
    ))

    const input = screen.getByLabelText("Click or drag and drop file.")
    Object.defineProperty(input, "files", {
      configurable: true,
      value: [selectedFile]
    })
    fireEvent.change(input)
    expect(screen.getByText("Selected file: selected.txt")).toBeInTheDocument()
  })

  it("lists one or multiple selected files with error and disabled state", async () => {
    const events = handlers()
    const files = [new File(["a"], "a.txt"), new File(["b"], "b.txt")]
    const { unmount } = render(() => (
      <FileInput
        {...events}
        name="documents"
        value={files}
        label="Documents"
        multiple
        disabled
        required
        error={["Files are invalid"]}
      />
    ))

    expect(screen.getByText("Selected files: a.txt, b.txt")).toBeInTheDocument()
    expect(screen.getByLabelText("Selected files: a.txt, b.txt")).toBeDisabled()
    expect(screen.getByText("Files are invalid")).toBeInTheDocument()
    unmount()

    render(() => (
      <FileInput
        {...handlers()}
        name="avatar"
        value={new File(["avatar"], "avatar.png")}
        label="Avatar"
      />
    ))
    expect(screen.getByText("Selected file: avatar.png")).toBeInTheDocument()
  })
})

describe("TimeInput", () => {
  it("uses a default value and reports valid, empty, and invalid input", async () => {
    const [value, setValue] = createSignal<Time | null | undefined>(undefined)
    render(() => (
      <>
        <TimeInput
          name="start-time"
          value={value()}
          defaultValue={new Time(9, 5)}
          onChange={setValue}
          label="Start"
          description="Local time."
          required
          error={["Time is required"]}
          timeStep={30}
          inputClass="time-class"
        />
        <output aria-label="time value">{value()?.toString() ?? "null"}</output>
      </>
    ))

    const input = screen.getByLabelText(/Start/) as HTMLInputElement
    expect(input).toHaveValue("09:05")
    expect(input).toHaveAttribute("step", "30")
    expect(screen.getByText("Local time.")).toBeInTheDocument()
    expect(screen.getByText("Time is required")).toBeInTheDocument()

    fireEvent.input(input, { target: { value: "14:30" } })
    expect(input).toHaveValue("14:30")
    expect(screen.getByLabelText("time value")).toHaveTextContent("14:30:00")
    fireEvent.input(input, { target: { value: "" } })
    expect(input).toHaveValue("")
    expect(screen.getByLabelText("time value")).toHaveTextContent("null")

    Object.defineProperty(input, "value", {
      configurable: true,
      value: "invalid",
      writable: true
    })
    fireEvent.input(input)
    expect(screen.getByLabelText("time value")).toHaveTextContent("null")
  })

  it("clears a value with either clear-button presentation", async () => {
    const [plainValue, setPlainValue] = createSignal<Time | null>(new Time(10))
    const plain = render(() => (
      <TimeInput name="plain-time" value={plainValue()} onChange={setPlainValue} />
    ))
    await user.click(screen.getByRole("button"))
    expect(screen.getByRole("button")).toBeDisabled()
    plain.unmount()

    const [tooltipValue, setTooltipValue] = createSignal<Time | null>(new Time(11))
    render(() => (
      <TimeInput
        name="tooltip-time"
        value={tooltipValue()}
        onChange={setTooltipValue}
        showTooltip
      />
    ))
    await user.click(screen.getByRole("button"))
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("disables clearing when disabled or empty", async () => {
    const first = render(() => (
      <TimeInput
        name="disabled-time"
        value={new Time(10)}
        onChange={vi.fn()}
        disabled
      />
    ))
    expect(screen.getByRole("button")).toBeDisabled()
    first.unmount()
    render(() => <TimeInput name="empty-time" value={null} onChange={vi.fn()} />)
    expect(screen.getByRole("button")).toBeDisabled()
  })

  it("renders a plain label and an errored tooltip clear action", async () => {
    const first = render(() => (
      <TimeInput
        name="labeled-time"
        value={new Time(8)}
        onChange={vi.fn()}
        label="Labeled time"
      />
    ))
    expect(screen.getByText("Labeled time")).toBeInTheDocument()
    first.unmount()

    render(() => (
      <TimeInput
        name="errored-tooltip-time"
        value={new Time(8)}
        onChange={vi.fn()}
        showTooltip
        error={["Invalid time"]}
      />
    ))
    expect(screen.getByText("Invalid time")).toBeInTheDocument()
  })
})
