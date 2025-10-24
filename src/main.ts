import index from "./pages/index.html";
import emulator from "./pages/emulator.html";

Bun.serve({
    port: 3000,
    routes: {
        "/emulator": emulator,
        "/": index,
    }
})