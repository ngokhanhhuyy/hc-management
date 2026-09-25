import { createContext } from "react";

export type EditorPageContextPayload = {
  requestReload(): any;
};

const EditorPageContext = createContext<EditorPageContextPayload>({
  requestReload: () => { }
});

export default EditorPageContext;
