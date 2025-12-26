var Feni = table.filter(ee.Filter.eq("NAME_2", "Feni"))
var Comilla = table.filter(ee.Filter.eq("NAME_2", "Comilla"))
var Noakhali = table.filter(ee.Filter.eq("NAME_2", "Noakhali"))

var aoi = Feni.merge(Comilla).merge(Noakhali)
Map.addLayer(aoi, {}, 'Area of Interest')

// Speckle filtering function
var applySpeckleFilter = function(image) {
  return image.focal_mean({
    radius: 50,
    units: 'meters',
    kernelType: 'circle'
  });
};

// Alternative speckle filter (more aggressive)
var applyLeeFilter = function(image) {
  return image.reduceNeighborhood({
    reducer: ee.Reducer.mean(),
    kernel: ee.Kernel.square(3) // 7x7 window
  });
};

var s1 = imageCollection
.filterBounds(aoi)
.filter(ee.Filter.eq('instrumentMode','IW'))
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VV'))
.filter(ee.Filter.listContains('transmitterReceiverPolarisation', 'VH'))
.filter(ee.Filter.eq('orbitProperties_pass', 'ASCENDING'))
.select('VH')

var beforeCollection = s1.filter(ee.Filter.date('2024-6-1', '2024-7-30'))
var afterCollection = s1.filter(ee.Filter.date('2024-8-1','2024-9-10'))

// Apply speckle filtering to collections
var beforeFiltered = beforeCollection.map(applySpeckleFilter)
var afterFiltered = afterCollection.map(applySpeckleFilter)

var before = beforeFiltered.mosaic().clip(aoi)
var after = afterFiltered.mosaic().clip(aoi)

var difference = before.divide(after)
var Threshold = 1.25
var flooded = difference.gt(Threshold).rename('Water').selfMask()

Map.addLayer(before, {min: -25, max: 0}, 'Before Floods', false);
Map.addLayer(after, {min: -25, max:0}, 'After Floods', false);
Map.addLayer(flooded, {min: 0, max: 1, palette: ['blue']}, 'Initial Flood Estimate')

var permanentwater = image.select('seasonality').gte(5).clip(aoi)
var flooded = flooded.where(permanentwater, 0).selfMask()

var slopeThreshold = 5
var terrain = ee.Algorithms.Terrain(image2)
var slope = terrain.select('slope')
var flooded = flooded.updateMask(slope.lt(slopeThreshold))

var ConnectedPixelThreshold = 8
var connections = flooded.connectedPixelCount(25)
var flooded = flooded.updateMask(connections.gt(ConnectedPixelThreshold))


Map.addLayer(flooded, {min: 0, max: 1, palette: ['orange']}, 'Flood Area')


var initialFlood = before.divide(after)
  .gt(Threshold)
  .rename('Initial_Water');


// Export final filtered flood layer (as before)
Export.image.toDrive({
  image: flooded,
  description: 'Flooded_Area_2024_Final',
  folder: 'GEE_Exports',
  fileNamePrefix: 'flooded_area_final',
  region: aoi,
  scale: 10,
  maxPixels: 1e13
});