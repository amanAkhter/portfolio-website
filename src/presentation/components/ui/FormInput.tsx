import * as React from "react"
import { cn } from "../../../shared/utils/helpers"

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, type, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-tokyo-fg mb-2">
            {label}
          </label>
        )}
        <input
          type={type}
          className={cn(
            "flex h-10 w-full rounded-md border border-tokyo-black bg-tokyo-bg-dark px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-tokyo-comment focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tokyo-blue focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-tokyo-red focus-visible:ring-tokyo-red",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="text-sm text-tokyo-red mt-1">{error}</p>
        )}
      </div>
    )
  }
)
FormInput.displayName = "FormInput"

export { FormInput }
