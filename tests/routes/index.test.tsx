import {
  render,
  screen,
  waitFor
} from "@solidjs/testing-library"
import { MetaProvider } from "@solidjs/meta"

import Home from "@/routes/index"

const pokemon = {
  name: "bulbasaur",
  id: 1,
  sprites: {
    front_default: "https://example.com/bulbasaur.png"
  },
  stats: [
    {
      base_stat: 45,
      stat: {
        name: "hp"
      }
    }
  ]
}

describe("Home route", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it("presents every registry example", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((input: string | URL | Request) => {
        const url = String(input)
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve(
              url.includes("?limit=")
                ? { results: [{ name: "bulbasaur" }] }
                : pokemon
            )
        })
      })
    )

    render(() => (
      <MetaProvider>
        <Home />
      </MetaProvider>
    ))

    expect(
      screen.getByRole("heading", { level: 1, name: "Custom Registry" })
    ).toBeInTheDocument()
    expect(
      screen.getByText(/custom registry for distributing code/)
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: "HelloWorld" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: "ExampleForm" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: "PokemonPage" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: "ExampleCard" })
    ).toBeInTheDocument()

    await waitFor(() => {
      expect(
        screen.getByRole("img", { name: "bulbasaur" })
      ).toBeInTheDocument()
    })
  })
})
