<?php
/**
 * Plugin Name:       Simple Image Block
 * Description:       Super simple image block, no wrapper.
 * Requires at least: 6.6
 * Requires PHP:      7.2
 * Version:           0.1.6
 * Author:            Ben Grave
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       simple-image-block
 *
 * @package CreateBlock
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

// Include the update checker
require_once plugin_dir_path( __FILE__ ) . 'includes/plugin-updater.php';

// Initialize the update checker with your GitHub repository details
if ( class_exists( 'Simple_Image_Block_Updater' ) ) {
	$plugin_data = get_file_data( __FILE__, array( 'Version' => 'Version' ) );
	new Simple_Image_Block_Updater(
		__FILE__,
		$plugin_data['Version'],
		'Benny-bad-love', // Replace with your GitHub username
		'simple-image-block'    // Your repository name
	);
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function create_block_simple_image_block_init() {
	register_block_type( __DIR__ . '/build' );
}
add_action( 'init', 'create_block_simple_image_block_init' );
