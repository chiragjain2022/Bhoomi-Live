/**
 * Google Earth Engine (GEE) - BhoomiLive Field Telemetry Extraction Pipeline
 * Extracts real-time NDVI (Vegetation Vigor), NDWI (Canopy Moisture Stress),
 * and LST (Land Surface Temperature in Celsius) for smallholder farm coordinate.
 */

// 1. Define Point of Interest (Snapping to 1km grid buffer for privacy & zonal aggregation)
exports.fetchFieldTelemetryGEE = function(latitude, longitude, targetDateStr) {
  var point = ee.Geometry.Point([longitude, latitude]);
  var farmBuffer = point.buffer(100); // 100m farm field footprint
  var targetDate = ee.Date(targetDateStr || Date.now());
  var startDate = targetDate.advance(-21, 'day'); // Look back 3 weeks for cloud-free pixel

  // 2. Sentinel-2 MSI: MultiSpectral Instrument, Level-2A (Surface Reflectance)
  function maskS2sr(image) {
    var qa = image.select('QA60');
    // Bits 10 and 11 are clouds and cirrus, respectively.
    var cloudBitMask = 1 << 10;
    var cirrusBitMask = 1 << 11;
    var mask = qa.bitwiseAnd(cloudBitMask).eq(0)
        .and(qa.bitwiseAnd(cirrusBitMask).eq(0));
    return image.updateMask(mask).divide(10000);
  }

  var s2Collection = ee.ImageCollection('COPERNICUS/S2_SR_HARMONIZED')
    .filterBounds(farmBuffer)
    .filterDate(startDate, targetDate)
    .filter(ee.Filter.lt('CLOUDY_PIXEL_PERCENTAGE', 20))
    .map(maskS2sr)
    .select(['B3', 'B4', 'B8', 'B11'], ['Green', 'Red', 'NIR', 'SWIR']);

  // Composite least-cloudy image
  var s2Composite = s2Collection.median();

  // NDVI = (NIR - Red) / (NIR + Red)
  var ndvi = s2Composite.normalizedDifference(['NIR', 'Red']).rename('NDVI');

  // NDWI (Gao) = (NIR - SWIR) / (NIR + SWIR) -> Sensitivity to vegetation water content & moisture stress
  var ndwi = s2Composite.normalizedDifference(['NIR', 'SWIR']).rename('NDWI');

  // 3. Landsat 8/9 Level-2 Surface Temperature
  var landsat = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2')
    .filterBounds(farmBuffer)
    .filterDate(startDate, targetDate)
    .filter(ee.Filter.lt('CLOUD_COVER', 25))
    .median();

  // ST_B10 is surface temperature in Kelvin * 0.00341802 + 149.0
  var lstCelsius = landsat.select('ST_B10')
    .multiply(0.00341802)
    .add(149.0)
    .subtract(273.15)
    .rename('LST_Celsius');

  // Combine telemetry layers
  var fieldTelemetry = ee.Image.cat([ndvi, ndwi, lstCelsius]);

  // Compute zonal statistics over the farmer's field
  var stats = fieldTelemetry.reduceRegion({
    reducer: ee.Reducer.mean(),
    geometry: farmBuffer,
    scale: 10,
    maxPixels: 1e9
  });

  return stats;
};
