import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import joblib
# from river import linear_model, metrics  # Uncomment this when you plan to use incremental learning.

# Step 1: Load Dummy Data
def load_data(file_path):
    try:
        data = pd.read_csv(file_path)
        print(f"Data loaded successfully from {file_path}.")
        return data
    except Exception as e:
        print(f"Error loading data: {e}")
        return None

# Step 2: Preprocess Data
def preprocess_data(df):
    df = df.copy()
    df["weather_encoded"] = df["weather"].map({"clear": 0, "rainy": 1})
    df = pd.get_dummies(df, columns=["food_name"], drop_first=True)  # One-hot encode food names
    df = df.drop(columns=["date", "weather"])
    return df

# Step 3: Train Model
def train_model(data):
    X = data.drop(columns="surplus")
    y = data["surplus"]
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    print("Model trained successfully.")
    return model

# Step 4: Save Model
def save_model(model, filename="food_surplus_model.pkl"):
    joblib.dump(model, filename)
    print(f"Model saved to {filename}")

# Step 5: Generate Suggestions
def generate_suggestions(model, recent_data):
    suggestions = []
    for food_name in recent_data["food_name"].unique():
        food_data = recent_data[recent_data["food_name"] == food_name].tail(1)
        next_day_features = preprocess_data(food_data)
        prediction = model.predict(next_day_features.drop(columns="surplus"))[0]
        suggested_preparation = max(0, food_data.iloc[-1]["food_prepared"] - prediction)
        suggestions.append({
            "food_name": food_name,
            "predicted_surplus": prediction,
            "suggested_food_preparation": suggested_preparation
        })
    return suggestions

# Uncomment and modify this section when ready for daily updates using River library
"""
# Step 6: Incremental Training (Future Use)
def incremental_training(model, new_data):
    metric = metrics.MSE()
    for _, row in new_data.iterrows():
        x = row.drop(columns="surplus").to_dict()
        y = row["surplus"]
        y_pred = model.predict_one(x)
        model.learn_one(x, y)
        metric.update(y, y_pred)
    print(f"Incremental training complete. Current MSE: {metric.get()}")
    return model
"""

# Main Workflow
def main():
    # Step 1: Load the data file
    file_path = "dummy_food_data.csv"  # Replace with the path to your dummy data file
    data = load_data(file_path)
    if data is None:
        return

    # Step 2: Preprocess data
    processed_data = preprocess_data(data)

    # Step 3: Train model
    model = train_model(processed_data)

    # Step 4: Save model
    save_model(model)

    # Step 5: Generate suggestions (example)
    suggestions = generate_suggestions(model, data)
    print("Example Suggestions:")
    for suggestion in suggestions:
        print(suggestion)

    # Uncomment this section to retrain the model daily when you're ready
    """
    # Step 6: Incremental training
    new_data_file = "daily_data.csv"  # Replace with the path to the daily data file
    new_data = load_data(new_data_file)
    if new_data is not None:
        new_processed_data = preprocess_data(new_data)
        model = incremental_training(model, new_processed_data)
        save_model(model, filename="updated_food_surplus_model.pkl")
    """

if __name__ == "__main__":
    main()
