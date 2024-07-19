//console.log('success')

// let locations=JSON.parse(document.querySelector('#map').getAttribute('data-location'));
// console.log(locations);

export function createMap(locations){


mapboxgl.accessToken ='pk.eyJ1IjoidXRrYXJzaDA5MDgiLCJhIjoiY2x5NnJ6azNvMDl0cDJsc2Rqc2gzd202diJ9.y8Sw1pq3bOGI6Sv1EpEHkw';
const map = new mapboxgl.Map({
	container: 'map', // container ID
	style: 'mapbox://styles/utkarsh0908/cly6u6bjp00du01pmbc94aber', // style URL
	center: [-118.2541722,34.043881], // starting position [lng, lat]
	zoom: 9, // starting zoom
})


const bound=new mapboxgl.LngLatBounds();

locations.forEach(loc=>{
    // this will create point the className marker is there in css
    // to add point only check css
    const el=document.createElement('div');
    el.className='marker';

    new mapboxgl.Marker({
        element:el,
        anchor:'bottom'
    })
    .setLngLat(loc.coordinates)
    .addTo(map)

    new mapboxgl.Popup({
        offset:30
    })
    .setLngLat(loc.coordinates)
    .setHTML(`<p> ${loc.day} Day ${loc.description}</p>`)
    .addTo(map)

    bound.extend(loc.coordinates)
}
)

map.fitBounds(bound,{
    padding:{
        top:200,
        left:100,
        right:100,
        bottom:200
    }
})

}

