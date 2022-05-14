import { createContext } from "react"

const globalState = {
  data:  {},
  setData: () => {},
}

export const GlobalContext = createContext(globalState)