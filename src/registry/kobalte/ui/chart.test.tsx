import { render, screen, waitFor } from "@solidjs/testing-library"
import { createSignal } from "solid-js"

import type { Setter } from "solid-js"

const chartMocks = vi.hoisted(() => {
  const chart = {
    dispose: vi.fn(),
    hideLoading: vi.fn(),
    on: vi.fn(),
    resize: vi.fn(),
    setOption: vi.fn(),
    showLoading: vi.fn()
  }

  return {
    chart,
    init: vi.fn(() => chart),
    use: vi.fn()
  }
})

vi.mock("echarts/core", () => ({
  init: chartMocks.init,
  use: chartMocks.use
}))

import {
  ChartContainer,
  chartColors,
  chartGridDefaults,
  chartLegendDefaults,
  chartTooltipDefaults,
  chartXAxisDefaults,
  chartYAxisDefaults,
  createChartColorConfig,
  useChart
} from "@/registry/kobalte/ui/chart"

const ChartLabel = () => {
  const { config } = useChart()
  return <span>{config.sales?.label}</span>
}

describe("ChartContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    document.documentElement.removeAttribute("data-kb-theme")
    vi.unstubAllGlobals()
  })

  it("initializes ECharts, registers events, injects colors, and disposes", () => {
    const handleClick = vi.fn()
    const handleInit = vi.fn()
    const option = { series: [{ data: [1, 2, 3], type: "bar" }] }

    const { unmount } = render(() => (
      <ChartContainer
        option={option}
        config={{ sales: { color: "#123456", label: "Sales" } }}
        eventHandlers={{ click: handleClick }}
        onInit={handleInit}
        class="custom-chart"
        style={{ height: "240px" }}
      >
        <ChartLabel />
      </ChartContainer>
    ))

    const chart = screen.getByText("Sales").parentElement

    expect(chartMocks.init).toHaveBeenCalledWith(
      chart,
      undefined,
      expect.objectContaining({ renderer: "svg" })
    )
    expect(chartMocks.chart.setOption).toHaveBeenCalledWith(
      option,
      expect.objectContaining({ notMerge: true })
    )
    expect(chartMocks.chart.on).toHaveBeenCalledWith("click", handleClick)
    expect(handleInit).toHaveBeenCalledWith(chartMocks.chart)
    expect(chart).toHaveClass("custom-chart")
    expect(chart?.style.getPropertyValue("--color-sales")).toBe("#123456")
    expect(chart).toHaveStyle({ height: "240px" })

    unmount()
    expect(chartMocks.chart.dispose).toHaveBeenCalledOnce()
  })

  it("exports reusable chart defaults and colors", () => {
    expect(chartTooltipDefaults.trigger).toBe("axis")
    expect(chartLegendDefaults.icon).toBe("circle")
    expect(chartGridDefaults.containLabel).toBe(true)
    expect(chartXAxisDefaults.axisTick.show).toBe(false)
    expect(chartYAxisDefaults.axisLine.show).toBe(false)
    expect(createChartColorConfig()).toEqual({ color: chartColors })
  })

  it("requires useChart consumers to be inside the container", () => {
    expect(() => render(() => <ChartLabel />)).toThrow(
      "useChart must be used within a ChartContainer"
    )
  })

  it("reacts to option, loading, resize, and theme changes", async () => {
    let resizeCallback: ResizeObserverCallback | undefined
    const disconnect = vi.fn()
    const observe = vi.fn()

    vi.stubGlobal(
      "ResizeObserver",
      class {
        constructor(callback: ResizeObserverCallback) {
          resizeCallback = callback
        }

        disconnect = disconnect
        observe = observe
        unobserve = vi.fn()
      }
    )

    let setLoading!: Setter<boolean>
    let setOption!: Setter<{ series: Array<{ data: Array<number> }> }>
    const initialOption = { series: [{ data: [1] }] }
    const nextOption = { series: [{ data: [2, 3] }] }

    const { unmount } = render(() => {
      const [loading, updateLoading] = createSignal(false)
      const [option, updateOption] = createSignal(initialOption)
      setLoading = updateLoading
      setOption = updateOption

      return (
        <ChartContainer
          option={option()}
          loading={loading()}
          loadingOptions={{ text: "Loading data" }}
          config={{
            empty: {},
            missing: undefined as never,
            revenue: { theme: { light: "#eeeeee", dark: "#111111" } }
          }}
        />
      )
    })

    expect(chartMocks.chart.hideLoading).toHaveBeenCalled()
    expect(observe).toHaveBeenCalled()

    setLoading(true)
    await waitFor(() =>
      expect(chartMocks.chart.showLoading).toHaveBeenCalledWith("default", {
        text: "Loading data"
      })
    )

    setOption(nextOption)
    await waitFor(() =>
      expect(chartMocks.chart.setOption).toHaveBeenLastCalledWith(
        nextOption,
        expect.objectContaining({ notMerge: true })
      )
    )

    resizeCallback?.([], {} as ResizeObserver)
    expect(chartMocks.chart.resize).toHaveBeenCalled()

    document.documentElement.setAttribute("data-kb-theme", "dark")
    await waitFor(() =>
      expect(
        document
          .querySelector<HTMLElement>("[data-slot='chart']")
          ?.style.getPropertyValue("--color-revenue")
      ).toBe("#111111")
    )

    document.documentElement.setAttribute("data-kb-theme", "light")
    await waitFor(() =>
      expect(
        document
          .querySelector<HTMLElement>("[data-slot='chart']")
          ?.style.getPropertyValue("--color-revenue")
      ).toBe("#eeeeee")
    )

    document.documentElement.setAttribute("data-unrelated", "value")
    await waitFor(() =>
      expect(
        document
          .querySelector<HTMLElement>("[data-slot='chart']")
          ?.style.getPropertyValue("--color-revenue")
      ).toBe("#eeeeee")
    )
    document.documentElement.removeAttribute("data-unrelated")

    unmount()
    expect(disconnect).toHaveBeenCalled()
  })
})
