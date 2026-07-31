import { render, screen } from "@solidjs/testing-library"

import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/registry/kobalte/ui/drawer"

describe("Drawer", () => {
  it("renders trigger and open drawer content", () => {
    render(() => (
      <Drawer open>
        <DrawerTrigger>Open drawer</DrawerTrigger>
        <DrawerContent class="custom-drawer">
          <DrawerHeader>
            <DrawerTitle>Drawer title</DrawerTitle>
            <DrawerDescription>Drawer description</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>Drawer footer</DrawerFooter>
        </DrawerContent>
      </Drawer>
    ))

    expect(screen.getByText("Open drawer")).toBeInTheDocument()
    expect(screen.getByText("Drawer title")).toHaveClass("text-lg")
    expect(screen.getByText("Drawer description")).toHaveClass("text-muted-foreground")
    expect(screen.getByText("Drawer footer")).toHaveClass("flex")
  })
})
