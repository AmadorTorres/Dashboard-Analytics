# Getting Started with Analytics Dashboard

This project was bootstrapped with Create React App.

For this project, you will need to install VS Code. Docker is not required to be installed, but it would make it easier to start the project.

## How to get Analytics Dashboard started locally

Run npm install after cloning to ensure all required dependencies are installed. If running the project locally, you will have to navigate to the backend folder in the terminal and run "node server.js". You should see "Server running on port 5001" and "MongoDB connected" in the terminal. Once the backend is running, navigate to the frontend folder and run "npm run start" in the terminal to launch the Analytics Dashboard.

This project uses React for the frontend, Express.js for the backend, and MongoDB for the database (for ease of setup in Docker).

### ` How to get Analytics Dashboard started Docker`

With Docker, all you need to do is run docker-compose up --build in the main terminal of the project. With Docker open, the project will build. Once it builds, you can access the project by clicking on port 3000:80, which will automatically open the project running both the frontend and backend.

### `How it works`

The visitor ID is unique, and every time there is a new unrecognized visitor ID, it will increase the count of "Unique Visitors". Every time the dashboard is reloaded, the "Total Page Views" will increment by one. "Average Time Spent on Page" represents the average duration visitors spend on the dashboard.

Under "Visitor Details", more information is displayed, such as the duration a visitor spent on the dashboard, along with their visit time, browser, device, and location (you can use a VPN to display a different location). The IP address shown is based on data from "https://ipapi.co/json/", providing broad location information. The graph updates simultaneously as visitor details are refreshed.

