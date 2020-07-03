import { useState } from 'react';

function useToggleList<T>(initArray: T[] = []) {
  const [list, setList] = useState<T[]>(initArray);

  const toggle = (item: T) => {
    if (list.indexOf(item) > -1) {
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  return {
    list,
    toggle
  };
}

export default useToggleList;
