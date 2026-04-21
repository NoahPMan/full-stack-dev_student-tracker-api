import { useCallback, useState } from 'react';

export default function useFormField(initialValue = '') {
  const [value, setValue] = useState(initialValue);

  const onChange = useCallback((nextValue: string) => {
    setValue(nextValue);
  }, []);

  const reset = useCallback(() => {
    setValue(initialValue);
  }, [initialValue]);

  return { value, setValue, onChange, reset };
}