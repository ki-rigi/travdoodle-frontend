# Travdoodle Frontend

**Deployed Site:** [Travdoodle Frontend on Netlify](https://travdoodle.netlify.app/)

## Overview
The **Travdoodle** is a React-based web application designed to provide an intuitive interface for planning and managing travel itineraries. Users can sign up, log in, and create customized itineraries with destinations, accommodations, activities, and packing lists.

## Features
- User authentication (Login, Sign-up, Session Management)
- Dashboard for managing itineraries
- Create, edit, and delete itineraries
- View and manage destinations within an itinerary
- Responsive design for mobile and desktop
- React Router for seamless navigation

## Tech Stack
- **Frontend:** React, React Router
- **State Management:** Zustand
- **Styling:** Default CSS Modules
- **Icons:** React Icons
- **Form Handling & Validation:** Formik & Yup
- **API Communication:** Fetch API
- **Development Tools:** Vite, ESLint
- **Deployment:** Netlify

## Setup & Installation
### Prerequisites
Ensure you have the following installed:
- Node.js & npm
- Git

### Installation Steps
1. Clone the repository:
   ```sh
   git clone <repository-url>
   cd travdoodle-frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

## Deployment
To deploy the frontend on Netlify:
1. Push your repository to GitHub.
2. Create a new project on Netlify and link the GitHub repository.
3. Configure the build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Deploy the site.

