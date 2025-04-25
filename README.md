# Neighbourhood Crime Finder

This is a Rich Web Application built using React. It allows users to search for recent or historical crime reports near a specified UK postcode.

## Features
- Input any valid UK postcode.
- Optional selection of year and month for historical searches.
- Displays up to 20 nearby crimes including:
  - Crime category
  - Street location
  - Month of report
  - Outcome status (if available)

## Technologies
- [Vite](https://vitejs.dev/) + [React](https://react.dev/)
- [Postcodes.io API](https://postcodes.io/)
- [UK Police Data API](https://data.police.uk/docs/)

## How It Works
1. User inputs a postcode.
2. The app uses Postcodes.io to find the location.
3. The app queries the Police API, optionally filtering by selected month/year.
4. Results are displayed dynamically.

## Installation
```bash
npm install
npm run dev

navigate to http://localhost:5173 in your browser.
