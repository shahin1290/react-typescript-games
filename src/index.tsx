import ReactDOM from "react-dom/client";
import { Scoreboard } from "./components/Scoreboard";
import { Top } from "./components/Top";

import "./index.scss";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <>
    <Top feature="Flag" firstAction="ctrl" secondAction="click">
      Minesweeper
    </Top>
    <Scoreboard
      time="000"
      levels={["beginner", "intermediate", "expert"]}
      mines="010"
      onReset={() => null}
    />
  </>
);
