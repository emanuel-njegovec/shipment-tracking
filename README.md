**Simple frontend user interface for tracking shipments.**
Made for HT internship application.
It allows the user to create new shipments and their orders, as well as editing existing shipments. Additionally it provides a filtering feature for finding entires based on customer ID, order ID and order status.
Features which are currently not implemented but would greatly improve the usability: deleting entire shipments, deleting individual orders, expanded search/filter, customizability of data displayed in the table.

How to run:
  - clone this git repo using `git clone https://github.com/emanuel-njegovec/shipment-tracking.git`
  - open two terminals
    - in one terminal position into the /api-server folder
    - the other terminal position into the /frontend/shipment-tracking folder
    - run `npm install` in both terminals
  - after installation is finished run:
    - `node app.js` in the api-server terminal
    - `npm start dev` in the frontend terminal
  - navigate to [http://localhost:3000](http://localhost:3000) in the browser
