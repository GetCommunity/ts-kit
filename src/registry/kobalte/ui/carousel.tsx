import createEmblaCarousel from "embla-carousel-solid"
import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  mergeProps,
  onCleanup,
  splitProps,
  useContext
} from "solid-js"

import type { ButtonProps } from "@/registry/kobalte/ui/button"
import type { CreateEmblaCarouselType } from "embla-carousel-solid"
import type { Accessor, Component, ComponentProps, VoidProps } from "solid-js"

import { cn } from "@/lib/utils/tailwind"
import { Button } from "@/registry/kobalte/ui/button"

export type CarouselApi = CreateEmblaCarouselType[1]

type UseCarouselParameters = Parameters<typeof createEmblaCarousel>
type CarouselOptions = NonNullable<UseCarouselParameters[0]>
type CarouselPlugin = NonNullable<UseCarouselParameters[1]>

type CarouselProps = {
  opts?: ReturnType<CarouselOptions>
  plugins?: ReturnType<CarouselPlugin>
  orientation?: "horizontal" | "vertical"
  setApi?: (api: CarouselApi) => void
}

type CarouselContextProps = {
  carouselRef: ReturnType<typeof createEmblaCarousel>[0]
  api: ReturnType<typeof createEmblaCarousel>[1]
  scrollPrev: () => void
  scrollNext: () => void
  canScrollPrev: Accessor<boolean>
  canScrollNext: Accessor<boolean>
} & CarouselProps

const CarouselContext = createContext<Accessor<CarouselContextProps> | null>(null)

const useCarousel = () => {
  const context = useContext(CarouselContext)

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />")
  }

  return context()
}

const Carousel: Component<CarouselProps & ComponentProps<"div">> = (rawProps) => {
  const props = mergeProps<Array<CarouselProps & ComponentProps<"div">>>(
    { orientation: "horizontal" },
    rawProps
  )

  const [local, others] = splitProps(props, [
    "orientation",
    "opts",
    "setApi",
    "plugins",
    "class",
    "children"
  ])

  const [carouselRef, carouselApi] = createEmblaCarousel(
    () => ({
      ...local.opts,
      axis: local.orientation === "horizontal" ? "x" : "y"
    }),
    () => (local.plugins === undefined ? [] : local.plugins)
  )
  const [canScrollPrev, setCanScrollPrev] = createSignal(false)
  const [canScrollNext, setCanScrollNext] = createSignal(false)

  const onSelect = (api: NonNullable<ReturnType<CarouselApi>>) => {
    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())
  }

  const scrollPrev = () => {
    carouselApi()?.scrollPrev()
  }

  const scrollNext = () => {
    carouselApi()?.scrollNext()
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault()
      scrollPrev()
    } else if (event.key === "ArrowRight") {
      event.preventDefault()
      scrollNext()
    }
  }

  createEffect(() => {
    if (!carouselApi() || !local.setApi) {
      return
    }
    local.setApi(carouselApi)
  })

  createEffect(() => {
    if (!carouselApi()) {
      return
    }

    onSelect(carouselApi()!)
    carouselApi()!.on("reInit", onSelect)
    carouselApi()!.on("select", onSelect)

    onCleanup(() => {
      carouselApi()?.off("select", onSelect)
    })
  })

  const value = createMemo(
    () =>
      ({
        carouselRef,
        api: carouselApi,
        opts: local.opts,
        orientation: local.orientation,
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext
      }) satisfies CarouselContextProps
  )

  return (
    <CarouselContext.Provider value={value}>
      <div
        onKeyDown={handleKeyDown}
        class={cn("relative", local.class)}
        role="region"
        aria-roledescription="carousel"
        {...others}
      >
        {local.children}
      </div>
    </CarouselContext.Provider>
  )
}

const CarouselContent: Component<
  ComponentProps<"div"> & { containerClass?: string }
> = (props) => {
  const [local, others] = splitProps(props, ["class", "containerClass"])
  const api = useCarousel()

  return (
    <div ref={api.carouselRef} class={cn("overflow-hidden", local.containerClass)}>
      <div
        class={cn(
          "flex",
          api.orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          local.class
        )}
        {...others}
      />
    </div>
  )
}

const CarouselItem: Component<ComponentProps<"div">> = (props) => {
  const [local, others] = splitProps(props, ["class"])
  const api = useCarousel()

  return (
    <div
      role="group"
      aria-roledescription="slide"
      class={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        api.orientation === "horizontal" ? "pl-4" : "pt-4",
        local.class
      )}
      {...others}
    />
  )
}

type CarouselButtonProps = VoidProps<ButtonProps>

const CarouselPrevious: Component<CarouselButtonProps> = (rawProps) => {
  const props = mergeProps<Array<CarouselButtonProps>>(
    { variant: "link", size: "icon" },
    rawProps
  )
  const [local, others] = splitProps(props, ["class", "variant", "size"])
  const api = useCarousel()

  return (
    <Button
      variant={local.variant}
      size={local.size}
      class={cn(
        "absolute size-8 touch-manipulation rounded-full",
        api.orientation === "horizontal"
          ? "-left-12 top-1/2 -translate-y-1/2"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        local.class
      )}
      disabled={!api.canScrollPrev()}
      onClick={api.scrollPrev}
      {...others}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4"
      >
        <path d="M5 12l14 0" />
        <path d="M5 12l6 6" />
        <path d="M5 12l6 -6" />
      </svg>
      <span class="sr-only">Previous slide</span>
    </Button>
  )
}

const CarouselNext: Component<CarouselButtonProps> = (rawProps) => {
  const props = mergeProps<Array<CarouselButtonProps>>(
    { variant: "link", size: "icon" },
    rawProps
  )
  const [local, others] = splitProps(props, ["class", "variant", "size"])
  const api = useCarousel()

  return (
    <Button
      variant={local.variant}
      size={local.size}
      class={cn(
        "absolute size-8 touch-manipulation rounded-full",
        api.orientation === "horizontal"
          ? "-right-12 top-1/2 -translate-y-1/2"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        local.class
      )}
      disabled={!api.canScrollNext()}
      onClick={api.scrollNext}
      {...others}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        class="size-4"
      >
        <path d="M5 12l14 0" />
        <path d="M13 18l6 -6" />
        <path d="M13 6l6 6" />
      </svg>
      <span class="sr-only">Next slide</span>
    </Button>
  )
}

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselOptions
}
