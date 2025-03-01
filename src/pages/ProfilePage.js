import React, { useState, useRef } from "react";
import {
    Container,
    Typography,
    Paper,
    Grid,
    Avatar,
    Box,
    Button,
    TextField,
    IconButton,
} from "@mui/material";
import { useProfile } from "../contexts/ProfileContext";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import DeleteIcon from "@mui/icons-material/Delete";

// Utility function to calculate activity factor based on steps per day.
const getActivityFactor = (steps) => {
    const numSteps = parseFloat(steps);
    if (isNaN(numSteps)) return 1.2;
    if (numSteps < 5000) return 1.2; // Sedentary
    else if (numSteps < 7500) return 1.375; // Lightly active
    else if (numSteps < 10000) return 1.55; // Moderately active
    else if (numSteps < 12500) return 1.7; // Active
    else return 1.9; // Highly active
};

const ProfilePage = () => {
    const { profile, setProfile } = useProfile();
    const [editing, setEditing] = useState(false);
    const [tempProfile, setTempProfile] = useState(profile);
    const fileInputRef = useRef(null);

    // Handle text field changes.
    const handleChange = (e) => {
        const { name, value } = e.target;
        setTempProfile((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // Handle image upload.
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setTempProfile((prev) => ({
                    ...prev,
                    profileImage: reader.result,
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Remove image.
    const handleRemoveImage = () => {
        setTempProfile((prev) => ({
            ...prev,
            profileImage: "",
        }));
    };

    // Save changes and calculate BMR, TDEE, and daily calorie target.
    const handleSave = () => {
        const weight = parseFloat(tempProfile.weight);
        const height = parseFloat(tempProfile.height);
        const age = parseFloat(tempProfile.age);
        const steps = parseFloat(tempProfile.stepsPerDay);
        const targetLoss = parseFloat(tempProfile.targetLoss); // target weight loss (kg/week)

        let updatedData = { ...tempProfile };

        if (!isNaN(weight) && !isNaN(height) && !isNaN(age)) {
            // Mifflin-St Jeor Equation for males:
            const newBMR = 10 * weight + 6.25 * height - 5 * age + 5;
            const activityFactor = getActivityFactor(steps);
            const tdee = newBMR * activityFactor;
            updatedData = {
                ...updatedData,
                bmr: newBMR.toFixed(0),
                estimatedExpenditure: tdee.toFixed(0),
                name:
                    updatedData.name === "No Name Provided"
                        ? ""
                        : updatedData.name,
            };

            // If user provided a target weight loss, calculate daily calorie target.
            if (!isNaN(targetLoss)) {
                // 7700 calories deficit per kg lost. Divide by 7 for daily deficit.
                const dailyDeficit = (targetLoss * 7700) / 7;
                const dailyCalorieTarget = tdee - dailyDeficit;
                updatedData.dailyCalorieTarget = dailyCalorieTarget.toFixed(0);
            } else {
                updatedData.dailyCalorieTarget = "";
            }
        }
        setProfile(updatedData);
        setEditing(false);
    };

    // Cancel changes.
    const handleCancel = () => {
        setTempProfile(profile);
        setEditing(false);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 2 }}>
            <Paper
                elevation={3}
                sx={{ p: 3, backgroundColor: "background.paper" }}
            >
                <Box textAlign="center" mb={2}>
                    {/* Avatar with overlay for image upload */}
                    <Box sx={{ position: "relative", display: "inline-block" }}>
                        <Avatar
                            src={
                                editing
                                    ? tempProfile.profileImage
                                    : profile.profileImage
                            }
                            sx={{ width: 80, height: 80, margin: "auto" }}
                        />
                        {editing && (
                            <>
                                <Box
                                    onClick={() => fileInputRef.current.click()}
                                    sx={{
                                        position: "absolute",
                                        top: 0,
                                        left: 0,
                                        width: 80,
                                        height: 80,
                                        bgcolor: "rgba(0,0,0,0.4)",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderRadius: "50%",
                                        cursor: "pointer",
                                        opacity: 1,
                                    }}
                                >
                                    <CameraAltIcon sx={{ color: "#fff" }} />
                                </Box>
                                {tempProfile.profileImage && (
                                    <IconButton
                                        onClick={handleRemoveImage}
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
                            </>
                        )}
                    </Box>
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleImageUpload}
                    />

                    {editing ? (
                        <TextField
                            name="name"
                            label="Name"
                            variant="outlined"
                            fullWidth
                            autoComplete="off"
                            value={
                                tempProfile.name === "No Name Provided"
                                    ? ""
                                    : tempProfile.name
                            }
                            onChange={handleChange}
                            placeholder="Enter name"
                            margin="normal"
                        />
                    ) : (
                        <>
                            <Typography variant="h5" gutterBottom>
                                {profile.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {profile.email}
                            </Typography>
                        </>
                    )}
                </Box>

                {editing ? (
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="email"
                                label="Email"
                                variant="outlined"
                                fullWidth
                                autoComplete="off"
                                value={
                                    tempProfile.email === "No Email Provided"
                                        ? ""
                                        : tempProfile.email
                                }
                                onChange={handleChange}
                                placeholder="Enter email"
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="age"
                                label="Age (years)"
                                variant="outlined"
                                fullWidth
                                autoComplete="off"
                                type="number"
                                value={tempProfile.age}
                                onChange={handleChange}
                                placeholder="Enter age"
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="height"
                                label="Height (cm)"
                                variant="outlined"
                                fullWidth
                                autoComplete="off"
                                type="number"
                                value={tempProfile.height}
                                onChange={handleChange}
                                placeholder="Enter height in cm"
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="weight"
                                label="Weight (kg)"
                                variant="outlined"
                                fullWidth
                                autoComplete="off"
                                type="number"
                                value={tempProfile.weight}
                                onChange={handleChange}
                                placeholder="Enter weight in kg"
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                name="medicalConditions"
                                label="Medical Conditions"
                                variant="outlined"
                                fullWidth
                                autoComplete="off"
                                value={tempProfile.medicalConditions}
                                onChange={handleChange}
                                placeholder="Enter any conditions"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="targetWeight"
                                label="Target Weight Goal (kg)"
                                variant="outlined"
                                fullWidth
                                autoComplete="off"
                                type="number"
                                value={tempProfile.targetWeight}
                                onChange={handleChange}
                                placeholder="Enter target weight"
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="stepsPerDay"
                                label="Steps per Day"
                                variant="outlined"
                                fullWidth
                                autoComplete="off"
                                type="number"
                                value={tempProfile.stepsPerDay}
                                onChange={handleChange}
                                placeholder="Enter daily steps"
                                inputProps={{ min: 0 }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="targetLoss"
                                label="Target Weight Loss per Week"
                                variant="outlined"
                                fullWidth
                                autoComplete="off"
                                select
                                value={tempProfile.targetLoss}
                                onChange={handleChange}
                                InputLabelProps={{ shrink: true }}
                                SelectProps={{
                                    native: true,
                                    displayEmpty: true,
                                }}
                                margin="dense"
                            >
                                <option value="" disabled>
                                    Select an option
                                </option>
                                <option value="0.25">0.25 kg/week</option>
                                <option value="0.5">0.5 kg/week</option>
                                <option value="0.75">0.75 kg/week</option>
                                <option value="1">1 kg/week</option>
                            </TextField>
                        </Grid>
                    </Grid>
                ) : (
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Typography variant="body1">Age:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="right">
                                {profile.age || "Not provided"}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">Height:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="right">
                                {profile.height
                                    ? `${profile.height} cm`
                                    : "Not provided"}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">Weight:</Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="right">
                                {profile.weight
                                    ? `${profile.weight} kg`
                                    : "Not provided"}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">
                                Medical Conditions:
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="right">
                                {profile.medicalConditions || "Not provided"}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">
                                Target Weight Goal:
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="right">
                                {profile.targetWeight
                                    ? `${profile.targetWeight} kg`
                                    : "Not provided"}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">
                                Steps per Day:
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="right">
                                {profile.stepsPerDay || "Not provided"}
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1">
                                Target Loss:
                            </Typography>
                        </Grid>
                        <Grid item xs={6}>
                            <Typography variant="body1" align="right">
                                {profile.targetLoss
                                    ? `${profile.targetLoss} kg/week`
                                    : "Not provided"}
                            </Typography>
                        </Grid>
                    </Grid>
                )}

                {/* Non-editable calculated details */}
                <Grid container spacing={2} sx={{ mt: 2 }}>
                    <Grid item xs={6}>
                        <Typography variant="body1">
                            BMR (Basal Metabolic Rate):
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1" align="right">
                            {profile.bmr}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1">
                            Estimated Caloric Expenditure:
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="body1" align="right">
                            {profile.estimatedExpenditure}
                        </Typography>
                    </Grid>
                    {profile.dailyCalorieTarget && (
                        <>
                            <Grid item xs={6}>
                                <Typography variant="body1">
                                    Daily Calorie Target:
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body1" align="right">
                                    {profile.dailyCalorieTarget}
                                </Typography>
                            </Grid>
                        </>
                    )}
                </Grid>

                {editing ? (
                    <Box textAlign="center" mt={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSave}
                            sx={{ mr: 1 }}
                        >
                            Save
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleCancel}
                        >
                            Cancel
                        </Button>
                    </Box>
                ) : (
                    <Box textAlign="center" mt={3}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => {
                                setTempProfile(profile);
                                setEditing(true);
                            }}
                        >
                            Edit Profile
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default ProfilePage;
