import React from "react";
import TopNavbar from "./components/navbars/TopNavbar";
import BottomNavbar from "./components/navbars/BottomNavbar";
import MainPage from "./pages/MainPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import ProfilePage from "./pages/ProfilePage";
import { Box } from "@mui/material";
import { ProfileProvider } from "./contexts/ProfileContext";
import { FoodRecordsProvider } from "./contexts/FoodRecordsContext";

function App() {
    const [currentPage, setCurrentPage] = React.useState("main");

    const handleProfileClick = () => {
        setCurrentPage("profile");
    };

    const handleNavChange = (value) => {
        setCurrentPage(value === 0 ? "main" : "analytics");
    };

    const renderPage = () => {
        switch (currentPage) {
            case "main":
                return <MainPage />;
            case "analytics":
                return <AnalyticsPage />;
            case "profile":
                return <ProfilePage />;
            default:
                return <MainPage />;
        }
    };

    return (
        <ProfileProvider>
            <FoodRecordsProvider>
                <div>
                    {/* Fixed top navbar */}
                    <TopNavbar onProfileClick={handleProfileClick} />

                    {/* Main content with top and bottom padding */}
                    <Box sx={{ pt: "70px", pb: "80px" }}>{renderPage()}</Box>

                    {/* Fixed bottom navbar */}
                    <BottomNavbar onNavChange={handleNavChange} />
                </div>
            </FoodRecordsProvider>
        </ProfileProvider>
    );
}

export default App;
