<style>
    #map {
        width: 100%;
        height: 400px;
        background-color: grey;
    }
</style>
<h3>Maps</h3>
<div id="map"></div>
<script> 
    map; 
    function initMap() { 
        map = new google.maps.Map(document.getElementById('map'), { center: { lat: -34.397, lng: 150.644 }, zoom: 8 });
    }   
</script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAVVQYnHrWF-1budKNaSiA6mKkWzB055Ec&callback=initMap" async
    defer></script>
