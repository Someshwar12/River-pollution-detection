# ai-service/training_scripts/lstm_data_builder.py
import pandas as pd
import numpy as np
import requests
from datetime import timedelta, date
from sklearn.preprocessing import MinMaxScaler
import os

# --- Configuration for Indian River Context ---
START_DATE = date(2024, 1, 1)
END_DATE = date(2024, 12, 31) # Full Year Cycle
N_DAYS = (END_DATE - START_DATE).days + 1
# Assuming a location in the northern plains, reflecting a strong monsoon cycle
LAT, LON = 25.3176, 82.9739 # Varanasi (Ganges River proxy) 

# --- Function to Simulate Fetching Environmental Data ---
def fetch_indian_environmental_data(start, end, n_days):
    """
    Simulates fetching time-series data (Rainfall, Temp, Flow) 
    reflecting typical North Indian seasonal patterns (Jan-Dec).
    """
    df = pd.DataFrame(index=pd.date_range(start, end))
    
    # 1. Simulate Seasonal Temperature (Low in Jan, High in May/June)
    days = np.arange(n_days)
    temp_wave = np.sin(days / 365 * 2 * np.pi - np.pi/2) * 10 + 25 # Min 15C, Max 35C
    df['Temperature'] = np.clip(temp_wave + np.random.normal(0, 1.5, n_days), 15, 35)

    # 2. Simulate River Flow (CRITICAL: Low flow in pre-monsoon, huge spike in monsoon)
    base_flow = np.full(n_days, 500, dtype=np.float64)
    # Monsoon start is generally late June, peaking in Aug
    monsoon_start_day = (date(2024, 6, 20) - START_DATE).days
    monsoon_end_day = (date(2024, 10, 1) - START_DATE).days
    
    monsoon_days = days[monsoon_start_day:monsoon_end_day]
    flow_spike = np.sin(np.linspace(0, np.pi, len(monsoon_days)), dtype=np.float64) * 4500 # Spike up to 5000 units
    base_flow[monsoon_start_day:monsoon_end_day] += flow_spike
    df['River_Flow'] = base_flow + np.random.normal(0, 100, n_days)
    
    # 3. Simulate Rainfall (Spike aligned with flow)
    df['Rainfall'] = np.clip(np.where(base_flow > 1500, np.random.normal(30, 15), np.random.normal(1, 1)), 0, 100)
    
    return df

def create_indian_pollution_index_and_params(df):
    """
    Creates a composite Pollution Index (Target Variable) 
    and mock water quality parameters based on flow and temperature.
    """
    
    # 1. Base Pollution Index Logic (0 to 100 scale)
    # Pollution is high during low flow (low dilution) and post-monsoon washout
    
    # Normalize inputs for composite score:
    norm_temp = (df['Temperature'] - df['Temperature'].min()) / (df['Temperature'].max() - df['Temperature'].min())
    norm_flow_inverse = 1 - (df['River_Flow'] - df['River_Flow'].min()) / (df['River_Flow'].max() - df['River_Flow'].min())
    
    # Index Score: Highest pollution in the pre-monsoon (low flow, high temp)
    df['Pollution_Index'] = ((norm_temp * 0.5) + (norm_flow_inverse * 0.5)) * 100
    
    # Simulate a post-monsoon spike due to heavy runoff and sewage washout
    post_monsoon_day = (date(2024, 10, 15) - START_DATE).days
    df.loc[df.index == df.index[post_monsoon_day], 'Pollution_Index'] += 20
    
    df['Pollution_Index'] = np.clip(df['Pollution_Index'] + np.random.normal(0, 5, len(df)), 0, 100)

    # 2. Simulate Water Quality Parameters (Inversely related to Pollution Index)
    norm_pollution = df['Pollution_Index'] / 100
    
    # pH (7.0 - 8.5, slightly alkaline when polluted/algae blooms)
    df['pH'] = np.clip(7.5 + (norm_pollution * 1.0), 7.0, 8.5)
    
    # DO (Dissolved Oxygen) (Lowest when pollution is high, 3.0 to 8.5 mg/L)
    df['DO'] = np.clip(8.0 - (norm_pollution * 5.0), 3.0, 8.5)
    
    # Turbidity (High when sediment or pollution is high, 5 to 100 NTU)
    df['Turbidity'] = np.clip(5 + (norm_pollution * 95), 5, 100)
    
    # Electrical Conductivity (TDS/Salts, highest when pollution is high)
    df['Conductivity'] = np.clip(250 + (norm_pollution * 750), 250, 1000)

    return df

if __name__ == "__main__":
    print(f"Building LSTM data for Indian River Context ({START_DATE} to {END_DATE})...")
    
    # Fetch/create environmental data
    raw_data_df = fetch_indian_environmental_data(START_DATE, END_DATE, N_DAYS)
    
    # Create the dependent pollution variable and core parameters
    final_df = create_indian_pollution_index_and_params(raw_data_df)
    
    # Save the final CSV for LSTM training
    output_path = '../data/data_lstm/pollution_data.csv'
    
    # Ensure the directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    # Save the data
    final_df.to_csv(output_path)
    
    print(f"✅ LSTM Data File created successfully for Indian Rivers at {output_path}")
    print("\nHead of Data (showing key parameters):")
    print(final_df[['Pollution_Index', 'River_Flow', 'Rainfall', 'Temperature', 'pH', 'DO']].head())
    print("\nStatistical Summary (check for high variability):")
    print(final_df[['Pollution_Index', 'River_Flow']].describe())