   // 1. Create a map object.
    var mymap = L.map('map', {
        center: [37.8, -96],
        zoom: 5,
        maxZoom: 10,
        minZoom: 3,
        detectRetina: true // detect whether the sceen is high resolution or not.
    });

    // 2. Add a base map.
    L.tileLayer('https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png').addTo(mymap);

    // 3. Add airports GeoJSON Data
    // Null variable that will hold airports data
    var airports = null;

    // 4. build up a set of colors from colorbrewer's dark2 category
    var colors = chroma.scale('Dark2').mode('lch').colors(9);

    // 5. dynamically append style classes to this page. This style classes will be used for colorize the markers.
    for (i = 0; i < 9; i++) {
        $('head').append($("<style> .marker-color-" + (i + 1).toString() + " { color: " + colors[i] + "; font-size: 15px; text-shadow: 0 0 3px #ffffff;} </style>"));
    }

    // Get GeoJSON and put it on the map when it loads
    L.geoJson.ajax("assets/airports.geojson", {

        onEachFeature: function(feature, layer) {
            layer.bindPopup(feature.properties.AIRPT_NAME);
        },
        pointToLayer: function (feature, latlng) {
            var id = 0;
            if (feature.properties.CNTL_TWR == "Y") { id = 0; }
            else if (feature.properties.CNTL_TWR == "N")  { id = 1; }
            return L.marker(latlng, {icon: L.divIcon({className: 'fa fa-plane marker-color-' + (id + 1).toString() })});
        },
        attribution: 'Airports/Control Tower Data &copy; Data.gov | US State Boundaries &copy; Mike Bostock | Base Map &copy; Leaflet-providers | Made By Bryce Bradshaw'
    }).addTo(mymap);

    // 6. Set function for color ramp
    colors = chroma.scale('YlGnBu').colors(6); //colors = chroma.scale('OrRd').colors(5);

    function setColor(density) {
        var id = 0;
        if (density > 50) { id = 4; }
        else if (density > 30 && density <= 40) { id = 3; }
        else if (density > 20 && density <= 30) { id = 2; }
        else if (density > 10 &&  density <= 20) { id = 1; }
        else  { id = 0; }
        return colors[id];
    }

    // 7. Set style function that sets fill color.md property equal to airport count
    function style(feature) {
        return {
            fillColor: setColor(feature.properties.count),
            fillOpacity: 0.5,
            weight: 1,
            opacity: 1,
            color: '#636363',
            dashArray: '4'
        };
    }

    // 8. Add county polygons
    L.geoJson.ajax("assets/us-states.geojson", {
        style: style
    }).addTo(mymap);

    // 9. Create Leaflet Control Object for Legend
    var legend = L.control({position: 'topright'});

    // 10. Function that runs when legend is added to map
    legend.onAdd = function () {

        // Create Div Element and Populate it with HTML
        var div = L.DomUtil.create('div', 'legend');
        div.innerHTML += '<b># Airports Per State</b><br />';
        div.innerHTML += '<i style="background: ' + colors[5] + '; opacity: 0.5"></i><p>50+</p>';
        div.innerHTML += '<i style="background: ' + colors[4] + '; opacity: 0.5"></i><p>40-49</p>';
        div.innerHTML += '<i style="background: ' + colors[3] + '; opacity: 0.5"></i><p>30-39</p>';
        div.innerHTML += '<i style="background: ' + colors[2] + '; opacity: 0.5"></i><p>20-29</p>';
        div.innerHTML += '<i style="background: ' + colors[1] + '; opacity: 0.5"></i><p> 10-19</p>';
        div.innerHTML += '<i style="background: ' + colors[0] + '; opacity: 0.5"></i><p> 0- 9</p>';
        div.innerHTML += '<hr><b>Control Tower<b><br />';
        div.innerHTML += '<i class="fa fa-plane marker-color-1"></i><p> Yes</p>';
        div.innerHTML += '<i class="fa fa-plane marker-color-2"></i><p> No</p>';;
        // Return the Legend div containing the HTML content
        return div;
    };

    // 11. Add a legend to map
    legend.addTo(mymap);

    // 12. Add a scale bar to map
    L.control.scale({position: 'bottomleft'}).addTo(mymap);
