import React, { createContext, useContext, useState, useEffect } from "react";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
    const [profile, setProfile] = useState(() => {
        const cached = localStorage.getItem("profile");
        return cached
            ? JSON.parse(cached)
            : {
                  name: "No Name Provided",
                  email: "No Email Provided",
                  age: "",
                  height: "",
                  weight: "",
                  medicalConditions: "",
                  targetWeight: "",
                  stepsPerDay: "",
                  targetLoss: "",
                  dailyCalorieTarget: "",
                  bmr: "Not calculated",
                  estimatedExpenditure: "Not calculated",
                  profileImage: "",
              };
    });

    useEffect(() => {
        localStorage.setItem("profile", JSON.stringify(profile));
    }, [profile]);

    return (
        <ProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </ProfileContext.Provider>
    );
};

export const useProfile = () => useContext(ProfileContext);
