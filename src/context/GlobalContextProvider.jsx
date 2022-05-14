import { useState } from "react";
import { GlobalContext } from "./globalContext";

const GlobalContextProvider = ({ children }) => {
  const [globalState, setGlobalState] = useState({
    arduino: null,
  });

  return (
    <GlobalContext.Provider
      value={{
        data: globalState,
        setData: setGlobalState,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
