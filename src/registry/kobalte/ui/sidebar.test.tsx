import { fireEvent, render, screen } from "@solidjs/testing-library"
import userEvent from "@testing-library/user-event"

const mobileMocks = vi.hoisted(() => ({ isMobile: false }))

vi.mock("@/hooks/use-mobile", () => ({
  useIsMobile: () => () => mobileMocks.isMobile
}))

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar
} from "@/registry/kobalte/ui/sidebar"

const user = userEvent.setup()

describe("Sidebar", () => {
  beforeEach(() => {
    mobileMocks.isMobile = false
  })

  it("renders its composition and toggles from click and keyboard", async () => {
    const handleTriggerClick = vi.fn()

    render(() => (
      <SidebarProvider defaultOpen class="custom-provider">
        <Sidebar side="right" variant="floating">
          <SidebarHeader>
            <SidebarInput aria-label="Search navigation" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Workspace</SidebarGroupLabel>
              <SidebarGroupAction aria-label="Add item">+</SidebarGroupAction>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton isActive tooltip="Dashboard">
                      Dashboard
                    </SidebarMenuButton>
                    <SidebarMenuAction showOnHover>More</SidebarMenuAction>
                    <SidebarMenuBadge>3</SidebarMenuBadge>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/reports">
                          Reports
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </SidebarMenuItem>
                  <SidebarMenuSkeleton showIcon />
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarSeparator />
          <SidebarFooter>Account</SidebarFooter>
          <SidebarRail />
        </Sidebar>
        <SidebarInset>
          <SidebarTrigger onClick={handleTriggerClick} />
        </SidebarInset>
      </SidebarProvider>
    ))

    const sidebar = document.querySelector("[data-slot='sidebar']")

    expect(sidebar).toHaveAttribute("data-state", "expanded")
    expect(sidebar).toHaveAttribute("data-side", "right")
    expect(screen.getByLabelText("Search navigation")).toHaveAttribute(
      "data-slot",
      "sidebar-input"
    )
    expect(screen.getByRole("link", { name: "Reports" })).toHaveAttribute(
      "href",
      "/reports"
    )
    expect(screen.getByText("3")).toHaveAttribute("data-slot", "sidebar-menu-badge")
    expect(
      document.querySelector("[data-sidebar='menu-skeleton-icon']")
    ).toBeInTheDocument()

    await user.click(
      document.querySelector<HTMLButtonElement>("[data-slot='sidebar-trigger']")!
    )
    expect(handleTriggerClick).toHaveBeenCalledOnce()
    expect(sidebar).toHaveAttribute("data-state", "collapsed")

    fireEvent.keyDown(window, { key: "b", ctrlKey: true })
    expect(sidebar).toHaveAttribute("data-state", "expanded")

    fireEvent.keyDown(window, { key: "x", ctrlKey: true })
    fireEvent.keyDown(window, { key: "b" })
    expect(sidebar).toHaveAttribute("data-state", "expanded")

    fireEvent.keyDown(window, { key: "b", metaKey: true })
    expect(sidebar).toHaveAttribute("data-state", "collapsed")
  })

  it("requires consumers to be inside the provider", () => {
    expect(() => render(() => <SidebarTrigger />)).toThrow(
      "useSidebar must be used within a SidebarProvider."
    )
    expect(() => render(() => <SidebarState />)).toThrow(
      "useSidebar must be used within a SidebarProvider."
    )
  })

  it("supports controlled state, plain menu buttons, and default desktop layout", async () => {
    const handleOpenChange = vi.fn()

    render(() => (
      <SidebarProvider open onOpenChange={handleOpenChange}>
        <Sidebar>
          <SidebarMenuButton>Plain item</SidebarMenuButton>
        </Sidebar>
        <SidebarTrigger />
        <SetSidebarClosed />
      </SidebarProvider>
    ))

    expect(document.querySelector("[data-slot='sidebar']")).toHaveAttribute(
      "data-side",
      "left"
    )
    expect(document.querySelector("[data-slot='sidebar-gap']")).toHaveClass(
      "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
    )
    expect(screen.getByRole("button", { name: "Plain item" })).toHaveAttribute(
      "data-active",
      "false"
    )

    await user.click(
      document.querySelector<HTMLButtonElement>("[data-slot='sidebar-trigger']")!
    )
    expect(handleOpenChange).toHaveBeenCalledWith(false)

    await user.click(screen.getByRole("button", { name: "Set closed" }))
    expect(handleOpenChange).toHaveBeenLastCalledWith(false)
  })

  it("renders non-collapsible and mobile sidebars", async () => {
    const { unmount } = render(() => (
      <SidebarProvider>
        <Sidebar collapsible="none" class="static-sidebar">
          Static content
        </Sidebar>
      </SidebarProvider>
    ))

    expect(screen.getByText("Static content")).toHaveClass("static-sidebar")
    unmount()

    mobileMocks.isMobile = true
    render(() => (
      <SidebarProvider defaultOpen={false}>
        <Sidebar side="right">
          <SidebarMenuButton tooltip="Mobile item">Mobile item</SidebarMenuButton>
        </Sidebar>
        <SidebarTrigger />
      </SidebarProvider>
    ))

    await user.click(
      document.querySelector<HTMLButtonElement>("[data-slot='sidebar-trigger']")!
    )

    expect(screen.getByRole("dialog", { name: "Sidebar" })).toHaveAttribute(
      "data-mobile",
      "true"
    )
    expect(screen.getByRole("button", { name: "Mobile item" })).toBeInTheDocument()
  })
})

const SidebarState = () => <span>{useSidebar().state()}</span>

const SetSidebarClosed = () => {
  const { setOpen } = useSidebar()
  return <button onClick={() => setOpen(false)}>Set closed</button>
}
