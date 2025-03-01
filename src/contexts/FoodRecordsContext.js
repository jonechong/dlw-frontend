import React, { createContext, useContext, useState, useEffect } from "react";

const FoodRecordsContext = createContext();

const initialTotals = { calories: 0, carbs: 0, protein: 0, fats: 0, sodium: 0 };

export const FoodRecordsProvider = ({ children }) => {
    // Initialize from localStorage (or an empty object if none exists)
    const [foodRecords, setFoodRecords] = useState(() => {
        const stored = localStorage.getItem("foodRecords");
        return stored ? JSON.parse(stored) : {};
    });

    // Whenever foodRecords changes, update localStorage.
    useEffect(() => {
        localStorage.setItem("foodRecords", JSON.stringify(foodRecords));
    }, [foodRecords]);

    // Helper: compute totals for an array of food items.
    const calculateTotals = (records) => {
        return records.reduce(
            (acc, item) => ({
                calories: acc.calories + Number(item.calories || 0),
                carbs: acc.carbs + Number(item.carbs || 0),
                protein: acc.protein + Number(item.protein || 0),
                fats: acc.fats + Number(item.fats || 0),
                sodium: acc.sodium + Number(item.sodium || 0),
            }),
            { ...initialTotals }
        );
    };

    // Update records for a given date (replace all records).
    const updateFoodRecordsForDate = (date, records) => {
        const totals = calculateTotals(records);
        setFoodRecords((prev) => ({ ...prev, [date]: { records, totals } }));
    };

    // Add a food record for a given date.
    const addFoodRecordForDate = (date, foodItem) => {
        setFoodRecords((prev) => {
            const currentData = prev[date] || {
                records: [],
                totals: { ...initialTotals },
            };
            const newRecords = [...currentData.records, foodItem];
            const newTotals = calculateTotals(newRecords);
            return {
                ...prev,
                [date]: { records: newRecords, totals: newTotals },
            };
        });
    };

    // Remove a food record for a given date.
    const removeFoodRecordForDate = (date, foodId) => {
        setFoodRecords((prev) => {
            const currentData = prev[date];
            if (!currentData) return prev;
            const newRecords = currentData.records.filter(
                (item) => item.id !== foodId
            );
            const newTotals = calculateTotals(newRecords);
            return {
                ...prev,
                [date]: { records: newRecords, totals: newTotals },
            };
        });
    };

    return (
        <FoodRecordsContext.Provider
            value={{
                foodRecords,
                updateFoodRecordsForDate,
                addFoodRecordForDate,
                removeFoodRecordForDate,
            }}
        >
            {children}
        </FoodRecordsContext.Provider>
    );
};

export const useFoodRecords = () => useContext(FoodRecordsContext);
export default FoodRecordsContext;
