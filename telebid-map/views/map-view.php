<style>
    #map {
        width: 100%;
        height: 900px;
        background-color: grey;
    }
    strong, text{
        color: black;
    }
    strong#title {
        font-size: 15px;
    }
</style>
<h3>Maps</h3>
<select id="filterOptions"><br><br>
<input type="text" id="filter" name="fname"><br><br>

<div id="map"></div>
<script> 
    map; 
    function initMap() { 
        map = new google.maps.Map(document.getElementById('map'), { center: { lat: -33.863276, lng: 151.207977 }, zoom: 4 });
    }   
</script>
<script src="https://maps.googleapis.com/maps/api/js?key=&callback=initMap" async
    defer></script>
