import { fireEvent, screen, waitFor, within } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"
import { createSignal } from "solid-js"

import LCRUDSelect from "@/registry/new-york/form-inputs/lcrud-select.ui"
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

import type { TestDocument, TestPage } from "./lcrud-test-helpers"

describe("LCRUDSelect", () => {
  it("loads options, initializes its controlled value, and selects another option", async () => {
    const user = userEvent.setup()
    const [value, setValue] = createSignal<TestDocument>()
    const queryFn = createCollectionQueryMock()

    renderWithQuery(() => (
      <>
        <LCRUDSelect<TestDocument>
          name="category"
          label="Category"
          description="Choose a category."
          initialValue={alpha}
          value={value()}
          onChange={setValue}
          // @ts-expect-error - query options type mismatch
          queryOptions={createCollectionOptions("select", queryFn)}
          error={["Category is required"]}
          createDialog={<button type="button">Create category</button>}
          getUpdateDialog={(option) => (
            <button type="button">Update {option.label}</button>
          )}
          getDeleteDialog={(option) => (
            <button type="button">Delete {option.label}</button>
          )}
          {...valueMappers}
        />
        <output aria-label="selected category">{value()?.label ?? ""}</output>
      </>
    ))

    await waitFor(() =>
      expect(screen.getByLabelText("selected category")).toHaveTextContent("Alpha")
    )
    await waitFor(() => expect(queryFn).toHaveBeenCalledOnce())
    expect(screen.getByText("Choose a category.")).toBeInTheDocument()

    const trigger = screen.getByRole("button", { name: /Category/ })
    await waitFor(() => expect(trigger).toHaveTextContent("Alpha"))
    await user.click(trigger)
    await user.click(await screen.findByRole("option", { name: /Beta/ }))

    expect(screen.getByLabelText("selected category")).toHaveTextContent("Beta")

    await user.keyboard("{Escape}")
    const betaTag = screen
      .getAllByText("Beta")
      .find((element) => element.tagName === "SPAN")
    expect(betaTag).toBeDefined()
    fireEvent.pointerDown(betaTag!)
    await user.click(within(betaTag!).getByRole("button"))
    expect(screen.getByLabelText("selected category").textContent).toBe("")

    const triggerAfterRemove = screen.getByRole("button", { name: /Category/ })
    await user.click(triggerAfterRemove)
    await user.click(await screen.findByRole("option", { name: /Alpha/ }))
    await user.keyboard("{Escape}")

    const clearButton = within(screen.getByRole("button", { name: /Category/ }))
      .getAllByRole("button", { name: "" })
      .at(-1)
    expect(clearButton).toBeDefined()
    fireEvent.pointerDown(clearButton!)
    await user.click(clearButton!)
    expect(screen.getByLabelText("selected category").textContent).toBe("")
  })

  it("resolves an initial option by key and supports default field metadata", async () => {
    const user = userEvent.setup()
    const [value, setValue] = createSignal<TestDocument>()
    const queryFn = createCollectionQueryMock()

    const { container } = renderWithQuery(() => (
      <>
        <LCRUDSelect<TestDocument>
          label="Category"
          initialValueKey="documentId"
          initialValueKeyValue="beta"
          value={value()}
          onChange={setValue}
          // @ts-expect-error - query options type mismatch
          queryOptions={createCollectionOptions("select-key", queryFn, [
            createPage([alpha, beta, gamma])
          ])}
          placeholder="Find a category"
          closeOnSelection
          orientation="horizontal"
          error={["Choose a category"]}
          getUpdateDialog={(option) =>
            option.documentId === "alpha" ? (
              <button type="button">Update Alpha</button>
            ) : null
          }
          getDeleteDialog={(option) =>
            option.documentId === "alpha" ? (
              <button type="button">Delete Alpha</button>
            ) : null
          }
          {...valueMappers}
        />
        <output aria-label="key-selected category">{value()?.label ?? ""}</output>
      </>
    ))

    expect(screen.getByLabelText("key-selected category")).toHaveTextContent("Beta")
    expect(screen.getByText("Choose a category").parentElement).toHaveClass(
      "col-span-2"
    )
    expect(container.querySelector('[role="group"]')).toHaveClass("grid-cols-2")
    expect(container.querySelector("select")).toHaveAttribute("name", "generic-select")

    const trigger = screen.getByRole("button", { name: /Category/ })
    await user.click(trigger)
    expect(await screen.findByRole("button", { name: "Update Alpha" })).toBeVisible()
    expect(screen.getByRole("button", { name: "Delete Alpha" })).toBeVisible()
    expect(screen.getByRole("option", { name: /Gamma/ })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
  })

  it("keeps an empty value when key initialization inputs are incomplete", () => {
    const queryFn = createCollectionQueryMock()
    const onChangeWithoutKey = vi.fn()
    const onChangeWithoutValue = vi.fn()

    renderWithQuery(() => (
      <>
        <LCRUDSelect<TestDocument>
          value={undefined}
          onChange={onChangeWithoutKey}
          // @ts-expect-error - query options type mismatch
          queryOptions={createCollectionOptions("select-no-key", queryFn, [
            createPage([alpha])
          ])}
          {...valueMappers}
        />
        <LCRUDSelect<TestDocument>
          initialValueKey="documentId"
          value={undefined}
          onChange={onChangeWithoutValue}
          // @ts-expect-error - query options type mismatch
          queryOptions={createCollectionOptions("select-no-key-value", queryFn, [
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
      <LCRUDSelect<TestDocument>
        value={undefined}
        onChange={vi.fn()}
        // @ts-expect-error - query options type mismatch
        queryOptions={createCollectionOptions("select-pagination", queryFn, [
          createPage([alpha], 1, 2)
        ])}
        {...valueMappers}
      />
    ))

    await user.click(screen.getByRole("button", { name: /Select/ }))
    await user.click(screen.getByRole("button", { name: "Load More" }))
    expect(screen.getByRole("button", { name: "Loading more..." })).toBeDisabled()
    nextPage.resolve(createPage([gamma], 2, 2))
    await screen.findByRole("option", { name: /Gamma/ })

    await user.click(screen.getByRole("button", { name: "Refresh" }))
    expect(screen.getByRole("button", { name: "Refreshing..." })).toBeDisabled()
    refresh.resolve(createPage([alpha], 1, 1))
    await waitFor(() => expect(queryFn).toHaveBeenCalledTimes(2))
  })

  it("forwards disabled state without optional labels or errors", () => {
    const queryFn = createCollectionQueryMock()

    renderWithQuery(() => (
      <LCRUDSelect<TestDocument>
        label="Disabled category"
        disabled
        value={undefined}
        onChange={vi.fn()}
        // @ts-expect-error - query options type mismatch
        queryOptions={createCollectionOptions("select-disabled", queryFn)}
        {...valueMappers}
      />
    ))

    expect(screen.getByRole("button", { name: /Select/ })).toBeDisabled()
    expect(screen.queryByText("Choose a category")).not.toBeInTheDocument()
  })
})
