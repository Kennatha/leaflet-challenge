const pastDay="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"

d3.json(pastDay).then(function(data){
    console.log(data);
});

function createMap(earthquakes) {

    // Create the tile layer that will be the background of our map.
    var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });
  
  
    // Create a baseMaps object to hold the streetmap layer.
    var baseMaps = {
      "Street Map": streetmap
    };
  
    // Create an overlayMaps object to hold the earthquakes layer.
    var overlayMaps = {
      "Earthquakes": earthquakes
    };
  
    // Create the map object with options.
    var map = L.map("map", {
      center: [37.09, -120.71],
      zoom: 4,
      layers: [streetmap, earthquakes]
    });
  
    // Create a layer control, and pass it  baseMaps and overlayMaps. Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(map);

    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var labels=[];
    var categories=[-10,10,30,50,70,90]

      for (var i = 0; i < categories.length; i++) {
        div.innerHTML +=
            labels.push("<li style=\"background-color: " + chooseColor(categories[i]) + "\"></li> " +
            categories[i] + (categories[i + 1] ? '&ndash;' + categories[i + 1] : '+'));}
        div.innerHTML = "<ul>" + labels.join("") + "</ul>";
        
      return div;};

    legend.addTo(map);
  }
  // Create function to assign color based on depth. Color scale found at https://colorbrewer2.org/#type=sequential&scheme=GnBu&n=6. Methodology found at https://stackoverflow.com/questions/43613560/changing-marker-colour-based-on-property-in-leaflet
  function chooseColor(depth){
    if (depth >=90){return "#081d58";}
    else if (depth >=70){return "#253494";}
    else if (depth >=50) {return "#225ea8";}
    else if (depth >=30) {return "#1d91c0";}
    else if (depth >=10) {return "#41b6c4";}
    else {return "#7fcdbb";}
  }
  function createMarkers(response) {
  
    // Pull the earthquake details.
    var quakeData = response.features;
  
    // Initialize an array to hold the markers.
    var quakeMarkers = [];
  
    // Loop through the earthquake array.
    for (var index = 0; index < quakeData.length; index++) {
      var quake = quakeData[index];
  
      // For each earthquake, create a circle, and bind a popup with the details.
      var quakeMarker = L.circle([quake.geometry.coordinates[1], quake.geometry.coordinates[0]],{
        fillOpacity: .9,
        fillColor: chooseColor(quake.geometry.coordinates[2]),
        color: chooseColor(quake.geometry.coordinates[2]),
        radius: quake.properties.mag * 20000})
        .bindPopup("<h3>Magnitude: " + quake.properties.mag + "<h3><h3>Location: " + quake.properties.place + "<h3><h3>Depth: " + quake.geometry.coordinates[2] + "</h3>");
  
      // Add the circle to the earthquake array.
      quakeMarkers.push(quakeMarker);
    }
  
    // Create a layer group that's made from the earthquake array, and pass it to the createMap function.
    createMap(L.layerGroup(quakeMarkers));
  }
  
  
  // Call API to get information. Call createMarkers when it completes.
  d3.json(pastDay).then(createMarkers);

  