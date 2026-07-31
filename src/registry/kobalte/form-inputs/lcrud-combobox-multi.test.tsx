import { fireEvent, screen, waitFor, within } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"
import { createSignal } from "solid-js"

import type { TestDocument, TestPage } from "~/test/utils/lcrud-test-helpers"

import LCRUDComboboxMulti from "@/registry/kobalte/form-inputs/lcrud-combobox-multi"
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
} from "~/test/utils/lcrud-test-helpers"

describe("LCRUDComboboxMulti", () => {
  it("loads options, initializes its controlled values, and selects every option", async () => {
    const user = userEvent.setup()
    const [value, setValue] = createSignal<Array<TestDocument>>([])
    const queryFn = createCollectionQueryMock()

    renderWithQuery(() => (
      <>
        <LCRUDComboboxMulti<TestDocument>
          name="reviewers"
          label="Reviewers"
          initialValue={[alpha]}
          value={value()}
          onChange={setValue}
          // @ts-expect-error - query options type mismatch
          queryOptions={createCollectionOptions("combobox-multi", queryFn)}
          error={["Reviewers are required"]}
          createDialog={<button type="button">Create reviewer</button>}
          getUpdateDialog={(option) => (
            <button type="button">Update {option.label}</button>
          )}
          getDeleteDialog={(option) => (
            <button type="button">Delete {option.label}</button>
          )}
          {...valueMappers}
        />
        <output aria-label="selected reviewers">
          {value()
            .map((option) => option.label)
            .join(",")}
        </output>
      </>
    ))

    await waitFor(() =>
      expect(screen.getByLabelText("selected reviewers")).toHaveTextContent("Alpha")
    )
    await waitFor(() => expect(queryFn).toHaveBeenCalledOnce())

    await user.click(screen.getByRole("button", { name: /Show suggestions/ }))
    await user.click(await screen.findByRole("option", { name: /Beta/ }))
    expect(screen.getByLabelText("selected reviewers")).toHaveTextContent("Alpha,Beta")
    await user.click(await screen.findByRole("button", { name: "Select All" }))

    expect(screen.getByLabelText("selected reviewers")).toHaveTextContent("Alpha,Beta")

    await user.keyboard("{Escape}")
    const alphaTag = screen
      .getAllByText("Alpha")
      .find((element) => element.tagName === "SPAN")
    expect(alphaTag).not.toBeNull()
    fireEvent.pointerDown(alphaTag!)
    await user.click(within(alphaTag!).getByRole("button"))
    expect(screen.getByLabelText("selected reviewers")).toHaveTextContent("Beta")

    const control = screen
      .getByRole("combobox", { name: "Reviewers" })
      .closest('[aria-label="Reviewers"]')
    expect(control).not.toBeNull()

    const clearButton = within(control as unknown as HTMLElement)
      .getAllByRole("button", { name: "" })
      .at(-1)
    expect(clearButton).toBeDefined()
    fireEvent.pointerDown(clearButton!)
    await user.click(clearButton!)
    expect(screen.getByLabelText("selected reviewers").textContent).toBe("")
  })

  it("resolves initial options by key and exposes default form metadata", async () => {
    const user = userEvent.setup()
    const [value, setValue] = createSignal<Array<TestDocument>>([])
    const queryFn = createCollectionQueryMock()

    const { container } = renderWithQuery(() => (
      <>
        <LCRUDComboboxMulti<TestDocument>
          label="Reviewers"
          initialValuesKey="documentId"
          initialValuesKeyValues={["alpha", "gamma"]}
          value={value()}
          onChange={setValue}
          // @ts-expect-error - query options type mismatch
          queryOptions={createCollectionOptions("combobox-multi-key", queryFn, [
            createPage([alpha, beta, gamma])
          ])}
          placeholder="Find reviewers"
          closeOnSelection
          orientation="horizontal"
          error={["Choose reviewers"]}
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
        <output aria-label="key-selected reviewers">
          {value()
            .map((option) => option.label)
            .join(",")}
        </output>
      </>
    ))

    expect(screen.getByLabelText("key-selected reviewers")).toHaveTextContent(
      "Alpha,Gamma"
    )
    expect(screen.getByText("Choose reviewers").parentElement).toHaveClass("col-span-2")
    expect(container.querySelector('[role="group"]')).toHaveClass("grid-cols-2")
    expect(screen.getByRole("combobox")).toHaveAttribute("id", "generic-combobox-multi")
    expect(container.querySelector("select")).toHaveAttribute(
      "name",
      "generic-combobox-multi"
    )

    await user.click(screen.getByRole("button", { name: /Show suggestions/ }))
    expect(await screen.findByRole("button", { name: "Update Alpha" })).toBeVisible()
    expect(screen.getByRole("button", { name: "Delete Alpha" })).toBeVisible()
    expect(screen.getByRole("option", { name: /Gamma/ })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
  })

  it("keeps empty values when key initialization inputs are incomplete", () => {
    const queryFn = createCollectionQueryMock()
    const onChangeWithoutKey = vi.fn()
    const onChangeWithoutValues = vi.fn()

    renderWithQuery(() => (
      <>
        <LCRUDComboboxMulti<TestDocument>
          value={undefined}
          onChange={onChangeWithoutKey}
          // @ts-expect-error - query options type mismatch
          queryOptions={createCollectionOptions("combobox-multi-no-key", queryFn, [
            createPage([alpha])
          ])}
          {...valueMappers}
        />
        <LCRUDComboboxMulti<TestDocument>
          initialValuesKey="documentId"
          value={undefined}
          onChange={onChangeWithoutValues}
          // @ts-expect-error - query options type mismatch
          queryOptions={createCollectionOptions(
            "combobox-multi-no-key-values",
            queryFn,
            [createPage([alpha])]
          )}
          {...valueMappers}
        />
      </>
    ))

    expect(onChangeWithoutKey).not.toHaveBeenCalled()
    expect(onChangeWithoutValues).not.toHaveBeenCalled()
  })

  it("loads another page and refreshes through its query actions", async () => {
    const user = userEvent.setup()
    const nextPage = createDeferred<TestPage>()
    const refresh = createDeferred<TestPage>()
    const queryFn = createCollectionQueryMock()
    queryFn.mockReturnValueOnce(nextPage.promise).mockReturnValueOnce(refresh.promise)

    renderWithQuery(() => (
      <LCRUDComboboxMulti<TestDocument>
        value={[]}
        onChange={vi.fn()}
        // @ts-expect-error - query options type mismatch
        queryOptions={createCollectionOptions("combobox-multi-pagination", queryFn, [
          createPage([alpha], 1, 2)
        ])}
        {...valueMappers}
      />
    ))

    await user.click(screen.getByRole("button", { name: /Show suggestions/ }))
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
      <LCRUDComboboxMulti<TestDocument>
        label="Disabled reviewers"
        disabled
        value={undefined}
        onChange={vi.fn()}
        // @ts-expect-error - query options type mismatch
        queryOptions={createCollectionOptions("combobox-multi-disabled", queryFn)}
        {...valueMappers}
      />
    ))

    expect(screen.getByRole("combobox")).toBeDisabled()
  })
})
