-- ==============================================================================
-- Google Cloud BigQuery DDL: BhoomiLive Regional Agronomic Knowledge Engine
-- Dataset: `bhoomi_agri_intel`
-- Geospatial & Soil Health Card (SHC) baseline schemas with privacy rounding
-- ==============================================================================

CREATE SCHEMA IF NOT EXISTS `bhoomi_agri_intel`
OPTIONS (
  location = 'asia-south1',
  description = 'Regional Soil Health Card data, APMC Mandi commodity calendars, and anonymized farm field triage logs.'
);

-- 1. District Soil Health Card Baselines (ICAR & Ministry of Agriculture & Farmers Welfare)
CREATE TABLE IF NOT EXISTS `bhoomi_agri_intel.district_soil_baselines` (
  district_id STRING NOT NULL,
  district_name STRING NOT NULL,
  state STRING NOT NULL,
  agroclimatic_zone STRING NOT NULL,
  soil_order STRING NOT NULL, -- Inceptisols, Vertisols, Alfisols, Entisols, Aridisols
  predominant_texture STRING NOT NULL, -- 'Clay Loam', 'Black Cotton (Vertisol)', 'Sandy Loam', 'Alluvial Silt Loam'
  
  -- Chemical & Physical Baseline Ranges
  ph_mean NUMERIC NOT NULL,
  ph_range_min NUMERIC NOT NULL,
  ph_range_max NUMERIC NOT NULL,
  ec_ds_per_m NUMERIC NOT NULL, -- Electrical Conductivity (salinity proxy)
  organic_carbon_pct NUMERIC NOT NULL, -- Low (<0.5%), Medium (0.5-0.75%), High (>0.75%)
  
  -- Available Macro-Nutrients (kg/hectare)
  available_n_kg_ha NUMERIC NOT NULL, -- Nitrogen (Low < 280, Med 280-560, High > 560)
  available_p_kg_ha NUMERIC NOT NULL, -- Phosphorus P2O5 (Low < 10, Med 10-25, High > 25)
  available_k_kg_ha NUMERIC NOT NULL, -- Potassium K2O (Low < 108, Med 108-280, High > 280)
  
  -- Secondary & Micronutrients (ppm)
  sulfur_ppm NUMERIC,
  zinc_ppm NUMERIC,
  iron_ppm NUMERIC,
  boron_ppm NUMERIC,
  
  -- Soil Physical Properties
  bulk_density_g_cm3 NUMERIC,
  typical_infiltration_rate_cm_hr NUMERIC,
  water_holding_capacity_pct NUMERIC,
  
  centroid_geog GEOGRAPHY NOT NULL,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP()
)
CLUSTER BY state, district_name;

-- 2. Mandi APMC Commodity & Seasonal Sowing Calendar
CREATE TABLE IF NOT EXISTS `bhoomi_agri_intel.mandi_crop_calendar` (
  calendar_id STRING NOT NULL,
  state STRING NOT NULL,
  district_name STRING NOT NULL,
  season STRING NOT NULL, -- 'Kharif', 'Rabi', 'Zaid'
  crop_name STRING NOT NULL,
  sowing_window_start DATE NOT NULL,
  sowing_window_end DATE NOT NULL,
  recommended_npk_ratio STRING NOT NULL, -- e.g. "120:60:40"
  standard_yield_target_quintals_acre NUMERIC NOT NULL,
  prevailing_mandi_modal_price_inr_quintal NUMERIC,
  water_requirement_mm NUMERIC,
  drought_tolerance_rating STRING -- 'High', 'Moderate', 'Low'
)
PARTITION BY sowing_window_start
CLUSTER BY state, district_name, crop_name;

-- 3. Anonymized Farm Triage Logs (Geospatially Protected via ST_SnapToGrid)
CREATE TABLE IF NOT EXISTS `bhoomi_agri_intel.farm_triage_sessions` (
  session_id STRING NOT NULL,
  farmer_language STRING NOT NULL, -- 'hi', 'mr', 'pa', 'en'
  session_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP(),
  
  -- GEOSPATIAL PRIVACY: 1km grid snapping to prevent farm plot de-anonymization
  farm_grid_location GEOGRAPHY NOT NULL,
  district STRING,
  state STRING,
  
  -- Satellite Telemetry Snapshot at Diagnostic Time
  satellite_ndvi NUMERIC,
  satellite_ndwi NUMERIC,
  satellite_lst_celsius NUMERIC,
  
  -- Gemini Live Multimodal Physical Test Verdicts
  ribbon_test_verdict STRING,
  infiltration_rate_seconds NUMERIC,
  leaf_deficiency_symptom STRING,
  
  -- Final Deterministic Dosage Output (kg/acre)
  prescribed_urea_kg_acre NUMERIC,
  prescribed_dap_kg_acre NUMERIC,
  prescribed_mop_kg_acre NUMERIC,
  prescribed_gypsum_kg_acre NUMERIC,
  prescribed_fym_ton_acre NUMERIC,
  critical_lab_test_flag BOOLEAN
)
PARTITION BY DATE(session_timestamp)
CLUSTER BY state, district;

-- 4. Geospatial Privacy Ingestion Query (Example ST_SnapToGrid 0.01 deg ~= 1.1km)
-- INSERT INTO `bhoomi_agri_intel.farm_triage_sessions` (session_id, farmer_language, farm_grid_location, ...)
-- VALUES (
--   GENERATE_UUID(),
--   'hi',
--   ST_SnapToGrid(ST_GEOGPOINT(@user_longitude, @user_latitude), 0.01),
--   ...
-- );
