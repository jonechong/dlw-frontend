# DLW-Frontend

**DLW-Frontend** is the React-based user interface for the **DLW project**. This application allows users to **record and track their daily food intake, view nutritional analytics, and receive personalized recommendations** from the backend. The frontend interacts with the FastAPI backend:  
🔗 **[DLW-Backend](https://github.com/jonechong/dlw-backend)**

Although most core functionality is complete, an **analytics page**—designed to analyze user behavior (e.g., identifying days with consistent overeating) and optimize recommendations based on schedules—**is currently incomplete due to time constraints**.

---

## Overview

### **Food Tracking:**
- Users can **add food items** (either via image upload or manual input) to record their daily intake.
- Nutritional information is fetched automatically through the **FastAPI backend**.

### **Personalized Recommendations:**
- The app integrates with the backend to **display tailored food recommendations** based on daily intake and user profile.
- Includes **key nutritional summaries** to help users make informed dietary choices.
- Takes into account **user profile information**, including:
  - **Height, age, and weight**.
  - **Automatic BMR calculation**.
  - **Daily energy expenditure estimation** (based on step count and activity level).
  - **Target calorie deficit** (if specified by the user), allowing selection from **four weight loss targets** (0.25 to 1 kg per week, in 0.25 kg increments). Constraints are applied to **prevent unhealthy weight loss plans**.
  - **Medical conditions** (e.g., high cholesterol, dietary restrictions) that affect recommendations.

### **Analytics (Incomplete):**
- Due to time constraints, the **analytics page remains incomplete** and will not be finished before the deadline.
- The analytics page is intended to **provide optimized recommendations** based on user behavior and schedules.
- The app will analyze user behavior, such as identifying **days with consistent overeating** (e.g., **every Tuesday**) and suggest modifications to balance out these habits.
- Recommendations may include **lighter meals, smaller portions, or meal adjustments** to promote balanced dietary habits over time.

---

## Prerequisites

Ensure you have the following installed:

- **Node.js (v12 or higher)**
- **npm** (Node Package Manager)

---

## Setup

### Clone the Repository:

```bash
git clone https://github.com/jonechong/dlw-frontend.git
cd dlw-frontend
```

### Install Dependencies:

```bash
npm install
```

This project uses **Material-UI** for styling and UI components.

---

## Running the Application

Start the React development server on the default port (**3000**) by running:

```bash
npm start
```

This command **launches the application in your default browser**. The frontend interacts with the **FastAPI backend** (which should be running on **port 8000**) for all API calls.

---

## Project Structure

```bash
├── public                  # Static assets and index.html
├── src
│   ├── components          # Reusable React components (e.g., FoodItem, RecommendationList)
│   ├── contexts            # Context providers (e.g., ProfileContext, FoodRecordsContext)
│   ├── pages
│   │   ├── MainPage.js     # Main food tracking and recommendation page
│   │   └── Analytics.js    # Incomplete analytics page (future work)
│   ├── App.js              # Root component setting up routing and context providers
│   └── index.js            # Application entry point
├── package.json            # Frontend dependencies and scripts
└── README.md               # This documentation file
```

---

## Notes

- **Ensure the FastAPI backend is running on port 8000** before starting the frontend.
- **The analytics page is currently incomplete** due to lack of time before the deadline.
- **Material-UI** is used for styling and UI components.

---

