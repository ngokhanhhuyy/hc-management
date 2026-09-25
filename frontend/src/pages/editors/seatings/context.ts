import { createContext } from "react";

export type SeatingEditorPageContextPayload = {
  requestReload(): any;
};

const SeatingEditorPageContext = createContext<SeatingEditorPageContextPayload>({
  requestReload: () => { }
});

export default SeatingEditorPageContext;
