import { Hono } from "hono";
import qrcode from "qrcode-generator";

const app = new Hono<{ Bindings: Env }>();

app.get("/api/", (c) => c.json({ name: "Cloudflare" }));

app.get("/api/status", (c) => c.json("OK", 200));

app.get("/api/qrcode", async (c) => {
    const text = c.req.query("text");
    if (!text) {
        return c.json({ error: "Missing text parameter" }, 400);
    }

    try {
        const typeNumber = 0; // auto
        const errorCorrectionLevel = "L";
        const qr = qrcode(typeNumber, errorCorrectionLevel);
        qr.addData(text);
        qr.make();

        // createSvgTag returns a string like <svg ...>...</svg>
        const svg = qr.createSvgTag({ margin: 4, cellSize: 4 });

        return c.body(svg, 200, {
            "Content-Type": "image/svg+xml",
        });
    } catch (err) {
        console.error("QR Generation Error:", err);
        return c.json({ error: "Failed to generate QR code" }, 500);
    }
});

export default app;
