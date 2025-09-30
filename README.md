# Free Classroom Finder — BRAC University
<p align="center">
  <img src="https://github.com/user-attachments/assets/4b3a7f8f-c58d-47e1-9f7b-2828a993146c" alt="icon" width="256">
</p>


A small web app that shows which classrooms are free at BRAC University for a selected day and timeslot.  
Live demo: https://free-classroom.netlify.app/

This project fetches the public schedule JSON from the USIS API and computes which rooms are not occupied during a selected timeslot. FYI, it doesn’t show empty labs, as there is already another website for that made by someone else ([FREE LABS](https://random.fluidpotata.com/lab.html)). 


---

## Features

- Pick a day and a timeslot.
- See a list of all rooms that have no scheduled lecture during that slot.
- Clean, responsive UI with a centered search card and results.
- Lightweight — client-side processing of the schedule JSON for fast filtering.

---

## Data Source & Credits

This project fetches schedule data from the public USIS JSON feed:

- API: https://usis-cdn.eniamza.com/connect.json  
- Many thanks to @eniamza for providing the feed and dataset — https://github.com/eniamza


---

## Technologies

- React (components)
- Vite (dev tooling)
- CSS Modules for component styling
- No backend required for the basic app (fetches directly from the API)

---

## Quickstart — Run locally

1. Clone the repository
   ```bash
   git clone https://github.com/ayiman29/free-classroom-finder-bracu.git
   cd free-classroom-finder-bracu
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Run the dev server
   ```bash
   npm run dev
   ```

4. Open http://localhost:5173 (or the address printed by Vite)

Build for production:
```bash
npm run build
npm run preview
```


---

## Configuration & Notes

- Timeslots are canonical and listed in the UI. Internally they map to 24-hour start/end ranges but are displayed in 12-hour format for convenience.
- Labs can span multiple slots; the app can be configured to treat labs as occupying overlapping slots, or to ignore labs entirely.
- By default, FRIDAY is excluded (as requested for BRAC University scheduling).


---

## Attribution
  
- Project maintained by: [@ayiman29](https://github.com/ayiman29)
- Data & API credit: [@eniamza](https://github.com/eniamza) — https://usis-cdn.eniamza.com/connect.json
- Icon: `<img src="/icon.png" alt="Binoculars icon by riajulislam - Flaticon">`  
  Binoculars icons created by riajulislam — Flaticon  
  https://www.flaticon.com/free-icons/binoculars
  (Used under Flaticon free license — attribution required.)

---

Hope everyone can find a calm and relaxing classroom during their break time instead of roaming around the campus like a lunatic <3
