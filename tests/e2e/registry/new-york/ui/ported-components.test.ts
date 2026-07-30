import { AlertDialog } from "@/registry/new-york/ui/alert-dialog"
import { AspectRatio } from "@/registry/new-york/ui/aspect-ratio"
import { ButtonGroup } from "@/registry/new-york/ui/button-group"
import { Calendar } from "@/registry/new-york/ui/calendar"
import { ChartContainer } from "@/registry/new-york/ui/chart"
import { Command } from "@/registry/new-york/ui/command"
import { ContextMenu } from "@/registry/new-york/ui/context-menu"
import { Empty } from "@/registry/new-york/ui/empty"
import { Field } from "@/registry/new-york/ui/field"
import { HoverCard } from "@/registry/new-york/ui/hover-card"
import { Input } from "@/registry/new-york/ui/input"
import { InputGroup } from "@/registry/new-york/ui/input-group"
import { InputOTP } from "@/registry/new-york/ui/input-otp"
import { Item } from "@/registry/new-york/ui/item"
import { Kbd } from "@/registry/new-york/ui/kbd"
import { NativeSelect } from "@/registry/new-york/ui/native-select"
import { NavigationMenu } from "@/registry/new-york/ui/navigation-menu"
import { ResizablePanelGroup } from "@/registry/new-york/ui/resizable"
import { ScrollArea } from "@/registry/new-york/ui/scroll-area"
import { Sheet } from "@/registry/new-york/ui/sheet"
import { Sidebar } from "@/registry/new-york/ui/sidebar"
import { Skeleton } from "@/registry/new-york/ui/skeleton"
import { Toaster } from "@/registry/new-york/ui/sonner"
import { Spinner } from "@/registry/new-york/ui/spinner"
import { Textarea } from "@/registry/new-york/ui/textarea"
import { Toggle } from "@/registry/new-york/ui/toggle"
import { ToggleGroup } from "@/registry/new-york/ui/toggle-group"

const portedComponents = {
  AlertDialog,
  AspectRatio,
  ButtonGroup,
  Calendar,
  ChartContainer,
  Command,
  ContextMenu,
  Empty,
  Field,
  HoverCard,
  Input,
  InputGroup,
  InputOTP,
  Item,
  Kbd,
  NativeSelect,
  NavigationMenu,
  ResizablePanelGroup,
  ScrollArea,
  Sheet,
  Sidebar,
  Skeleton,
  Toaster,
  Spinner,
  Textarea,
  Toggle,
  ToggleGroup
}

describe("ported Zaidan UI components", () => {
  it.each(Object.entries(portedComponents))(
    "exports the %s component",
    (_name, component) => {
      expect(component).toBeTypeOf("function")
    }
  )
})
