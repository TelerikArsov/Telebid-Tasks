<style>
    #map {
        width: 100%;
        height: 900px;
        background-color: grey;
    }
</style>
<h3>Maps</h3>
<div id="map"></div>
<script> 
    map; 
    function initMap() { 
        map = new google.maps.Map(document.getElementById('map'), { center: { lat: -33.863276, lng: 151.207977 }, zoom: 8 });
    }   
</script>
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_KEY&callback=initMap" async
    defer></script>
