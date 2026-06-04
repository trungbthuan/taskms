import app from "./src/app.js";

const PORT = process.env.PORT || 3000;

// ── Start server ────────────────────────────
// Cho phép LAN truy cập
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Local:   http://localhost:${PORT}`);
    console.log(`Network: http://10.176.104.11:${PORT}`); // thay IP thật
});
