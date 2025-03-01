import React, { useState, useEffect } from "react";
import {
    Container,
    Typography,
    Box,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    IconButton,
    Paper,
    Divider,
    Collapse,
    CircularProgress,
    Accordion,
    AccordionSummary,
    AccordionDetails,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useProfile } from "../contexts/ProfileContext";

// Helper to format a Date object as YYYY-MM-DD.
const formatDate = (date) => date.toISOString().split("T")[0];

// API call to analyze endpoint.
const fetchNutritionalValues = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
        const response = await fetch("http://127.0.0.1:8000/analyze", {
            method: "POST",
            body: formData,
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "API error");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching nutritional values:", error);
        return null;
    }
};

// API call to recommendation endpoint.
const fetchRecommendations = async (food_totals, user_profile) => {
    const payload = {
        food_totals,
        user_profile,
        current_time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        }),
    };
    // Simulate a 1-second delay so the spinner is visible.
    await new Promise((resolve) => setTimeout(resolve, 1000));
    try {
        const response = await fetch("http://127.0.0.1:8000/recommend", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "API error");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        return null;
    }
};

const cleanJsonString = (s) => {
    s = s.trim();
    if (s.startsWith("```json")) {
        s = s.slice(7).trim();
    }
    if (s.startsWith("```")) {
        s = s.slice(3).trim();
    }
    if (s.endsWith("```")) {
        s = s.slice(0, -3).trim();
    }
    return s;
};

const balanceBraces = (s) => {
    let openBraces = s.split("").filter((c) => c === "{").length;
    let closeBraces = s.split("").filter((c) => c === "}").length;
    while (openBraces > closeBraces) {
        s += "}";
        closeBraces++;
    }
    return s;
};

