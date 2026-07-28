import { render, screen } from "@solidjs/testing-library"

import {
  Tabs,
  TabsContent,
  TabsIndicator,
  TabsList,
  TabsTrigger
} from "@/registry/base/ui/tabs"

describe("Tabs", () => {
  it("renders tabs, content, and indicator", () => {
    render(() => (
      <Tabs value="overview">
        <TabsList class="custom-tabs-list">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsIndicator />
        </TabsList>
        <TabsContent value="overview">Overview content</TabsContent>
        <TabsContent value="settings">Settings content</TabsContent>
      </Tabs>
    ))

    expect(screen.getByRole("tablist")).toHaveClass("custom-tabs-list")
    expect(screen.getByRole("tab", { name: "Overview" })).toHaveClass("px-3")
    expect(screen.getByRole("tabpanel")).toHaveTextContent("Overview content")
  })
})
