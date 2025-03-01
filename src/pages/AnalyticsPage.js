import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";

const AnalyticsPage = () => {
    return (
        <Container maxWidth="sm" sx={{ marginTop: "20px" }}>
            <Box textAlign="center" mb={2}>
                <Typography variant="h4" gutterBottom>
                    Analytics
                </Typography>
            </Box>
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="body1">
                    Total Calories Today: 2200
                </Typography>
            </Paper>
            <Paper elevation={3} sx={{ padding: 2, marginBottom: 2 }}>
                <Typography variant="body1">
                    Average Calories per Meal: 550
                </Typography>
            </Paper>
        </Container>
    );
};

export default AnalyticsPage;
