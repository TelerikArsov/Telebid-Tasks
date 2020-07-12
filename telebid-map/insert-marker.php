<?php

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    echo "SAVING ENTRY";
    if (! isset($_POST['nonce_marker']) || ! wp_verify_nonce( $_POST['nonce_marker'], 'add_marker' )) {
         echo 'Security error. Do not process the form.';
         return;
    }

    insert_row();
}
function insert_row() {
    global $wpdb;
    $tblname = 'markers';
    $wp_track_table = $wpdb->prefix. "$tblname";
    $name = $_POST['location_name'];
    $lat = $_POST['lat'];
    $lng = $_POST['lng'];
    $wpdb->insert( $wp_track_table,
        array( 
            'name' => $name, 
            'lat' => $lat,
            'lng' => $lng
        ), 
        array( 
            '%s', 
            '%f',
            '%f' 
        ) );
}
?>

<form method="POST">
    <p>
        <label for="name">Name:</label>
        <input type="text" name="location_name" id="name">
    </p>
    <p>
        <label for="lat">Lat:</label>
        <input type="text" name="lat" id="lat">
    </p>
    <p>
        <label for="lng">Lng:</label>
        <input type="text" name="lng" id="lng">
    </p>
    <input type="submit" value="Submit">
    <?php wp_nonce_field( 'add_marker', 'nonce_marker' ); ?>
</form>