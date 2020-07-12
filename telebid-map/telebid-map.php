<?php
/*
Plugin Name: Map Telebid
*/
defined('ABSPATH') or die('Wrong way');
function create_marker_table(){
    global $wpdb;

    $tblname = 'markers';
    $wp_track_table = $wpdb->prefix . "$tblname ";
    if($wpdb->get_var("SHOW TABLES LIKE '$wp_track_table'" ) != $wp_track_table){
        $sql = "CREATE TABLE $wp_track_table ( 
                id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR( 60 ) NOT NULL,
                lat FLOAT( 10, 6 ) NOT NULL,
                lng FLOAT( 10, 6 ) NOT NULL
                ) ENGINE = MYISAM ;";
        require_once( ABSPATH . '/wp-admin/includes/upgrade.php' );
        dbDelta($sql);
    }

}

register_activation_hook( __FILE__, 'create_marker_table' );

add_action('admin_menu', 'telebid_map_setup_menu');

function telebid_map_setup_menu(){
    add_menu_page( 'Map Plugin Page', 'Map Plugin', 'manage_options', 'telebid-map', 'tb_init' );
}

function tb_init(){
    include(plugin_dir_path(__FILE__). "/insert-marker.php");
}

function tb_map($att) {
    wp_enqueue_script( 'ajax-script', plugins_url( '/js/map.js', __FILE__ ), array('jquery') );

    wp_localize_script( 'ajax-script', 'MyAjax',
            array( 'ajax_url' => admin_url( 'admin-ajax.php' ) ) );
    include(plugin_dir_path(__FILE__). "/views/map-view.php");
}
add_shortcode('telebid-map', 'tb_map');
?>