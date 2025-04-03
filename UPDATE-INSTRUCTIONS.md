# Simple Image Block Update System Instructions

This plugin includes an automatic update system that uses your GitHub repository to check for and install updates. Follow these steps to set it up correctly:

## Initial Setup

1. Replace `YOUR_GITHUB_USERNAME` with your actual GitHub username in these files:
   - `simple-image-block.php`
   - `updates.json`
   - `plugin-info.json`

2. Commit these files to your GitHub repository:
   - `updates.json`
   - `plugin-info.json`

## When Releasing Updates

When you release a new version of the plugin:

1. Update the version number in:
   - `simple-image-block.php` (in the header comment)
   - `updates.json` (the "version" field)
   - `plugin-info.json` (the "version" field)

2. Update the changelog in:
   - `plugin-info.json` (in the "sections" > "changelog" field)
   - `readme.txt` (in the "Changelog" section)

3. Update the "last_updated" date in both JSON files.

4. Commit and push all changes to your GitHub repository.

## How It Works

The update system works as follows:

1. WordPress periodically checks for plugin updates.
2. Our updater hooks into this process and checks `updates.json` on your GitHub repository.
3. If the version in `updates.json` is newer than the installed version, WordPress will show an update is available.
4. When a user updates, WordPress will download the ZIP file specified in the `download_url` field.
5. The plugin-info.json file provides information for the plugin details view in the WordPress admin.

## Testing

To test the update system:

1. Install the plugin on a WordPress site.
2. Change the version in the JSON files to be higher than the installed version.
3. Wait for WordPress to check for updates (or force it by visiting the Updates page).
4. You should see an update available for the Simple Image Block plugin.

## Troubleshooting

If updates aren't working:

- Make sure the JSON files are accessible on GitHub (they need to be at the root of your 'main' branch).
- Check that all version numbers are properly formatted (e.g., "0.1.1").
- Verify the download URL points to a valid ZIP file.
- Check WordPress error logs for any issues with the update process.