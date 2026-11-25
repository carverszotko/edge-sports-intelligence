# Free Data Sources — EDGE Sports Intelligence

Research completed November 2026. All sources below are free or free-tier. No paid services.

## Primary Source: CollegeFootballData.com (CFBD)

- **Website**: https://collegefootballdata.com
- **API docs**: https://api.collegefootballdata.com
- **What it provides**: Games, scores, team/player stats, rosters, rankings, advanced metrics (EPA, PPA, win probability), historical betting lines (~2013+), some weather.
- **Free tier**: 1,000 API calls/month (no credit card). Academic emails get 3,000.
- **Requires API key**: Yes (free). Request at https://collegefootballdata.com/key
- **Rate limits**: Monthly call quota. Prefer bulk requests.
- **Reliability**: High.
- **Usage notes**: Start here for schedules, historical games, and basic stats. Store key in environment variable.

## Odds Sources

| Source | Free Tier | Notes |
|--------|-----------|-------|
| TheRundown | 20,000 data points/day (no card) | Pre-match NCAAF lines (5-min delay) from major books |
- Free tier limitation: Last 7 days of odds only.
| The Odds API | 500 credits/month | Current moneylines, spreads, totals |

## Live Scores & Supplementary

- henrygd/ncaa-api (GitHub): Free scores, standings, rankings, schedules, box scores.
- ESPN public endpoints: Scores, standings, rosters, injuries (many no key required).
- API Ninjas: Free current-season schedules, scores, standings, rosters.

## Weather

- Open-Meteo: Free, no API key, up to 10,000 calls/day (non-commercial). Hourly + historical.

## Rules

- Free sources only until approved otherwise.
- No scraping that violates terms of service.
- API keys stored in `.env` files, never committed.
- All data clearly labeled until real data is fully validated.
