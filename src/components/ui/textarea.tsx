import * as React from "react"
import cn from "../lib/utils"


export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean // Visually indicate an error state
  label?: string // Optional label text
  labelClassName?: string // Custom class for the label
  description?: string // Additional description for the textarea
  descriptionClassName?: string // Custom class for the description
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    { className, error, label, labelClassName, description, descriptionClassName, id, ...props },
    ref
  ) => {
    const textareaId = id || React.useId()

    return (
      <div>
        {label && (
          <label
            htmlFor={textareaId}
            className={cn("block mb-1 text-sm font-medium text-foreground", labelClassName)}
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          ref={ref}
          aria-invalid={error ? "true" : undefined}
          aria-describedby={description ? `${textareaId}-description` : undefined}
          className={cn(
            "flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus-visible:ring-red-500",
            className
          )}
          {...props}
        />
        {description && (
          <p
            id={`${textareaId}-description`}
            className={cn("mt-1 text-sm text-muted-foreground", descriptionClassName)}
          >
            {description}
          </p>
        )}
      </div>
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
