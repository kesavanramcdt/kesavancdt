let inputLevel = document.getElementById("inputLevel");
let inputPov = document.getElementById("inputPov");
let descripP = document.getElementById("descripP");
let descripC = document.getElementById("descripC");

inputLevel.addEventListener("change", updateMapC);
inputPov.addEventListener("change", updateMapP);

let polygonLayersC = [];
let polygonLayersP = [];

let storeC = {};
let storeP = {};

// Create a map centered on California
var mapC = L.map("mapCrime").setView([36.7783, -119.4179], 6);
var mapP = L.map("mapPoverty").setView([36.7783, -119.4179], 6);

// Create a tile layer for the map
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
}).addTo(mapC);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 18,
}).addTo(mapP);

// Define the boundaries for California
var californiaBounds = [
  [32.5343, -124.482], // Southwest coordinates
  [42.0095, -114.1312], // Northeast coordinates
];

// Restrict the map view to the boundaries of California
mapC.setMaxBounds(californiaBounds);
mapP.setMaxBounds(californiaBounds);

// Add a rectangle overlay to visualize the boundaries

let fireData;

let geoJsonLayerC;
let geoJsonLayerP;

fetchData();
function fetchData() {
  fetch(
    "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/2022_County_Health_Rankings/FeatureServer/2/query?where=STATE+%3D+%27CA%27&objectIds=&time=&geometry=&geometryType=esriGeometryMultipoint&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=v043_rawvalue%2C+county&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token="
  )
    .then(function (response) {
      // Check if the response was successful
      if (response.ok) {
        return response.json(); // Parse the response as JSON
      } else {
        throw new Error("Error: " + response.status);
      }
    })
    .then(function (data) {
      console.log(data);
      // Process the API response data
      geoJsonLayerC = L.geoJSON(data, {
        style: styleFeatureC,
        onEachFeature: function (feature, layer) {
          layer.on("mouseover", function (e) {
            // Open the popup on mouseover
            this.setStyle({ fillOpacity: 1 });
          });
          layer.on("mouseout", function (e) {
            // Close the popup on mouseout
            this.setStyle({ fillOpacity: 0.5 });
          });
          layer.on("click", function (e) {
            clickedCounty(feature.properties.county);
            descripC.innerHTML = `County Name: ${
              feature.properties.county
            }<br>Violent Crimes per 100,000: ${parseInt(
              feature.properties.v043_rawvalue
            )}`;
          });
          storeC[feature.properties.county] =
            (feature.properties.v043_rawvalue / 100000) * 100;
          // Create a pop-up for each fire polygon
          layer.bindPopup(
            "# of Violent Crimes per 100,000: " +
              parseInt(feature.properties.v043_rawvalue) +
              "<br>County Name: " +
              feature.properties.county
          );
          polygonLayersC.push(layer);
        },
      }).addTo(mapC);
      // Display the data on the map or perform any other operations
    })
    .catch(function (error) {
      // Handle any errors that occurred during the fetch
      console.log("Fetch Error:", error);
    });

  fetch(
    "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/ACS_Poverty_by_Age_Boundaries/FeatureServer/1/query?where=State+%3D+%27California%27&objectIds=&time=&geometry=&geometryType=esriGeometryPolygon&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=B17020_calc_pctPovE%2C+NAME&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token="
  )
    .then(function (response) {
      // Check if the response was successful
      if (response.ok) {
        return response.json(); // Parse the response as JSON
      } else {
        throw new Error("Error: " + response.status);
      }
    })
    .then(function (data) {
      console.log(data);
      // Process the API response data
      geoJsonLayerP = L.geoJSON(data, {
        style: styleFeatureP,
        onEachFeature: function (feature, layer) {
          // Create a pop-up for each fire polygon
          layer.on("click", function (e) {
            clickedCounty(feature.properties.NAME);
            descripP.innerHTML = `County Name: ${
              feature.properties.NAME
            }<br> Poverty Rate: ${parseInt(
              feature.properties.B17020_calc_pctPovE
            )}%`;
          });
          layer.on("mouseover", function (e) {
            // Open the popup on mouseover
            this.setStyle({ fillOpacity: 1 });
          });
          layer.on("mouseout", function (e) {
            // Close the popup on mouseout
            this.setStyle({ fillOpacity: 0.5 });
          });
          storeP[feature.properties.NAME] = parseInt(
            feature.properties.B17020_calc_pctPovE
          );
          layer.bindPopup(
            "Poverty Rate: " +
              parseInt(feature.properties.B17020_calc_pctPovE) +
              "%" +
              "<br>County Name: " +
              feature.properties.NAME
          );
          polygonLayersP.push(layer);
        },
      }).addTo(mapP);
    })
    .catch(function (error) {
      // Handle any errors that occurred during the fetch
      console.log("Fetch Error:", error);
    });
  console.log(storeC);
  console.log(storeP);
}

