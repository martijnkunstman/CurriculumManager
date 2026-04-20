# Curriculum Manager - KA Dashboard

A complete, self-contained Node.js web application built to visualize and manage the `ka_` (planning & calendar) data from the `curriculum_manager` database. 

## Features
- **Express Backend:** Automatically serves interactive API endpoints for Reading, Creating, Updating, and Deleting planning structures.
- **Embedded Database:** No external SQL installation required! Data translates seamlessly to a `database.sqlite` instance.
- **Premium Glassmorphic Dashboard:** Built with vanilla HTML/CSS/JS, featuring modern responsive UI elements and an animated modal experience.

## Installation & Setup

1. **Install Dependencies**
   Ensure you have [Node.js](https://nodejs.org) installed. Run the following command in the project directory:
   ```bash
   npm install
   ```

2. **Initialize the Database**
   The project includes an `init_db.js` helper. It automatically reads the SQL dump (`sql/curriculum_manager.sql`), safely extracts all relevant `ka_` table definitions, converts them, and constructs an offline SQLite dataset.
   
   Run:
   ```bash
   node init_db.js
   ```
   *(This will create a `database.sqlite` file in the root folder.)*

3. **Start the Web Server**
   Start your Express local backend:
   ```bash
   node server.js
   ```

4. **Experience the Dashboard**
   Navigate to [http://localhost:3000](http://localhost:3000) in your favorite web browser to manage your data!

## Application Structure
- `init_db.js`: Script for SQL -> SQLite conversion parsing.
- `server.js`: The Express API and server configuration.
- `public/`: The entire frontend application and assets.
   - `index.html`: Views structure and layout bindings.
   - `css/style.css`: Themed styling and component definitions.
   - `js/app.js`: Connects your interactive inputs dynamically to the backend API.
