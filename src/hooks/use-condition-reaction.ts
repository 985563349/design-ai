import { useEffect, useRef } from 'react';

export default function useConditionReaction(onTrue: () => void, onFalse: () => void, condition: boolean) {
  const onTrueRef = useRef(onTrue);
  onTrueRef.current = onTrue;

  const onFalseRef = useRef(onFalse);
  onFalseRef.current = onFalse;

  useEffect(() => {
    if (condition) {
      onTrueRef.current();
    } else {
      onFalseRef.current();
    }
  }, [condition]);
}