const MainPage = () => {
    const { profile } = useProfile();
    const today = formatDate(new Date());
    const [selectedDate, setSelectedDate] = useState(today);
    const [foodItems, setFoodItems] = useState([]);
    const [imgLoading, setImgLoading] = useState(false);
    const [recLoading, setRecLoading] = useState(false);
    const [recommendations, setRecommendations] = useState([]);
    const [expandedAcc, setExpandedAcc] = useState(null);

    // For toggling extra nutrition details.
    const [showNutritionDetails, setShowNutritionDetails] = useState(false);
    // For editing a food item.
    const [editingFood, setEditingFood] = useState(null);
    // For input method dialog.
    const [openInputMethodDialog, setOpenInputMethodDialog] = useState(false);
    // For add/edit food dialog.
    const [openFoodDialog, setOpenFoodDialog] = useState(false);
    const initialFoodState = {
        id: null,
        name: "",
        calories: "",
        carbs: "",
        protein: "",
        fats: "",
        sodium: "",
        image: "",
    };
    const [foodData, setFoodData] = useState(initialFoodState);
    const [imagePreview, setImagePreview] = useState("");
    // For recommendation dialog.
    const [openRecommendationDialog, setOpenRecommendationDialog] =
        useState(false);

    // Load food items.
    useEffect(() => {
        const records = JSON.parse(localStorage.getItem("foodRecords") || "{}");
        const dailyData = records[selectedDate];
        if (dailyData) {
            setFoodItems(
                Array.isArray(dailyData) ? dailyData : dailyData.records
            );
        } else {
            setFoodItems([]);
        }
    }, [selectedDate]);

    // Save food items.
    useEffect(() => {
        const records = JSON.parse(localStorage.getItem("foodRecords") || "{}");
        const totalNutrition = foodItems.reduce(
            (totals, item) => ({
                calories: totals.calories + Number(item.calories || 0),
                carbs: totals.carbs + Number(item.carbs || 0),
                protein: totals.protein + Number(item.protein || 0),
                fats: totals.fats + Number(item.fats || 0),
                sodium: totals.sodium + Number(item.sodium || 0),
            }),
            { calories: 0, carbs: 0, protein: 0, fats: 0, sodium: 0 }
        );
        records[selectedDate] = { records: foodItems, totals: totalNutrition };
        localStorage.setItem("foodRecords", JSON.stringify(records));
    }, [foodItems, selectedDate]);

    // Date navigation.
    const handlePrevDate = () => {
        const dateObj = new Date(selectedDate);
        dateObj.setDate(dateObj.getDate() - 1);
        setSelectedDate(formatDate(dateObj));
    };
    const handleNextDate = () => {
        const dateObj = new Date(selectedDate);
        dateObj.setDate(dateObj.getDate() + 1);
        const newDateStr = formatDate(dateObj);
        if (newDateStr <= today) setSelectedDate(newDateStr);
    };

    const toggleNutritionDetails = () => {
        setShowNutritionDetails((prev) => !prev);
    };

    // Input method dialog.
    const handleOpenInputMethodDialog = () => {
        setOpenInputMethodDialog(true);
    };
    const handleCloseInputMethodDialog = () => {
        setOpenInputMethodDialog(false);
    };

    const handleChooseUpload = () => {
        handleCloseInputMethodDialog();
        setFoodData({ ...initialFoodState });
        setOpenFoodDialog(true);
        setTimeout(() => {
            document.getElementById("food-image-input").click();
        }, 100);
    };

    const handleChooseManual = () => {
        handleCloseInputMethodDialog();
        setFoodData(initialFoodState);
        setImagePreview("");
        setOpenFoodDialog(true);
    };

    const handleOpenEditDialog = (food) => {
        setEditingFood(food);
        setFoodData(food);
        setImagePreview(food.image || "");
        setOpenFoodDialog(true);
    };

    const handleCloseFoodDialog = () => {
        setFoodData(initialFoodState);
        setImagePreview("");
        setOpenFoodDialog(false);
        setEditingFood(null);
    };

    const handleFoodChange = (e) => {
        const { name, value } = e.target;
        setFoodData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        const file = files[0];
        const reader = new FileReader();
        reader.onloadend = async () => {
            setFoodData((prev) => ({ ...prev, image: reader.result }));
            setImagePreview(reader.result);
            setImgLoading(true);
            const result = await fetchNutritionalValues(file);
            setImgLoading(false);
            if (result) {
                setFoodData((prev) => ({ ...prev, ...result }));
            }
        };
        reader.readAsDataURL(file);
    };

    const handleSaveFood = () => {
        if (
            foodData.name.trim() === "" ||
            String(foodData.calories).trim() === ""
        )
            return;
        if (editingFood) {
            setFoodItems((prev) =>
                prev.map((item) =>
                    item.id === editingFood.id ? foodData : item
                )
            );
        } else {
            const newFood = { ...foodData, id: Date.now() };
            setFoodItems((prev) => [...prev, newFood]);
        }
        handleCloseFoodDialog();
    };

    const handleDeleteFood = () => {
        if (editingFood) {
            setFoodItems((prev) =>
                prev.filter((item) => item.id !== editingFood.id)
            );
            handleCloseFoodDialog();
        }
    };

    const totalCarbs = foodItems.reduce(
        (sum, item) => sum + (parseInt(item.carbs, 10) || 0),
        0
    );
    const totalProtein = foodItems.reduce(
        (sum, item) => sum + (parseInt(item.protein, 10) || 0),
        0
    );
    const totalFats = foodItems.reduce(
        (sum, item) => sum + (parseInt(item.fats, 10) || 0),
        0
    );
    const totalSodium = foodItems.reduce(
        (sum, item) => sum + (parseInt(item.sodium, 10) || 0),
        0
    );
    const totalCalories = foodItems.reduce(
        (sum, item) => sum + (parseInt(item.calories, 10) || 0),
        0
    );
    const target = profile.dailyCalorieTarget
        ? parseInt(profile.dailyCalorieTarget, 10)
        : profile.estimatedExpenditure
        ? parseInt(profile.estimatedExpenditure, 10)
        : 0;
    const percentage = target > 0 ? (totalCalories / target) * 100 : 0;
    const clampedPercentage = Math.min(percentage, 100);

    const handleOpenRecommendationDialog = async () => {
        setRecLoading(true);
        const food_totals = {
            calories: totalCalories,
            carbs: totalCarbs,
            protein: totalProtein,
            fats: totalFats,
            sodium: totalSodium,
        };
        const recData = await fetchRecommendations(food_totals, profile);
        setRecLoading(false);
        if (recData) {
            setRecommendations(recData.recommendations || []);
        } else {
            setRecommendations([]);
        }
        setExpandedAcc(null);
        setOpenRecommendationDialog(true);
    };

    const handleCloseRecommendationDialog = () => {
        setOpenRecommendationDialog(false);
    };

    const handleAccordionChange = (panel) => (event, isExpanded) => {
        setExpandedAcc(isExpanded ? panel : null);
    };

    const remaining = target - totalCalories;

    return (
        <Container maxWidth="sm" sx={{ mt: 2, mb: 8 }}>
            {/* Date Navigation Header */}
            <Paper sx={{ p: 1, mb: 2, borderRadius: 2 }} elevation={3}>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <IconButton size="small" onClick={handlePrevDate}>
                        <ArrowBackIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="h6">
                        {new Date(selectedDate).toLocaleDateString()}
                    </Typography>
                    <IconButton
                        size="small"
                        onClick={handleNextDate}
                        disabled={selectedDate === today}
                    >
                        <ArrowForwardIcon fontSize="small" />
                    </IconButton>
                </Box>
            </Paper>

            {/* Calories Bar and Food List */}
            <Paper sx={{ p: 2, mb: 2 }} elevation={3}>
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                >
                    <Box display="flex" alignItems="center">
                        <Typography variant="body1">
                            Calories Consumed: {totalCalories} / {target}
                        </Typography>
                        <IconButton
                            onClick={toggleNutritionDetails}
                            size="small"
                        >
                            <ExpandMoreIcon
                                sx={{
                                    transform: showNutritionDetails
                                        ? "rotate(180deg)"
                                        : "rotate(0deg)",
                                    transition: "transform 0.3s",
                                }}
                            />
                        </IconButton>
                    </Box>
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        sx={{ borderRadius: "50px", textTransform: "none" }}
                        onClick={handleOpenRecommendationDialog}
                    >
                        Recommend
                    </Button>
                </Box>
                <Box
                    sx={{
                        position: "relative",
                        height: 20,
                        backgroundColor: "#e0e0e0",
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            height: "100%",
                            width: `${clampedPercentage}%`,
                            backgroundColor:
                                percentage <= 100
                                    ? "primary.main"
                                    : "error.main",
                        }}
                    />
                    {percentage > 100 && (
                        <Box
                            sx={{
                                height: "100%",
                                width: `${percentage - 100}%`,
                                backgroundColor: "error.main",
                                position: "absolute",
                                top: 0,
                                left: "100%",
                            }}
                        />
                    )}
                </Box>
                <Typography variant="body2" mb={1}>
                    {remaining >= 0
                        ? `${remaining} calories remaining`
                        : `${Math.abs(remaining)} calories over target`}
                </Typography>
                <Collapse in={showNutritionDetails}>
                    <Box mb={1}>
                        <Typography variant="body2">
                            Total Carbs: {totalCarbs} g
                        </Typography>
                        <Typography variant="body2">
                            Total Protein: {totalProtein} g
                        </Typography>
                        <Typography variant="body2">
                            Total Fats: {totalFats} g
                        </Typography>
                        <Typography variant="body2">
                            Total Sodium: {totalSodium} mg
                        </Typography>
                    </Box>
                </Collapse>
                <Divider />
                <Box mt={2}>
                    {foodItems.length === 0 ? (
                        <Typography variant="body2" color="text.secondary">
                            No food items recorded.
                        </Typography>
                    ) : (
                        <Grid container spacing={2}>
                            {foodItems.map((food) => (
                                <Grid item xs={12} key={food.id}>
                                    <Card
                                        sx={{
                                            display: "flex",
                                            cursor: "pointer",
                                        }}
                                        onClick={() =>
                                            handleOpenEditDialog(food)
                                        }
                                    >
                                        <CardMedia
                                            component="img"
                                            sx={{ width: 100 }}
                                            image={
                                                food.image ||
                                                "https://via.placeholder.com/150?text=Food"
                                            }
                                            alt={food.name}
                                        />
                                        <CardContent sx={{ flex: 1 }}>
                                            <Typography variant="h6">
                                                {food.name}
                                            </Typography>
                                            <Typography variant="body2">
                                                Calories: {food.calories} |
                                                Carbs: {food.carbs || "-"} g |
                                                Protein: {food.protein || "-"} g
                                            </Typography>
                                            <Typography variant="body2">
                                                Fats: {food.fats || "-"} g |
                                                Sodium: {food.sodium || "-"} mg
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Paper>

            {/* Floating Action Button for adding food */}
            <Fab
                color="primary"
                aria-label="add"
                onClick={handleOpenInputMethodDialog}
                sx={{ position: "fixed", bottom: 80, right: 16 }}
            >
                <AddIcon />
            </Fab>

            {/* Recommendation Loading Dialog */}
            <Dialog
                open={recLoading}
                disableEscapeKeyDown
                fullWidth
                maxWidth="sm"
            >
                <DialogContent sx={{ textAlign: "center", py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Fetching recommendations...
                    </Typography>
                </DialogContent>
            </Dialog>

            {/* Recommendation Dialog */}
            <Dialog
                open={openRecommendationDialog && !recLoading}
                onClose={handleCloseRecommendationDialog}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Today's Recommendation</DialogTitle>
                <DialogContent dividers>
                    <Box sx={{ height: 400, overflowY: "auto" }}>
                        {recommendations.length > 0 ? (
                            recommendations.map((rec, index) => (
                                <Accordion
                                    key={index}
                                    sx={{ mb: 1 }}
                                    expanded={expandedAcc === index}
                                    onChange={handleAccordionChange(index)}
                                >
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon />}
                                    >
                                        <Box
                                            sx={{
                                                display: "flex",
                                                flexDirection: "column",
                                                width: "100%",
                                            }}
                                        >
                                            <Typography
                                                variant="subtitle1"
                                                component="div"
                                            >
                                                <strong>{rec.food}</strong>
                                            </Typography>
                                            {expandedAcc !== index && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Calories:{" "}
                                                    {
                                                        rec.estimatedNutrition
                                                            .calories
                                                    }{" "}
                                                    | Remaining:{" "}
                                                    {rec.remainingAfter}
                                                </Typography>
                                            )}
                                        </Box>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{ padding: 1 }}>
                                        {expandedAcc === index && (
                                            <>
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                >
                                                    Calories:{" "}
                                                    {
                                                        rec.estimatedNutrition
                                                            .calories
                                                    }{" "}
                                                    | Remaining:{" "}
                                                    {rec.remainingAfter} |
                                                    Carbs:{" "}
                                                    {
                                                        rec.estimatedNutrition
                                                            .carbs
                                                    }
                                                    g, Protein:{" "}
                                                    {
                                                        rec.estimatedNutrition
                                                            .protein
                                                    }
                                                    g, Fats:{" "}
                                                    {
                                                        rec.estimatedNutrition
                                                            .fats
                                                    }
                                                    g, Sodium:{" "}
                                                    {
                                                        rec.estimatedNutrition
                                                            .sodium
                                                    }
                                                    mg
                                                </Typography>
                                                <Divider sx={{ my: 1 }} />
                                                <Typography variant="body2">
                                                    {rec.explanation}
                                                </Typography>
                                            </>
                                        )}
                                    </AccordionDetails>
                                </Accordion>
                            ))
                        ) : (
                            <Typography variant="body1">
                                No recommendations available.
                            </Typography>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseRecommendationDialog}
                        variant="contained"
                        color="primary"
                    >
                        OK
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Image Processing Loading Dialog */}
            <Dialog
                open={imgLoading}
                disableEscapeKeyDown
                fullWidth
                maxWidth="xs"
            >
                <DialogContent sx={{ textAlign: "center", py: 4 }}>
                    <CircularProgress />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Processing image, please wait...
                    </Typography>
                </DialogContent>
            </Dialog>

            {/* Input Method Dialog */}
            <Dialog
                open={openInputMethodDialog}
                onClose={handleCloseInputMethodDialog}
            >
                <DialogTitle>How would you like to add this food?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" gutterBottom>
                        Choose an input method:
                    </Typography>
                    <Box display="flex" justifyContent="space-around" mt={2}>
                        <Button
                            variant="contained"
                            onClick={handleChooseUpload}
                        >
                            Upload Image
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleChooseManual}
                        >
                            Manual Input
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseInputMethodDialog}
                        color="secondary"
                        variant="contained"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add/Edit Food Item Dialog */}
            <Dialog open={openFoodDialog} onClose={handleCloseFoodDialog}>
                <DialogTitle>
                    {editingFood ? "Edit Food Item" : "Add Food Item"}
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseFoodDialog}
                        sx={{
                            position: "absolute",
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers>
                    <Box
                        sx={{
                            position: "relative",
                            width: 120,
                            height: 120,
                            margin: "auto",
                            mb: 2,
                        }}
                    >
                        <Box
                            sx={{
                                width: "100%",
                                height: "100%",
                                backgroundImage: imagePreview
                                    ? `url(${imagePreview})`
                                    : "url(https://via.placeholder.com/120?text=Food)",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                                borderRadius: 1,
                            }}
                        />
                        <Box
                            onClick={() => {
                                document
                                    .getElementById("food-image-input")
                                    .click();
                            }}
                            sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                bgcolor: imagePreview
                                    ? "rgba(0,0,0,0.1)"
                                    : "rgba(0,0,0,0.8)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer",
                            }}
                        >
                            <ImageIcon sx={{ color: "#fff", fontSize: 40 }} />
                        </Box>
                        {imagePreview && (
                            <IconButton
                                onClick={() => {
                                    setFoodData((prev) => ({
                                        ...prev,
                                        image: "",
                                    }));
                                    setImagePreview("");
                                }}
                                sx={{
                                    position: "absolute",
                                    top: -8,
                                    right: -8,
                                    bgcolor: "background.paper",
                                    borderRadius: "50%",
                                    width: 32,
                                    height: 32,
                                }}
                            >
                                <DeleteIcon color="error" />
                            </IconButton>
                        )}
                        <input
                            id="food-image-input"
                            type="file"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                        />
                    </Box>
                    <TextField
                        name="name"
                        label="Food Name"
                        variant="outlined"
                        fullWidth
                        autoComplete="off"
                        value={foodData.name}
                        onChange={handleFoodChange}
                        placeholder="Enter food name"
                        margin="dense"
                    />
                    <TextField
                        name="calories"
                        label="Calories"
                        variant="outlined"
                        fullWidth
                        type="number"
                        autoComplete="off"
                        value={foodData.calories}
                        onChange={handleFoodChange}
                        placeholder="Enter calories"
                        margin="dense"
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        name="carbs"
                        label="Carbs (g)"
                        variant="outlined"
                        fullWidth
                        type="number"
                        autoComplete="off"
                        value={foodData.carbs}
                        onChange={handleFoodChange}
                        placeholder="Enter carbs"
                        margin="dense"
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        name="protein"
                        label="Protein (g)"
                        variant="outlined"
                        fullWidth
                        type="number"
                        autoComplete="off"
                        value={foodData.protein}
                        onChange={handleFoodChange}
                        placeholder="Enter protein"
                        margin="dense"
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        name="fats"
                        label="Fats (g)"
                        variant="outlined"
                        fullWidth
                        type="number"
                        autoComplete="off"
                        value={foodData.fats}
                        onChange={handleFoodChange}
                        placeholder="Enter fats"
                        margin="dense"
                        inputProps={{ min: 0 }}
                    />
                    <TextField
                        name="sodium"
                        label="Sodium (mg)"
                        variant="outlined"
                        fullWidth
                        type="number"
                        autoComplete="off"
                        value={foodData.sodium}
                        onChange={handleFoodChange}
                        placeholder="Enter sodium"
                        margin="dense"
                        inputProps={{ min: 0 }}
                    />
                </DialogContent>
                <DialogActions>
                    {editingFood && (
                        <Button
                            onClick={handleDeleteFood}
                            variant="contained"
                            color="error"
                        >
                            Delete
                        </Button>
                    )}
                    <Button
                        onClick={handleSaveFood}
                        variant="contained"
                        color="primary"
                    >
                        Save
                    </Button>
                    <Button
                        onClick={handleCloseFoodDialog}
                        variant="outlined"
                        color="secondary"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Input Method Dialog */}
            <Dialog
                open={openInputMethodDialog}
                onClose={handleCloseInputMethodDialog}
            >
                <DialogTitle>How would you like to add this food?</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" gutterBottom>
                        Choose an input method:
                    </Typography>
                    <Box display="flex" justifyContent="space-around" mt={2}>
                        <Button
                            variant="contained"
                            onClick={handleChooseUpload}
                        >
                            Upload Image
                        </Button>
                        <Button
                            variant="contained"
                            onClick={handleChooseManual}
                        >
                            Manual Input
                        </Button>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseInputMethodDialog}
                        color="secondary"
                        variant="contained"
                    >
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default MainPage;
