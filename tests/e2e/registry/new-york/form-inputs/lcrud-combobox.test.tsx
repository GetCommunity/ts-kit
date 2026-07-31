import { screen, waitFor } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"
import { createSignal } from "solid-js"

import LCRUDCombobox from "@/registry/new-york/form-inputs/lcrud-combobox"
import type { TestDocument, TestPage } from "./lcrud-test-helpers"
import {
  alpha,
  beta,
  createCollectionOptions,
  createCollectionQueryMock,
  createDeferred,
  createPage,
  gamma,
  renderWithQuery,
  valueMappers
} from "./lcrud-test-helpers"

describe("LCRUDCombobox", () => {
  it("loads options, initializes its controlled value, and selects another option", async () => {
    const user = userEvent.setup()
    const [value, setValue] = createSignal<TestDocument>()
    const queryFn = createCollectionQueryMock()

    renderWithQuery(() => (
      <>
        <LCRUDCombobox<TestDocument>
          name="owner"
          label="Owner"
          description="Choose the record owner."
          initialValue={alpha}
          value={value()}
          onChange={setValue}
          // @ts-expect-error - query options type mismatch
          queryOptions={createCollectionOptions("combobox", queryFn)}
          error={["Owner is required"]}
          createDialog={<button type="button">Create owner</button>}
          getUpdateDialog={(option) => (
            <button type="button">Update {option.label}</button>
          )}
          getDeleteDialog={(option) => (
            <button type="button">Delete {option.label}</button>
          )}
          {...valueMappers}
        />
        <output aria-label="selected owner">{value()?.label ?? ""}</output>
      </>
    ))

    await waitFor(() =>
      expect(screen.getByLabelText("selected owner")).toHaveTextContent("Alpha")
    )
    await waitFor(() => expect(queryFn).toHaveBeenCalledOnce())
    expect(screen.getByText("Choose the record owner.")).toBeInTheDocument()
    expect(screen.getByText("Owner is required")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: /Show suggestions/ }))
    await user.click(await screen.findByRole("option", { name: /Beta/ }))

    expect(screen.getByLabelText("selected owner")).toHaveTextContent("Beta")
  })

  it("resolves an initial option by key and supports default field metadata", async () => {
    const user = userEvent.setup()
    const [value, setValue] = createSignal<TestDocument>()
    const queryFn = createCollectionQueryMock()

    const { container } = renderWithQuery(() => (
      <>
        <LCRUDCombobox<TestDocument>
          label="Owner"
          initialValueKey="documentId"
          initialValueKeyValue="beta"
          value={value()}
          onChange={setValue}
          // @ts-expect-error - query options type mismatch
          queryOptions={createCollectionOptions("combobox-key", queryFn, [
            createPage([alpha, beta, gamma])
          ])}
          placeholder="Find an owner"
          closeOnSelection
          orientation="horizontal"
          error={["Choose an owner"]}
          {...valueMappers}
        />
        <output aria-label="key-selected owner">{value()?.label ?? ""}</output>
      </>
    ))

    expect(screen.getByLabelText("key-selected owner")).toHaveTextContent("Beta")
    expect(screen.getByText("Choose an owner").parentElement).toHaveClass("col-span-2")
    expect(container.querySelector('[role="group"]')).toHaveClass("grid-cols-2")
    expect(screen.getByRole("combobox")).toHaveAttribute("id", "generic-combobox")
    expect(screen.getByRole("combobox")).toHaveAttribute("placeholder", "Find an owner")
    expect(container.querySelector("select")).toHaveAttribute(
      "name",
      "generic-combobox"
    )

    await user.click(screen.getByRole("button", { name: /Show suggestions/ }))
    expect(await screen.findByRole("option", { name: /Alpha/ })).toBeInTheDocument()
    expect(screen.getByRole("option", { name: /Gamma/ })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
    expect(screen.queryByText("Create owner")).not.toBeInTheDocument()
  })

  it("keeps an empty value when key initialization inputs are incomplete", () => {
    const queryFn = createCollectionQueryMock()
    const onChangeWithoutKey = vi.fn()
    const onChangeWithoutValue = vi.fn()

    renderWithQuery(() => (
      <>
        <LCRUDCombobox<TestDocument>
          value={undefined}
          onChange={onChangeWithoutKey}
          // @ts-expect-error - query options type mismatch
          queryOptions={createCollectionOptions("combobox-no-key", queryFn, [
            createPage([alpha])
          ])}
          {...valueMappers}
        />
        <LCRUDCombobox<TestDocument>
          initialValueKey="documentId"
          value={undefined}
          onChange={onChangeWithoutValue}
          // @ts-expect-error - query options type mismatch
          queryOptions={createCollectionOptions("combobox-no-key-value", queryFn, [
            createPage([alpha])
          ])}
          {...valueMappers}
        />
      </>
    ))

    expect(onChangeWithoutKey).not.toHaveBeenCalled()
    expect(onChangeWithoutValue).not.toHaveBeenCalled()
  })

  it("loads another page and refreshes through its query actions", async () => {
    const user = userEvent.setup()
    const nextPage = createDeferred<TestPage>()
    const refresh = createDeferred<TestPage>()
    const queryFn = createCollectionQueryMock()
    queryFn.mockReturnValueOnce(nextPage.promise).mockReturnValueOnce(refresh.promise)

    renderWithQuery(() => (
      <LCRUDCombobox<TestDocument>
        value={undefined}
        onChange={vi.fn()}
        // @ts-expect-error - query options type mismatch
        queryOptions={createCollectionOptions("combobox-pagination", queryFn, [
          createPage([alpha], 1, 2)
        ])}
        createDialog={<button type="button">Create owner</button>}
        {...valueMappers}
      />
    ))

    await user.click(screen.getByRole("button", { name: /Show suggestions/ }))
    expect(screen.getByRole("button", { name: "Create owner" })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Load More" }))
    expect(screen.getByRole("button", { name: "Loading more..." })).toBeDisabled()
    nextPage.resolve(createPage([gamma], 2, 2))
    await screen.findByRole("option", { name: /Gamma/ })

    await user.click(screen.getByRole("button", { name: "Refresh" }))
    expect(screen.getByRole("button", { name: "Refreshing..." })).toBeDisabled()
    refresh.resolve(createPage([alpha], 1, 1))
    await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2))
  })

  it("forwards its disabled state", () => {
    const queryFn = createCollectionQueryMock()

    renderWithQuery(() => (
      <LCRUDCombobox<TestDocument>
        label="Disabled owner"
        disabled
        value={undefined}
        onChange={vi.fn()}
        // @ts-expect-error - query options type mismatch
        queryOptions={createCollectionOptions("combobox-disabled", queryFn)}
        {...valueMappers}
      />
    ))

    expect(screen.getByRole("combobox")).toBeDisabled()
  })
})
