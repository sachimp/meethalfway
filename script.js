mapboxgl.accessToken = 'pk.eyJ1Ijoic2FjaGltcCIsImEiOiJjbHJsY2djdjAwcWF6MmxrMHIzeWFzZDA3In0.XM0nQyPa_WEraGkza439fA'; // Replace with your Mapbox access token


// Initialize the map
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [-0.1278, 51.5074], // Center on London
    zoom: 10
});

// Event listener for the "Find Halfway" button
document.getElementById('findHalfway').addEventListener('click', async function() {
    const address1 = document.getElementById('address1').value;
    const address2 = document.getElementById('address2').value;

    const coordinates1 = await getCoordinates(address1);
    const coordinates2 = await getCoordinates(address2);

    if (coordinates1 && coordinates2) {
        const halfwayPoint = findHalfwayPoint(coordinates1, coordinates2);
        const halfwayAddress = await reverseGeocode(halfwayPoint);
        placeMarker(halfwayPoint, halfwayAddress);
        map.flyTo({center: halfwayPoint, zoom: 9});
    } else {
        alert('Could not find locations. Please check the addresses.');
    }
});

async function getCoordinates(address) {
    const query = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(address)}.json?access_token=${mapboxgl.accessToken}`);
    const data = await query.json();
    return data.features[0]?.geometry.coordinates;
}

function findHalfwayPoint(coord1, coord2) {
    const lat = (coord1[1] + coord2[1]) / 2;
    const lng = (coord1[0] + coord2[0]) / 2;
    return [lng, lat];
}

async function reverseGeocode(coords) {
    const query = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${coords[0]},${coords[1]}.json?access_token=${mapboxgl.accessToken}`);
    const data = await query.json();
    return data.features[0]?.place_name;
}

function placeMarker(coordinates, address) {
    const marker = new mapboxgl.Marker()
        .setLngLat(coordinates)
        .addTo(map);

    const popup = new mapboxgl.Popup({ offset: 25 })
        .setText(address);

    marker.setPopup(popup);
}