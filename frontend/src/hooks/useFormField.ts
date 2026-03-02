import { useCallback, useState } from "react";

/**
 * Reusable form hook for managing a single input field.
 * Keeps input state logic out of components.
 */
export default function useFormField(initialValue = "") {
  const [value, setValue] = useState(initialValue);

  // Updates the field value (used in input onChange)
  const onChange = useCallback((nextValue: string) => {
    setValue(nextValue);
  }, []);

  // Resets field back to its original value
  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Returns helpers used by form components
  return { value, setValue, onChange, reset };
}