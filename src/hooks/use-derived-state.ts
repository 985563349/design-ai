import { useEffect, useRef, useState } from 'react';
import type { DependencyList, Dispatch, SetStateAction } from 'react';

export default function useDerivedState<S>(compute: () => S, deps: DependencyList): [S, Dispatch<SetStateAction<S>>] {
  const computeRef = useRef(compute);
  const isFirstRender = useRef(true);

  const [state, setState] = useState(computeRef.current);

  useEffect(() => {
    computeRef.current = compute;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setState(computeRef.current());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return [state, setState];
}
