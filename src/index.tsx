import ReactDOM from "react-dom/client";
import "./index.scss";
import { GameWithHooks } from "./modules/GameWithHooks";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(<GameWithHooks />);
