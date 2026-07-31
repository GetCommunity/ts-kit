import {
  createContext,
  createSignal,
  mergeProps,
  onCleanup,
  onMount,
  splitProps,
  useContext
} from "solid-js"

import type { Accessor, ComponentProps, JSX } from "solid-js"

import { cn } from "@/lib/utils/tailwind"

type ScrollAreaContextValue = {
  viewportRef: Accessor<HTMLDivElement | undefined>
  hovered: Accessor<boolean>
}

const ScrollAreaContext = createContext<ScrollAreaContextValue | null>(null)

const useScrollArea = () => {
  const context = useContext(ScrollAreaContext)
  if (!context) {
    throw new Error("useScrollArea must be used within a <ScrollArea />")
  }
  return context
}

type ScrollAreaProps = ComponentProps<"div"> & {
  children?: JSX.Element
}

const ScrollArea = (props: ScrollAreaProps) => {
  const [local, others] = splitProps(props, [
    "class",
    "children",
    "onMouseEnter",
    "onMouseLeave"
  ])

  let viewportRef: HTMLDivElement | undefined
  const [hovered, setHovered] = createSignal(false)

  return (
    <ScrollAreaContext.Provider
      value={{
        viewportRef: () => viewportRef,
        hovered
      }}
    >
      <div
        class={cn("relative overflow-clip", local.class)}
        data-slot="scroll-area"
        onMouseEnter={(e) => {
          setHovered(true)
          if (typeof local.onMouseEnter === "function") local.onMouseEnter(e)
        }}
        onMouseLeave={(e) => {
          setHovered(false)
          if (typeof local.onMouseLeave === "function") local.onMouseLeave(e)
        }}
        {...others}
      >
        <div
          class="size-full overflow-auto rounded-[inherit] outline-none transition-[color,box-shadow] [-ms-overflow-style:none] scrollbar-none focus-visible:outline-1 focus-visible:ring-[3px] focus-visible:ring-ring/50 [&::-webkit-scrollbar]:hidden"
          data-slot="scroll-area-viewport"
          ref={(element) => {
            viewportRef = element
          }}
        >
          {local.children}
        </div>
        <ScrollBar />
        <div data-slot="scroll-area-corner" />
      </div>
    </ScrollAreaContext.Provider>
  )
}

type ScrollBarProps = ComponentProps<"div"> & {
  orientation?: "vertical" | "horizontal"
}

