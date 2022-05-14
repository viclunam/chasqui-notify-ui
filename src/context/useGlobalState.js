import { useContext } from "react";
import { GlobalContext } from "./globalContext";

const useGlobalState = () => {
  const state = useContext(GlobalContext);
  return state;
};

export default useGlobalState;
