import index from "./pages/index.html";

Bun.serve({
    port: 3000,
    routes: {
        "/": index,
    }
})