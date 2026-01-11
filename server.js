const express = require("express");
const fs = require("fs");
const app = express();

app.use(express.json());

const DB = "./keys.json";
const ADMIN_SECRET = "DRT_ADMIN_2026";

app.post("/admin/create-key", (req, res) => {
  if (req.body.secret !== ADMIN_SECRET)
    return res.json({ ok: false });

  const key = "DRT-" + Math.random().toString(36).slice(2,10).toUpperCase();

  const data = JSON.parse(fs.readFileSync(DB));
  data.push({
    key,
    days: req.body.days,
    activated: false,
    device: null,
    start: null
  });

  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
  res.json({ ok: true, key });
});

app.post("/check-key", (req, res) => {
  const data = JSON.parse(fs.readFileSync(DB));
  const lic = data.find(x => x.key === req.body.key);
  if (!lic) return res.json({ ok: false });

  if (!lic.activated) {
    lic.activated = true;
    lic.device = req.body.device;
    lic.start = Date.now();
  }

  if (lic.device !== req.body.device)
    return res.json({ ok: false });

  fs.writeFileSync(DB, JSON.stringify(data, null, 2));
  res.json({ ok: true });
});

app.listen(process.env.PORT || 3000);