function styleFeatureP(feature) {
  return {
    fillColor: filterColorP(feature),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.5,
  };
}

function styleFeatureC(feature) {
  return {
    fillColor: filterColorC(feature),
    weight: 2,
    opacity: 1,
    color: "white",
    dashArray: "3",
    fillOpacity: 0.5,
  };
}

function filterColorP(feature) {
  const rate = feature.properties.B17020_calc_pctPovE;

  return rate > 21
    ? "#4f093d"
    : rate > 18
    ? "#822c4c"
    : rate > 12
    ? "#cf6669"
    : rate > 6
    ? "#e2a294"
    : "fef8d1";
}

function updateMapC() {
  clearMapC();
  fetch(
    "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/2022_County_Health_Rankings/FeatureServer/2/query?where=STATE+%3D+%27CA%27&objectIds=&time=&geometry=&geometryType=esriGeometryMultipoint&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=v043_rawvalue%2C+county&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token="
  )
    .then(function (response) {
      // Check if the response was successful
      if (response.ok) {
        return response.json(); // Parse the response as JSON
      } else {
        throw new Error("Error: " + response.status);
      }
    })
    .then(function (data) {
      console.log(data);
      // Process the API response data
      geoJsonLayerC = L.geoJSON(data, {
        style: styleFeatureC,
        filter: filterDataRate,
        onEachFeature: function (feature, layer) {
          layer.on("mouseover", function (e) {
            // Open the popup on mouseover
            this.setStyle({ fillOpacity: 1 });
          });
          layer.on("mouseout", function (e) {
            // Close the popup on mouseout
            this.setStyle({ fillOpacity: 0.5 });
          });
          layer.on("click", function (e) {
            clickedCounty(feature.properties.county);
            descripC.innerHTML = `County Name: ${
              feature.properties.county
            }<br>Violent Crimes per 100,000: ${parseInt(
              feature.properties.v043_rawvalue
            )}`;
          });
          // Create a pop-up for each fire polygon
          layer.bindPopup(
            "# of Violent Crimes per 100,000: " +
              parseInt(feature.properties.v043_rawvalue) +
              "<br>County Name: " +
              feature.properties.county
          );
        },
      }).addTo(mapC);

      // Display the data on the map or perform any other operations
    })
    .catch(function (error) {
      // Handle any errors that occurred during the fetch
      console.log("Fetch Error:", error);
    });
}

