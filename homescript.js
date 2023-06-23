




// let inputYear = document.getElementById("inputYear");

// inputYear.addEventListener("change", updateMap);



// let polygonLayers = [];



// // Create a map centered on California
// var map = L.map('map').setView([36.7783, -119.4179], 6);

// // Create a tile layer for the map
// L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
// 	maxZoom: 18,
// }).addTo(map);

// // Define the boundaries for California
// var californiaBounds = [
// 	[32.5343, -124.4820], // Southwest coordinates
// 	[42.0095, -114.1312]  // Northeast coordinates
// ];

// // Restrict the map view to the boundaries of California
// map.setMaxBounds(californiaBounds);

// // Add a rectangle overlay to visualize the boundaries


// let fireData;

// let geoJsonLayer;


// fetchData();
// function fetchData(){
// 	fetch('https://services1.arcgis.com/jUJYIo9tSA7EHvfZ/arcgis/rest/services/California_Fire_Perimeters/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson')
// 		.then(function(response) {
// 			// Check if the response was successful
// 			if (response.ok) {
// 				return response.json(); // Parse the response as JSON
// 			} else {
// 				throw new Error('Error: ' + response.status);
// 			}
// 		})
// 		.then(function(data) {
// 			console.log(data);
// 			// Process the API response data
// 			geoJsonLayer = L.geoJSON(data, {
//           onEachFeature: function (feature, layer) {
//             // Create a pop-up for each fire polygon
//             layer.bindPopup("Year: " + feature.properties.YEAR_ + "<br>Fire Name: " + feature.properties.FIRE_NAME);
// 						polygonLayers.push(layer);
//           }
//         }).addTo(map);
			
// 			// Display the data on the map or perform any other operations
// 		})
// 		.catch(function(error) {
// 			// Handle any errors that occurred during the fetch
// 			console.log('Fetch Error:', error);
// 		});
	
// }

// function updateMap(){
// 	clearMap();
// 	fetch('https://services1.arcgis.com/jUJYIo9tSA7EHvfZ/arcgis/rest/services/California_Fire_Perimeters/FeatureServer/0/query?outFields=*&where=1%3D1&f=geojson')
// 		.then(function(response) {
// 			// Check if the response was successful
// 			if (response.ok) {
// 				return response.json(); // Parse the response as JSON
// 			} else {
// 				throw new Error('Error: ' + response.status);
// 			}
// 		})
// 		.then(function(data) {
// 			console.log(data);
// 			// Process the API response data
// 			 geoJsonLayer = L.geoJSON(data, {
// 					filter: filterData,
//           onEachFeature: function (feature, layer) {
//             // Create a pop-up for each fire polygon
//             layer.bindPopup("Year: " + feature.properties.YEAR_ + "<br>Fire Name: " + feature.properties.FIRE_NAME);
//           }
//         }).addTo(map);
			
// 			// Display the data on the map or perform any other operations
// 		})
// 		.catch(function(error) {
// 			// Handle any errors that occurred during the fetch
// 			console.log('Fetch Error:', error);
// 		});
// }



// function filterData(feature) {
//   // Apply your filtering criteria
//   // Return true to include the feature in the layer, or false to exclude it
// 	console.log(feature.properties.YEAR_);
//   return parseInt(feature.properties.YEAR_) == parseInt(inputYear.value);
// }


// function clearMap() {
//     map.removeLayer(geoJsonLayer);	
// }

