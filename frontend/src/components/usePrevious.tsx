import { useRef, useEffect } from "react";

/**
 * Custom hook to track if form data has been changed.
 * From <https://blog.logrocket.com/accessing-previous-props-state-react-hooks/>
 *
 *
 */
function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value; //assign the value of ref to the argument
  }, [value]); //this code will run when the value of 'value' changes
  console.log("ref.current: ", ref.current);
  return ref.current; //in the end, return the current ref value.
}

export default usePrevious;