function updateMapP() {
  clearMapP();
  fetch(
    "https://services.arcgis.com/P3ePLMYs2RVChkJx/ArcGIS/rest/services/ACS_Poverty_by_Age_Boundaries/FeatureServer/1/query?where=State+%3D+%27California%27&objectIds=&time=&geometry=&geometryType=esriGeometryPolygon&inSR=&spatialRel=esriSpatialRelIntersects&resultType=none&distance=0.0&units=esriSRUnit_Meter&relationParam=&returnGeodetic=false&outFields=B17020_calc_pctPovE%2C+NAME&returnGeometry=true&returnCentroid=false&featureEncoding=esriDefault&multipatchOption=xyFootprint&maxAllowableOffset=&geometryPrecision=&outSR=&defaultSR=&datumTransformation=&applyVCSProjection=false&returnIdsOnly=false&returnUniqueIdsOnly=false&returnCountOnly=false&returnExtentOnly=false&returnQueryGeometry=false&returnDistinctValues=false&cacheHint=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&having=&resultOffset=&resultRecordCount=&returnZ=false&returnM=false&returnExceededLimitFeatures=true&quantizationParameters=&sqlFormat=none&f=pgeojson&token="
  )
    .then(function (response) {
      // Check if the response was successful
      if (response.ok) {
        return response.json(); // Parse the response as JSON
      } else {
        throw new Error("Error: " + response.status);
      }
    })
    .then(function (data) {
      console.log(data);
      // Process the API response data
      geoJsonLayerP = L.geoJSON(data, {
        filter: filterDataPoverty,
        style: styleFeatureP,
        onEachFeature: function (feature, layer) {
          layer.on("mouseover", function (e) {
            // Open the popup on mouseover
            this.setStyle({ fillOpacity: 1 });
          });
          layer.on("mouseout", function (e) {
            // Close the popup on mouseout
            this.setStyle({ fillOpacity: 0.5 });
          });
          // Create a pop-up for each fire polygon
          layer.on("click", function (e) {
            clickedCounty(feature.properties.NAME);
            descripP.innerHTML = `County Name: ${
              feature.properties.NAME
            }<br> Poverty Rate: ${parseInt(
              feature.properties.B17020_calc_pctPovE
            )}%`;
          });
          layer.bindPopup(
            "Poverty Rate: " +
              parseInt(feature.properties.B17020_calc_pctPovE) +
              "%" +
              "<br>County Name: " +
              feature.properties.NAME
          );
          polygonLayersP.push(layer);
        },
      }).addTo(mapP);

      // Display the data on the map or perform any other operations
    })
    .catch(function (error) {
      // Handle any errors that occurred during the fetch
      console.log("Fetch Error:", error);
    });
}

function filterDataRate(feature) {
  // Apply your filtering criteria
  // Return true to include the feature in the layer, or false to exclude it
  return (
    parseInt(feature.properties.v043_rawvalue) > parseInt(inputLevel.value)
  );
}

function filterDataPoverty(feature) {
  console.log(feature);
  return (
    parseInt(feature.properties.B17020_calc_pctPovE) >= parseInt(inputPov.value)
  );
}

function clearMapC() {
  mapC.removeLayer(geoJsonLayerC);
}
function clearMapP() {
  mapP.removeLayer(geoJsonLayerP);
}

function filterColorC(feature) {
  let num = parseInt(feature.properties.v043_rawvalue);
  console.log(num);

  return num > 500
    ? "#4f093d"
    : num > 350
    ? "#822c4c"
    : num > 200
    ? "#cf6669"
    : num > 120
    ? "#e2a294"
    : "fef8d1";
}

function filterDataState(feature) {
  return feature.properties.STATE == "CA";
}

var ctxC = document.getElementById("myChartC").getContext("2d");
var myChartC = new Chart(ctxC, {
  type: "bar",
  data: {
    labels: ["Click County"],
    datasets: [
      {
        label: "Percentage of Crimes per 100,000",
        data: [0.5],
        backgroundColor: ["rgba(200, 74, 15, 0.6)"],
        borderColor: ["rgba(200, 74, 15, 1)"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 1,
        ticks: {
          stepSize: 0.1,
        },
      },
    },
  },
});

var ctxP = document.getElementById("myChartP").getContext("2d");
var myChartP = new Chart(ctxP, {
  type: "bar",
  data: {
    labels: ["Click County"],
    datasets: [
      {
        label: "Poverty Rate",
        data: [1],
        backgroundColor: ["rgba(206, 102, 105, 0.6)"],
        borderColor: ["rgba(206, 102, 105, 0.6)"],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 24,
        ticks: {
          stepSize: 2,
        },
      },
    },
  },
});

myChartC.resize(500, 500);
myChartP.resize(500, 500);

function clickedCounty(countyName) {
  // Sample data (percentages)

  let value1 = storeC[countyName];
  value1 = "" + value1;
  value1 = parseFloat(value1.substring(0, 4));
  console.log(value1);
  let value2 = storeP[countyName];
  myChartC.data.datasets[0].data[0] = value1;
  myChartC.data.labels = [countyName];
  myChartP.data.datasets[0].data[0] = value2;
  myChartP.data.labels = [countyName];

  myChartC.update();
  myChartP.update();
}
