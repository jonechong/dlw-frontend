import React, { useState } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import AnalyticsIcon from "@mui/icons-material/Assessment";
import { useTheme } from "@mui/material/styles";

const BottomNavbar = ({ onNavChange }) => {
    const [value, setValue] = useState(0);

    // Access the theme to use palette colors
    const theme = useTheme();

    const handleChange = (event, newValue) => {
        setValue(newValue);
        onNavChange(newValue);
    };

    return (
        <BottomNavigation
            value={value}
            onChange={handleChange}
            showLabels
            sx={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                // Use the theme's primary color for the background
                backgroundColor: theme.palette.primary.main,
                // Use the theme's contrast text color
                color: theme.palette.primary.contrastText,
            }}
        >
            <BottomNavigationAction
                label="Food"
                icon={<FastfoodIcon />}
                // Override label and icon color if needed
                sx={{
                    color: theme.palette.primary.contrastText,
                    "&.Mui-selected": {
                        color: theme.palette.secondary.main, // Example: highlight the selected icon/label in secondary color
                    },
                }}
            />
            <BottomNavigationAction
                label="Analytics"
                icon={<AnalyticsIcon />}
                sx={{
                    color: theme.palette.primary.contrastText,
                    "&.Mui-selected": {
                        color: theme.palette.secondary.main,
                    },
                }}
            />
        </BottomNavigation>
    );
};

export default BottomNavbar;
