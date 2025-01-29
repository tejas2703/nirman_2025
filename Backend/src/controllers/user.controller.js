import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.models.js";
import { FoodItem } from "../models/foodItems.models.js"
//import { uploadToCloudinary  } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const generateAccessToken = async(userId) => {
    try{
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        // const refreshToken = user.generateRefreshToken();
        // user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false});
        return { accessToken };
}   catch (error) {
        throw new ApiError(500, "Failed to generate tokens");
    }
} 

import { sendTwilioAlert } from "../utils/twilio.js";

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email) throw new ApiError(400, "Email is required");
    if (!password) throw new ApiError(400, "Password is required");

    const user = await User.findOne({ email });
    if (!user) throw new ApiError(404, "User not found, Unauthorized");

    const isPasswordValid = await user.isPasswordCorrect(password);
    if (!isPasswordValid) throw new ApiError(401, "Invalid password");

    const { accessToken } = await generateAccessToken(user._id);

    const foodItems = await FoodItem.find({ user: user._id });

    let expiringSoonItems = [];
    let expiredItems = [];

    // Update status for all food items
    const updatedFoodItems = await Promise.all(
        foodItems.map(async (item) => {
            const today = new Date();
            const expiry = new Date(item.expiryDate);
            const diffTime = expiry - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let newStatus = "";
            if (diffDays > 7) {
                newStatus = "good";
            } else if (diffDays <= 7 && diffDays >= 0) {
                newStatus = "expiring soon";
                expiringSoonItems.push(item.name);
            } else {
                newStatus = "expired";
                expiredItems.push(item.name);
            }

            // Update the database only if the status has changed
            if (item.status !== newStatus) {
                await FoodItem.findByIdAndUpdate(
                    item._id,
                    { $set: { status: newStatus } },
                    { new: true }
                );
            }

            return { ...item._doc, status: newStatus };
        })
    );

    const loggedInUser = await User.findById(user._id).select("-password");

    const options = {
        httpOnly: true,
        secure: true,
    };

    try {
        // Construct the Twilio message
        let message = `Dear consumer,`;
        if (expiringSoonItems.length > 0) {
            message += ` your following food items are expiring soon: ${expiringSoonItems.join(", ")}.`;
        }
        if (expiredItems.length > 0) {
            message += ` Your following food items have expired: ${expiredItems.join(", ")}.`;
        }
        if (expiringSoonItems.length === 0 && expiredItems.length === 0) {
            message = `Dear consumer, all your food items are in good condition.`;
        }

        // Send SMS to the user's phone number
        await sendTwilioAlert(loggedInUser.phone, message);
    } catch (error) {
        console.error("Failed to send Twilio alert:", error.message);
    }

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(
                200,
                {
                    loggedInUser,
                    accessToken,
                    updatedFoodItems,
                },
                "User logged in successfully"
            )
        );
});


const getFoodItems = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    const foodItems = await FoodItem.find({ user: userId });

    // Update statuses and send alerts
    const updatedFoodItems = await Promise.all(
        foodItems.map(async (item) => {
            const today = new Date();
            const expiry = new Date(item.expiryDate);
            const diffTime = expiry - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            let newStatus = "";
            if (diffDays > 7) newStatus = "good";
            else if (diffDays <= 7 && diffDays >= 0) newStatus = "expiring soon";
            else newStatus = "expired";

            if (item.status !== newStatus) {
                await FoodItem.findByIdAndUpdate(
                    item._id,
                    { $set: { status: newStatus } },
                    { new: true }
                );

                // Send alert for expiring food items
                if (newStatus === "expiring soon") {
                    try {
                        const message = `Reminder: Your food item "${item.name}" is expiring soon!`;
                        await sendTwilioAlert(req.user.phone, message);
                    } catch (error) {
                        console.error("Failed to send Twilio alert:", error.message);
                    }
                }
            }

            return { ...item._doc, status: newStatus };
        })
    );

    return res
        .status(200)
        .json(new ApiResponse(200, updatedFoodItems, "Food items fetched successfully"));
});


const addFoodItem = asyncHandler(async (req, res) => {
    const updateFoodItemStatus = (expiryDate) => {
        const today = new Date();
        const expiry = new Date(expiryDate); // Converts "YYYY-MM-DD" to a valid Date object
        const diffTime = expiry - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 7) {
            return "good";
        } else if (diffDays <= 7 && diffDays >= 0) {
            return "expiring soon";
        } else {
            return "expired";
        }
    };

    const { name, quantity, manufacturingDate, expiryDate } = req.body;

    // Convert normal dates to ISO format
    const manufacturingDateISO = new Date(manufacturingDate).toISOString();
    const expiryDateISO = new Date(expiryDate).toISOString();

    // Validate input
    if (!(name && quantity && manufacturingDateISO && expiryDateISO)) {
        throw new ApiError(400, "All fields are required");
    }

    // Determine status
    const status = updateFoodItemStatus(expiryDate);

    // Create and save the new food item
    const newFoodItem = new FoodItem({
        name,
        quantity,
        manufacturingDate: manufacturingDateISO,
        expiryDate: expiryDateISO,
        status,
        user: req.user._id, // Attach user reference
    });

    await newFoodItem.save();

    res.status(201).json(newFoodItem);
});

export { loginUser, addFoodItem, getFoodItems }
