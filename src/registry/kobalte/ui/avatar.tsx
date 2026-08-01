import * as ImagePrimitive from "@kobalte/core/image"
import { splitProps } from "solid-js"

import type { PolymorphicProps } from "@kobalte/core/polymorphic"
import type { ComponentProps, ValidComponent } from "solid-js"

import { cn } from "@/registry/kobalte/lib/utils/tailwind"

type AvatarRootProps<T extends ValidComponent = "span"> =
  ImagePrimitive.ImageRootProps<T> & {
    class?: string | undefined
    size?: "sm" | "default" | "lg"
  }

const Avatar = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, AvatarRootProps<T>>
) => {
  const [local, others] = splitProps(props as AvatarRootProps, ["class", "size"])
  return (
    <ImagePrimitive.Root
      class={cn(
        "relative flex size-10 shrink-0 overflow-hidden rounded-full",
        local.class
      )}
      data-size={local.size}
      data-slot="avatar"
      {...others}
    />
  )
}

type AvatarImageProps<T extends ValidComponent = "img"> =
  ImagePrimitive.ImageImgProps<T> & {
    class?: string | undefined
  }

const AvatarImage = <T extends ValidComponent = "img">(
  props: PolymorphicProps<T, AvatarImageProps<T>>
) => {
  const [local, others] = splitProps(props as AvatarImageProps, ["class"])
  return (
    <ImagePrimitive.Img
      class={cn("aspect-square size-full", local.class)}
      data-slot="avatar-image"
      {...others}
    />
  )
}

type AvatarFallbackProps<T extends ValidComponent = "span"> =
  ImagePrimitive.ImageFallbackProps<T> & { class?: string | undefined }

const AvatarFallback = <T extends ValidComponent = "span">(
  props: PolymorphicProps<T, AvatarFallbackProps<T>>
) => {
  const [local, others] = splitProps(props as AvatarFallbackProps, ["class"])
  return (
    <ImagePrimitive.Fallback
      class={cn("flex size-full items-center justify-center bg-muted", local.class)}
      data-slot="avatar-fallback"
      {...others}
    />
  )
}

type AvatarBadgeProps = ComponentProps<"span">

function AvatarBadge(props: AvatarBadgeProps) {
  const [local, others] = splitProps(props as AvatarBadgeProps, ["class"])
  return (
    <span
      data-slot="avatar-badge"
      class={cn(
        "absolute right-0 bottom-0 z-10 z-avatar-badge inline-flex select-none items-center justify-center rounded-full bg-blend-color ring-2",
        "group-data-[size=sm]/avatar:size-2 group-data-[size=sm]/avatar:[&>svg]:hidden",
        "group-data-[size=default]/avatar:size-2.5 group-data-[size=default]/avatar:[&>svg]:size-2",
        "group-data-[size=lg]/avatar:size-3 group-data-[size=lg]/avatar:[&>svg]:size-2",
        local.class
      )}
      {...others}
    />
  )
}

type AvatarGroupProps = ComponentProps<"div">

function AvatarGroup(props: AvatarGroupProps) {
  const [local, others] = splitProps(props as AvatarGroupProps, ["class"])
  return (
    <div
      data-slot="avatar-group"
      class={cn(
        "group/avatar-group z-avatar-group flex -space-x-2 *:data-[slot=avatar]:ring-2 *:data-[slot=avatar]:ring-background",
        local.class
      )}
      {...others}
    />
  )
}

type AvatarGroupCountProps = ComponentProps<"div">

function AvatarGroupCount(props: AvatarGroupCountProps) {
  const [local, others] = splitProps(props as AvatarGroupCountProps, ["class"])
  return (
    <div
      data-slot="avatar-group-count"
      class={cn(
        "relative z-avatar-group-count flex shrink-0 items-center justify-center ring-2 ring-background",
        "",
        local.class
      )}
      {...others}
    />
  )
}

export {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage
}
