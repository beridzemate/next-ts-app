"use client"

import { useState } from "react"
import { Button, ButtonProps } from "./ui/button"
import { Copy, CopyCheck, CopyX } from "lucide-react"

type CopyState = "idle" | "copied" | "error"

interface CopyEventButtonProps
  extends Omit<ButtonProps, "children" | "onClick"> {
  eventId: string
  clerkUserId: string
  copyTimeout?: number // Optional timeout in milliseconds
}

export function CopyEventButton({
  eventId,
  clerkUserId,
  copyTimeout = 2000, // Default timeout to 2 seconds
  ...buttonProps
}: CopyEventButtonProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle")

  const CopyIcon = getCopyIcon(copyState)

  const handleCopy = async () => {
    try {
      const link = `${location.origin}/book/${clerkUserId}/${eventId}`
      await navigator.clipboard.writeText(link)
      setCopyState("copied")
    } catch (error) {
      console.error("Failed to copy link:", error)
      setCopyState("error")
    } finally {
      setTimeout(() => setCopyState("idle"), copyTimeout)
    }
  }

  return (
    <Button
      {...buttonProps}
      onClick={handleCopy}
      title={getButtonTitle(copyState)}
      className={`copy-event-button ${
        copyState === "copied" ? "bg-green-500" : ""
      } ${copyState === "error" ? "bg-red-500" : ""}`}
    >
      <span className="flex items-center">
        <CopyIcon className="size-4 mr-2" />
        <span aria-live="polite">{getChildren(copyState)}</span>
      </span>
    </Button>
  )
}

function getCopyIcon(copyState: CopyState) {
  switch (copyState) {
    case "idle":
      return Copy
    case "copied":
      return CopyCheck
    case "error":
      return CopyX
  }
}

function getChildren(copyState: CopyState) {
  switch (copyState) {
    case "idle":
      return "Copy Link"
    case "copied":
      return "Copied!"
    case "error":
      return "Error"
  }
}

function getButtonTitle(copyState: CopyState) {
  switch (copyState) {
    case "idle":
      return "Click to copy the link"
    case "copied":
      return "Link copied to clipboard"
    case "error":
      return "Failed to copy the link"
  }
}
