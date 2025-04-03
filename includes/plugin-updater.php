<?php
/**
 * Plugin Updater for Simple Image Block
 *
 * Checks GitHub for updates and handles the update process.
 */

if (!class_exists('Simple_Image_Block_Updater')) {

    class Simple_Image_Block_Updater {

        private $current_version;
        private $plugin_slug;
        private $plugin_file;
        private $github_user;
        private $github_repo;
        private $updates_url;
        private $plugin_info_url;

        /**
         * Class constructor.
         *
         * @param string $plugin_file The plugin file path
         * @param string $current_version The current plugin version
         * @param string $github_user GitHub username
         * @param string $github_repo GitHub repository name
         */
        public function __construct($plugin_file, $current_version, $github_user, $github_repo) {
            $this->plugin_file = $plugin_file;
            $this->plugin_slug = basename(dirname($plugin_file));
            $this->current_version = $current_version;
            $this->github_user = $github_user;
            $this->github_repo = $github_repo;

            $this->updates_url = "https://raw.githubusercontent.com/{$github_user}/{$github_repo}/main/updates.json";
            $this->plugin_info_url = "https://raw.githubusercontent.com/{$github_user}/{$github_repo}/main/plugin-info.json";

            // Add filters for the WordPress update system
            add_filter('pre_set_site_transient_update_plugins', array($this, 'check_for_update'));
            add_filter('plugins_api', array($this, 'plugin_info'), 10, 3);
            add_filter('upgrader_package_options', array($this, 'upgrader_package_options'));
        }

        /**
         * Check for updates.
         *
         * @param object $transient Update transient.
         * @return object
         */
        public function check_for_update($transient) {
            if (empty($transient->checked)) {
                return $transient;
            }

            $response = wp_remote_get($this->updates_url);
            if (is_wp_error($response)) {
                return $transient;
            }

            $data = json_decode(wp_remote_retrieve_body($response), true);
            if ($data && isset($data['version']) && version_compare($data['version'], $this->current_version, '>')) {
                $plugin_basename = plugin_basename($this->plugin_file);

                $transient->response[$plugin_basename] = (object) array(
                    'new_version' => $data['version'],
                    'package'     => $data['download_url'],
                    'slug'        => $this->plugin_slug,
                    'plugin'      => $plugin_basename,
                );
            }

            return $transient;
        }

        /**
         * Get plugin information for the WordPress updates screen.
         *
         * @param false|object $result
         * @param string $action
         * @param object $args
         * @return false|object
         */
        public function plugin_info($result, $action, $args) {
            if ($action !== 'plugin_information' || !isset($args->slug) || $args->slug !== $this->plugin_slug) {
                return $result;
            }

            $response = wp_remote_get($this->plugin_info_url);
            if (is_wp_error($response)) {
                return $result;
            }

            $plugin_info = json_decode(wp_remote_retrieve_body($response));
            if (!$plugin_info) {
                return $result;
            }

            return (object) array(
                'slug' => $args->slug,
                'name' => isset($plugin_info->name) ? $plugin_info->name : 'Simple Image Block',
                'version' => isset($plugin_info->version) ? $plugin_info->version : '',
                'author' => isset($plugin_info->author) ? $plugin_info->author : '',
                'requires' => isset($plugin_info->requires) ? $plugin_info->requires : '',
                'tested' => isset($plugin_info->tested) ? $plugin_info->tested : '',
                'last_updated' => isset($plugin_info->last_updated) ? $plugin_info->last_updated : '',
                'sections' => isset($plugin_info->sections) ? (array) $plugin_info->sections : array(
                    'description' => 'A simple yet powerful image block for WordPress.',
                    'changelog' => 'See GitHub repository for changelog'
                ),
                'download_link' => isset($plugin_info->download_link) ? $plugin_info->download_link : '',
                'banners' => isset($plugin_info->banners) ? (array) $plugin_info->banners : array(),
            );
        }

        /**
         * Ensure the plugin folder name is correct after update.
         *
         * @param array $options
         * @return array
         */
        public function upgrader_package_options($options) {
            if (isset($options['hook_extra']['plugin']) && $options['hook_extra']['plugin'] === plugin_basename($this->plugin_file)) {
                $options['destination'] = WP_PLUGIN_DIR . '/' . $this->plugin_slug;
                $options['clear_destination'] = true; // Overwrite the files
            }
            return $options;
        }
    }
}