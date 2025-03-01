import { createTheme } from "@mui/material/styles";

const theme = createTheme({
    palette: {
        mode: "dark",

        primary: {
            main: "#71b2e5",
            contrastText: "#FFFFFF",
        },

        secondary: {
            main: "#F0D5C2",
            contrastText: "#0D1F2D",
        },

        background: {
            default: "#0D1F2D",
            paper: "#546A7B",
        },

        text: {
            primary: "#FFFFFF",
            secondary: "#B3B3B3",
        },

        action: {
            active: "#FAE1DF",
            hover: "rgba(250,225,223,0.08)",
            selected: "rgba(250,225,223,0.16)",
            disabled: "rgba(250,225,223,0.3)",
            disabledBackground: "rgba(250,225,223,0.12)",
        },
    },

    typography: {
        fontFamily: `'Poppins', sans-serif`,
        h1: { fontSize: "2rem", fontWeight: 700 },
        h2: { fontSize: "1.5rem", fontWeight: 600 },
        body1: { fontSize: "1rem" },
        button: { textTransform: "none", fontWeight: 600 },
    },

    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
});

export default theme;
