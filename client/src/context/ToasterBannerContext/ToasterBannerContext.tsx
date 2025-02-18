import { createContext } from "react";
import { ToasterBannerState, ToasterBannerAction } from "./constants";

const ToasterBannerContext = createContext<ToasterBannerState | null>(null);
const ToasterBannerDispatchContext = createContext<React.Dispatch<ToasterBannerAction> | null>(null);

export { ToasterBannerContext, ToasterBannerDispatchContext };