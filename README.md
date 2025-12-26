# GEE-Flash Flood-mapping
Flash Flood Inventory Mapping (Bangladesh, 2024)
Overview

This repository contains a Google Earth Engine (GEE) script for mapping flash-flood inundation during the 2024 monsoon in Bangladesh. The analysis focuses on flood-prone districts in the southeastern region and uses Sentinel-1 SAR data to detect short-duration flood events under cloud-covered conditions.

Study Area

The analysis covers Feni, Cumilla, and Noakhali districts, defined using administrative boundary data and merged into a single area of interest (AOI).

Data Sources

Sentinel-1 GRD SAR (COPERNICUS/S1_GRD)
IW mode, ASCENDING orbit
VH polarization

JRC Global Surface Water (v1.4) – for masking permanent water bodies

HydroSHEDS DEM – for terrain and slope-based filtering

Methodology

Data Selection

Pre-flood period: June–July 2024

Post-flood period: August–September 2024

Speckle Noise Reduction

Applied a focal mean speckle filter to reduce SAR noise in both pre- and post-flood image collections.

Flood Detection

Generated mosaicked SAR images for both periods.

Computed a backscatter ratio (pre-flood / post-flood).

Pixels with a ratio greater than 1.25 were classified as flooded.

Post-processing and Filtering

Removed permanent water bodies using the JRC seasonality layer.

Excluded areas with slope greater than 5° using DEM-derived terrain data.

Applied a connected pixel filter to remove isolated noise and retain spatially coherent flood areas.

Output

Final flash flood inundation map at 10 m spatial resolution.
Exported as a GeoTIFF for further GIS analysis and visualization.

Applications

Flash flood inventory mapping

Flood susceptibility and risk assessment

Disaster response and early recovery planning

Validation of flood models and satellite-based flood products

Notes

This script is designed for rapid flood mapping using SAR data and can be adapted for other flood events or regions by adjusting time periods, thresholds, and post-processing parameters.
