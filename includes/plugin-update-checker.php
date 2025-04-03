<?php
/**
 * Plugin Update Checker for Simple Image Block
 *
 * This file handles checking GitHub for plugin updates.
 */

if (!class_exists('SimpleImageBlock_UpdateChecker')) {

    class SimpleImageBlock_UpdateChecker {
        private $plugin_slug;
        private $plugin_file;
        private $version;
        private $cache_key;
        private $cache_allowed;
        private $update_path;
        private $github_repo;
        private $github_user;

        /**
         * Class constructor.
         *
         * @param string $plugin_file The base plugin filepath
         * @param string $github_user The GitHub username
         * @param string $github_repo The GitHub repository name
         */
        public function __construct($plugin_file, $github_user, $github_repo) {
            $this->plugin_file = $plugin_file;
            $this->github_user = $github_user;
            $this->github_repo = $github_repo;

            $plugin_data = get_file_data($this->plugin_file, array('Version' => 'Version'));
            $this->version = $plugin_data['Version'];

            $this->plugin_slug = plugin_basename($this->plugin_file);
            $this->cache_key = 'simple_image_block_update_' . md5($this->plugin_slug);
            $this->cache_allowed = true;

            add_filter('pre_set_site_transient_update_plugins', array($this, 'check_update'));
            add_filter('plugins_api', array($this, 'plugin_info'), 10, 3);
            add_filter('upgrader_post_install', array($this, 'after_install'), 10, 3);
        }

        /**
         * Check for updates.
         *
         * @param object $transient Update transient.
         * @return object
         */
        public function check_update($transient) {
            if (empty($transient->checked)) {
                return $transient;
            }

            // Get the remote version
            $remote_version = $this->get_remote_version();

            if (is_wp_error($remote_version)) {
                return $transient;
            }

            // If a newer version is available, add the update
            if (version_compare($this->version, $remote_version, '<')) {
                $obj = new stdClass();
                $obj->slug = $this->plugin_slug;
                $obj->new_version = $remote_version;
                $obj->url = 'https://github.com/' . $this->github_user . '/' . $this->github_repo;
                $obj->package = 'https://github.com/' . $this->github_user . '/' . $this->github_repo . '/archive/refs/heads/main.zip';
                $transient->response[$this->plugin_slug] = $obj;
            }

            return $transient;
        }

        /**
         * Get repository info from GitHub.
         */
        public function get_repo_info() {
            if (!empty($this->github_info)) {
                return $this->github_info;
            }

            $response = wp_remote_get('https://api.github.com/repos/' . $this->github_user . '/' . $this->github_repo . '/releases/latest');

            if (is_wp_error($response)) {
                return false;
            }

            $body = wp_remote_retrieve_body($response);
            $this->github_info = json_decode($body);

            return $this->github_info;
        }

        /**
         * Get the remote version.
         */
        public function get_remote_version() {
            $info = $this->get_repo_info();

            if (!$info) {
                return new WP_Error('no_info', 'Could not get version info from GitHub');
            }

            if (isset($info->tag_name)) {
                // Remove 'v' prefix if it exists
                return preg_replace('/^v/', '', $info->tag_name);
            }

            return false;
        }

        /**
         * Add plugin information to the update API response.
         */
        public function plugin_info($res, $action, $args) {
            // Do nothing if this is not about getting plugin information
            if ($action !== 'plugin_information') {
                return $res;
            }

            // Do nothing if it is not our plugin
            if (plugin_basename($this->plugin_file) !== $args->slug) {
                return $res;
            }

            // Get repo info
            $remote = $this->get_repo_info();

            if (!$remote) {
                return $res;
            }

            $res = new stdClass();

            $res->name = 'Simple Image Block';
            $res->slug = $this->plugin_slug;
            $res->version = $this->get_remote_version();
            $res->tested = '6.6';
            $res->requires = '6.0';
            $res->author = 'The WordPress Contributors';
            $res->author_profile = 'https://github.com/' . $this->github_user;
            $res->download_link = 'https://github.com/' . $this->github_user . '/' . $this->github_repo . '/archive/refs/heads/main.zip';
            $res->trunk = 'https://github.com/' . $this->github_user . '/' . $this->github_repo . '/archive/refs/heads/main.zip';
            $res->requires_php = '7.2';
            $res->last_updated = isset($remote->published_at) ? date('Y-m-d', strtotime($remote->published_at)) : date('Y-m-d');

            $res->sections = array(
                'description' => isset($remote->body) ? $remote->body : 'A simple yet powerful image block for WordPress.',
                'installation' => 'Upload the plugin to your WordPress site and activate it.',
                'changelog' => isset($remote->body) ? $remote->body : 'See GitHub repository for changelog'
            );

            return $res;
        }

        /**
         * After installation cleanup.
         */
        public function after_install($response, $hook_extra, $result) {
            global $wp_filesystem;

            $install_directory = plugin_dir_path($this->plugin_file);
            $wp_filesystem->move($result['destination'], $install_directory);
            $result['destination'] = $install_directory;

            return $result;
        }
    }
}