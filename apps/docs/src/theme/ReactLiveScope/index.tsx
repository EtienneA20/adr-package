import * as adrReact from "@etiennea20/adr-react";
import React from "react";

// Portée des blocs ```tsx live : React et tous les exports publics de @etiennea20/adr-react.
const ReactLiveScope = {
  React,
  ...React,
  ...adrReact,
};

export default ReactLiveScope;