const ScrollBar = (rawProps: ScrollBarProps) => {
  const props = mergeProps({ orientation: "vertical" as const }, rawProps)
  const [local, others] = splitProps(props, ["class", "orientation"])

  const context = useScrollArea()
  const [thumbSize, setThumbSize] = createSignal(0)
  const [thumbPosition, setThumbPosition] = createSignal(0)
  const [isDragging, setIsDragging] = createSignal(false)
  const [dragOffset, setDragOffset] = createSignal(0)
  const [visible, setVisible] = createSignal(false)

  let scrollbarRef: HTMLDivElement | undefined
  let thumbRef: HTMLDivElement | undefined

  const isVertical = () => local.orientation === "vertical"

  const updateScrollbar = () => {
    const viewport = context.viewportRef()!

    if (isVertical()) {
      const ratio = viewport.clientHeight / viewport.scrollHeight
      const size = Math.max(ratio * 100, 10)
      setThumbSize(size)
      setVisible(ratio < 1)

      const maxScrollTop = viewport.scrollHeight - viewport.clientHeight
      const scrollRatio = maxScrollTop > 0 ? viewport.scrollTop / maxScrollTop : 0
      const maxThumbPosition = 100 - size
      setThumbPosition(Math.min(scrollRatio * maxThumbPosition, maxThumbPosition))
    } else {
      const ratio = viewport.clientWidth / viewport.scrollWidth
      const size = Math.max(ratio * 100, 10)
      setThumbSize(size)
      setVisible(ratio < 1)

      const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth
      const scrollRatio = maxScrollLeft > 0 ? viewport.scrollLeft / maxScrollLeft : 0
      const maxThumbPosition = 100 - size
      setThumbPosition(Math.min(scrollRatio * maxThumbPosition, maxThumbPosition))
    }
  }

  const handleScroll = () => {
    if (!isDragging()) {
      updateScrollbar()
    }
  }

  const handleThumbMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)

    const thumbRect = thumbRef!.getBoundingClientRect()
    if (isVertical()) {
      setDragOffset(e.clientY - thumbRect.top)
    } else {
      setDragOffset(e.clientX - thumbRect.left)
    }
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging()) return
    e.preventDefault()

    const viewport = context.viewportRef()!

    if (isVertical()) {
      const scrollbarRect = scrollbarRef!.getBoundingClientRect()
      const scrollbarHeight = scrollbarRect.height
      const maxScrollTop = viewport.scrollHeight - viewport.clientHeight

      if (maxScrollTop <= 0) return

      const mousePositionInTrack = e.clientY - scrollbarRect.top - dragOffset()

      const ratio = viewport.clientHeight / viewport.scrollHeight
      const computedThumbSize = Math.max(ratio * 100, 10)
      const maxThumbPosition = 100 - computedThumbSize

      const thumbPositionPercent = Math.max(
        0,
        Math.min((mousePositionInTrack / scrollbarHeight) * 100, maxThumbPosition)
      )

      const scrollRatio = thumbPositionPercent / maxThumbPosition
      const newScrollTop = scrollRatio * maxScrollTop

      viewport.scrollTop = newScrollTop
      setThumbPosition(thumbPositionPercent)
    } else {
      const scrollbarRect = scrollbarRef!.getBoundingClientRect()
      const scrollbarWidth = scrollbarRect.width
      const maxScrollLeft = viewport.scrollWidth - viewport.clientWidth

      if (maxScrollLeft <= 0) return

      const mousePositionInTrack = e.clientX - scrollbarRect.left - dragOffset()

      const ratio = viewport.clientWidth / viewport.scrollWidth
      const computedThumbSize = Math.max(ratio * 100, 10)
      const maxThumbPosition = 100 - computedThumbSize

      const thumbPositionPercent = Math.max(
        0,
        Math.min((mousePositionInTrack / scrollbarWidth) * 100, maxThumbPosition)
      )

      const scrollRatio = thumbPositionPercent / maxThumbPosition
      const newScrollLeft = scrollRatio * maxScrollLeft

      viewport.scrollLeft = newScrollLeft
      setThumbPosition(thumbPositionPercent)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTrackClick = (e: MouseEvent) => {
    const viewport = context.viewportRef()!

    const rect = scrollbarRef!.getBoundingClientRect()
    const thumbRect = thumbRef!.getBoundingClientRect()

    if (isVertical()) {
      const clickY = e.clientY - rect.top
      const thumbY = thumbRect.top - rect.top
      const thumbHeight = thumbRect.height

      if (clickY < thumbY) {
        viewport.scrollTop -= viewport.clientHeight
      } else if (clickY > thumbY + thumbHeight) {
        viewport.scrollTop += viewport.clientHeight
      }
    } else {
      const clickX = e.clientX - rect.left
      const thumbX = thumbRect.left - rect.left
      const thumbWidth = thumbRect.width

      if (clickX < thumbX) {
        viewport.scrollLeft -= viewport.clientWidth
      } else if (clickX > thumbX + thumbWidth) {
        viewport.scrollLeft += viewport.clientWidth
      }
    }
  }

  onMount(() => {
    const viewport = context.viewportRef()!

    updateScrollbar()

    viewport.addEventListener("scroll", handleScroll)

    const resizeObserver = new ResizeObserver(() => {
      updateScrollbar()
    })

    resizeObserver.observe(viewport)

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    onCleanup(() => {
      viewport.removeEventListener("scroll", handleScroll)
      resizeObserver.disconnect()
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    })
  })

  const shown = () => visible() && (context.hovered() || isDragging())

  return (
    <div
      class={cn(
        "absolute z-scroll-area-scrollbar flex touch-none select-none p-px transition-opacity duration-150",
        {
          "top-0 right-0": isVertical(),
          "bottom-0 left-0 w-full": !isVertical(),
          "pointer-events-none opacity-0": !shown()
        },
        local.class
      )}
      data-orientation={local.orientation}
      data-horizontal={!isVertical()}
      data-vertical={isVertical()}
      data-slot="scroll-area-scrollbar"
      onClick={handleTrackClick}
      ref={(element) => {
        scrollbarRef = element
      }}
      {...others}
    >
      <div
        class="relative z-scroll-area-thumb flex-1 cursor-grab bg-border active:cursor-grabbing"
        data-slot="scroll-area-thumb"
        onMouseDown={handleThumbMouseDown}
        ref={(element) => {
          thumbRef = element
        }}
        style={{
          ...(isVertical()
            ? {
                position: "absolute",
                top:
                  thumbPosition() === 0
                    ? `calc(${thumbPosition()}% + 1px)`
                    : `calc(${thumbPosition()}% - 1px)`,
                height: `${thumbSize()}%`,
                left: "1px",
                right: "1px"
              }
            : {
                position: "absolute",
                left:
                  thumbPosition() === 0
                    ? `calc(${thumbPosition()}% + 1px)`
                    : `calc(${thumbPosition()}% - 1px)`,
                width: `${thumbSize()}%`,
                top: "1px",
                bottom: "1px"
              })
        }}
      />
    </div>
  )
}

export { ScrollArea, ScrollBar }
