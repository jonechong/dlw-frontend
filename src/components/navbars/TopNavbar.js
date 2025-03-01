import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AccountCircle from "@mui/icons-material/AccountCircle";

const TopNavbar = ({ onProfileClick }) => {
    return (
        <AppBar position="fixed" sx={{ top: 0, left: 0, right: 0 }}>
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        textAlign: "center",
                    }}
                >
                    Weigh To Go
                </Typography>
                <IconButton
                    color="inherit"
                    onClick={onProfileClick}
                    sx={{ marginLeft: "auto" }}
                >
                    <AccountCircle />
                </IconButton>
            </Toolbar>
        </AppBar>
    );
};

export default TopNavbar;
