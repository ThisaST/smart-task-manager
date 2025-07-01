import * as React from "react"
import { Check } from "lucide-react"

import { cn } from "@/utils/utils"

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  indeterminate?: boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, indeterminate = false, checked, ...props }, ref) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null)
    
    React.useImperativeHandle(ref, () => checkboxRef.current!)
    
    React.useEffect(() => {
      if (checkboxRef.current) {
        checkboxRef.current.indeterminate = indeterminate
      }
    }, [indeterminate])

    return (
      <div className="relative inline-flex items-center">
        <input
          type="checkbox"
          className="sr-only"
          ref={checkboxRef}
          checked={checked}
          {...props}
        />
        <div
          className={cn(
            "flex h-4 w-4 shrink-0 rounded-sm border border-border shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring transition-all",
            checked || indeterminate
              ? "bg-primary border-primary text-primary-foreground"
              : "bg-background hover:border-accent-foreground/20",
            props.disabled && "cursor-not-allowed opacity-50",
            className
          )}
          onClick={() => checkboxRef.current?.click()}
        >
          {(checked || indeterminate) && (
            <Check className="h-3 w-3 m-auto text-current" />
          )}
        </div>
      </div>
    )
  }
)

Checkbox.displayName = "Checkbox"

export { Checkbox } 