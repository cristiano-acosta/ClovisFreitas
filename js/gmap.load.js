$(document).ready(function(){
    var jmarkers = eval($.ajax({
	url:'markers.php',
	async: false
    }).responseText);
    $('#map').gMap(
    {
	maptype: 'ROADMAP', // 'HYBRID', 'SATELLITE', 'ROADMAP' or 'TERRAIN'
	zoom: 13,
	controls: {
	    panControl: false,
	    GSmallMapControl: true,
	    zoomControl: true,
	    zoomControlOptions: {
		style: google.maps.ZoomControlStyle.SMALL
	    },
	    mapTypeControl: true,
	    scaleControl: false,
	    streetViewControl: true,
	    overviewMapControl: true,
	    scrollwheel: true
	},
	markers: jmarkers
    }) 
})
