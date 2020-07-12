<?php
    add_action( 'wp_ajax_get_markers', 'get_markers' );
    add_action( 'wp_ajax_nopriv_get_markers', 'get_markers' );
    function get_markers(){
        global $wpdb;
        $tblname = 'markers';
        $wp_track_table = $wpdb->prefix . "$tblname ";

        $markers = $wpdb->get_results(
            "
            SELECT *
            FROM $wp_track_table
            "
        );
        echo json_encode($markers);
        wp_die();
    }
?>
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
    var map; 
    function initMap() { 
        map = new google.maps.Map(document.getElementById('map'), { center: { lat: -34.397, lng: 150.644 }, zoom: 8 });
    }   
</script>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAVVQYnHrWF-1budKNaSiA6mKkWzB055Ec&callback=initMap" async
    defer></script>
