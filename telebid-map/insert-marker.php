<?php
global $first_time, $conn, $stmt, $servername, $username, $password, $dbname;
$servername = "localhost";
$username = "";
$password = ""; #own
$dbname = "";
$first_time = 1;
$conn = null;
$stmt = null;

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    if (! isset($_POST['nonce_marker']) || ! wp_verify_nonce( $_POST['nonce_marker'], 'add_marker' )) {
         echo 'Security error. Do not process the form.';
         return;
    }
    if(isset($_POST['alot'])) {
        insert_alot();
    }else{
        insert_row($_POST['location_name'], $_POST['lat'], $_POST['lng']);
    }
}
function insert_alot(){
    $ammount = $_POST['ammount'];
    if(!isset($ammount) || trim($ammount) == ''){
        echo 'VEry wrong';
    }else {
        $start = microtime(true);
        for($i = 0; $i < intval($ammount); $i++){
            $json = get_coords('default');
            $json = json_decode($json);
            $lat = $json->{'nearest'}->{'latt'};
            $lng = $json->{'nearest'}->{'longt'};
            $name = $json->{'threegeonames'};
            insert_row($name, $lat, $lng);
        }
        echo $time_elapsed_secs = microtime(true) - $start;
        global $conn, $stmt;
        if (isset($conn) && mysqli_ping($conn)){
            $stmt->close();
            $conn->close();
        }
    }
}

function get_coords($type)
{
    $data = null;
    if($type == 'wp-get'){
        $data = wp_remote_get('https://api.3geonames.org/?randomland=yes&json=1')['body'];
    }elseif($type == 'default'){
        $data = file_get_contents('https://api.3geonames.org/?randomland=yes&json=1');
    }
    return $data;
}

function insert_row_raw($name, $lat, $lng){
    global $first_time, $stmt, $conn;
    if($first_time == 1) {
        global $servername, $username, $password, $dbname;
        $conn = new mysqli($servername, $username, $password, $dbname);
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }
        $stmt = $conn->prepare("INSERT INTO wp_markers (name, lat, lng) VALUES (?, ?, ?)");
        $stmt->bind_param("sdd", $name, $lat, $lng);
        $first_time = 0;
    }
    $stmt->execute();  
}

function insert_row($name, $lat, $lng) {
    global $wpdb;
    $tblname = 'markers';
    $wp_track_table = $wpdb->prefix. "$tblname";
    if(!isset($name) || trim($name) == ''
    || !isset($lat) || (is_string($lat) && trim($lat)) == ''
    || !isset($lng) || (is_string($lng) && trim($lng)) == '')
    {
        echo "Wrong input";
    }
    else
    {
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
        #echo "SAVING ENTRY";
    }
    
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
    <input name="submit" type="submit" value="Submit">
    <?php wp_nonce_field( 'add_marker', 'nonce_marker' ); ?>
</form>

<form method="POST">
    <p>
        <label for="ammount">Ammount:</label>
        <input type="text" name="ammount" id="ammount">
    </p>
    <input name="alot" type="submit" value="Add a lot">
    <?php wp_nonce_field( 'add_marker', 'nonce_marker' ); ?>
</form>