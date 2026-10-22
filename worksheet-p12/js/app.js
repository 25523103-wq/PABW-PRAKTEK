import { state, muatBerita } from "./state.js";
import { render } from "./dom.js";
import { pasangPendengar } from "./events.js";

render(state);
pasangPendengar();
muatBerita();