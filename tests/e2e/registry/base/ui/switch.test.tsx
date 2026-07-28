import { render, screen } from "@solidjs/testing-library"

import {
  Switch,
  SwitchControl,
  SwitchLabel,
  SwitchThumb
} from "@/registry/base/ui/switch"

describe("Switch", () => {
  it("renders switch control, thumb, and label", () => {
    render(() => (
      <Switch checked>
        <SwitchControl label="Notifications" class="custom-switch">
          <SwitchThumb />
        </SwitchControl>
        <SwitchLabel>Notifications</SwitchLabel>
      </Switch>
    ))

    expect(screen.getByRole("switch")).toBeChecked()
    expect(screen.getByText("Notifications")).toHaveClass("text-sm")
    expect(screen.getByRole("switch").nextElementSibling).toHaveClass("custom-switch")
  })
})
