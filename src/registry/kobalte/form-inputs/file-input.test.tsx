import { fireEvent, render, screen } from "@solidjs/testing-library"
import { createSignal } from "solid-js"

import FileInput from "@/registry/kobalte/form-inputs/file-input"

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
