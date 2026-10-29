
const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.API_FOOTBALL_KEY;

app.use(express.static(path.join(__dirname, "public")));

app.get("/api/fixtures", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({
        error: "API_FOOTBALL_KEY is not configured on the server"
      });
    }

    const params = new URLSearchParams();
    ["league", "date", "season", "team", "live"].forEach((key) => {
      if (req.query[key]) params.set(key, req.query[key]);
    });

    const response = await fetch(
      `https://v3.football.api-sports.io/fixtures?${params.toString()}`,
      { headers: { "x-apisports-key": API_KEY } }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch fixtures" });
  }
});

app.get("/api/standings", async (req, res) => {
  try {
    if (!API_KEY) {
      return res.status(500).json({
        error: "API_FOOTBALL_KEY is not configured on the server"
      });
    }

    const params = new URLSearchParams();
    ["league", "season"].forEach((key) => {
      if (req.query[key]) params.set(key, req.query[key]);
    });

    const response = await fetch(
      `https://v3.football.api-sports.io/standings?${params.toString()}`,
      { headers: { "x-apisports-key": API_KEY } }
    );

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    res.status(500).json({ error: "Could not fetch standings" });
  }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`GoalZone server running on port ${PORT}`);
});
