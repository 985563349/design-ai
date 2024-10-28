import { useEffect, useRef } from 'react';

export default function useConditionReaction(truthy: () => void, falsy: () => void, condition: boolean) {
  const truthyRef = useRef(truthy);
  truthyRef.current = truthy;

  const falsyRef = useRef(falsy);
  falsyRef.current = falsy;

  useEffect(() => {
    if (condition) {
      truthyRef.current();
    } else {
      falsyRef.current();
    }
  }, [condition]);
}
