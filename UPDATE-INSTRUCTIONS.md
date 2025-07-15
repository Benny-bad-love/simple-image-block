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

# Pattern Overrides Update Instructions

## Recent Changes for Pattern Override Support

Based on the [Kinsta WordPress Block Patterns guide](https://kinsta.com/blog/wordpress-block-patterns/) and WordPress 6.6+ requirements, the following updates have been made to support pattern overrides:

### 1. Enhanced Block Configuration (block.json)

Added comprehensive support flags:
```json
"supports": {
    "html": false,
    "align": true,
    "interactivity": {
        "clientNavigation": true
    },
    "lock": false,
    "__experimentalBind": ["url", "alt", "title"],
    "__experimentalBindings": true,
    "__experimentalConnections": true
},
"usesContext": ["pattern/overrides", "core/pattern-overrides", "postId", "postType"]
```

### 2. Updated Block Registration (index.js)

Modified to spread all metadata properties:
```javascript
registerBlockType(metadata.name, {
    ...metadata,
    edit: Edit,
    save: Save,
});
```

### 3. Enhanced Edit Component (edit.js)

- Added `isSelected` prop for better editor integration
- Added pattern context detection
- Improved binding detection logic
- Added `InspectorAdvancedControls` for the "Enable overrides" button

### 4. Testing Pattern Overrides

**Important**: The "Enable overrides" button only appears in the correct context:

1. **Create a Synced Pattern**:
   - Add your Simple Image Block to a post/page
   - Configure all styling (borders, dimensions, etc.)
   - Select the block (or group of blocks)
   - Click the three-dots menu → "Create pattern"
   - Name it and ensure **"Synced"** is ON
   - Save

2. **Edit the Pattern**:
   - You'll see a purple outline around the pattern
   - Click the pattern's toolbar
   - Select **"Edit original"**
   - This opens the dedicated pattern editor

3. **Enable Overrides**:
   - In the pattern editor, select your Simple Image Block
   - Open the **Advanced** panel in the block inspector
   - The "Enable overrides" button should now appear
   - Click it and assign names to the overrideable attributes

### 5. How Synced Patterns Work

As explained in the Kinsta article:
- Synced patterns are stored as `wp_block` custom post types
- They use a reference system: `<!-- wp:block {"ref":512} /-->`
- Changes to synced patterns affect all instances
- Pattern overrides allow content changes per instance while maintaining design consistency

### 6. Troubleshooting

If the button still doesn't appear:

1. **Verify WordPress Version**: Must be 6.6+
2. **Check Context**: Must be in pattern editor via "Edit original"
3. **Clear Caches**: Browser and WordPress caches
4. **Test Core Blocks**: Try with Paragraph or Heading blocks first
5. **Console Check**: Look for JavaScript errors

### 7. Alternative Manual Method

If the UI button doesn't appear, you can manually add overrides in Code Editor:

```html
<!-- wp:create-block/simple-image-block {
    "metadata": {
        "bindings": {
            "url": {"source": "core/pattern-overrides"},
            "alt": {"source": "core/pattern-overrides"},
            "title": {"source": "core/pattern-overrides"}
        },
        "name": "Featured Image"
    }
} -->
```

### 8. Build and Deploy

After making changes:
```bash
npm run build
```

Then:
1. Deactivate and reactivate the plugin
2. Hard refresh the editor (Ctrl+Shift+R / Cmd+Shift+R)
3. Test in an incognito window if issues persist

## Key Insights from Kinsta Article

The Kinsta article emphasizes that:
- Synced patterns maintain design consistency across your site
- Pattern overrides (WordPress 6.6+) allow content flexibility within synced patterns
- The pattern system has been streamlined since WordPress 6.3
- Patterns are powerful tools for creating reusable, maintainable layouts

## Next Steps

1. Test the pattern overrides functionality thoroughly
2. Create example patterns showcasing the feature
3. Document common use cases for your users
4. Consider contributing patterns to the WordPress Pattern Directory

# Simple Image Block - Update Instructions

## Version 0.2.0 - Pattern Overrides Support

This version adds support for WordPress 6.6+ Pattern Overrides functionality, allowing the Simple Image Block to be used in synced patterns with customizable content.

## File Structure Cleanup (Important!)

**The plugin file structure has been cleaned up to follow WordPress best practices:**

### Source Files (src/)
- `src/block.json` - Block configuration (source)
- `src/edit.js` - Block editor component
- `src/save.js` - Block save function
- `src/index.js` - Block registration
- `src/style.scss` - Frontend styles (source)
- `src/editor.scss` - Editor styles (source)

### Build Files (build/)
- `build/block.json` - Compiled block configuration
- `build/index.js` - Compiled JavaScript
- `build/index.css` - Compiled editor styles
- `build/index-rtl.css` - RTL editor styles
- `build/style-index.css` - Compiled frontend styles
- `build/style-index-rtl.css` - RTL frontend styles
- `build/index.asset.php` - Asset dependencies

### Root Files
- `simple-image-block.php` - Main plugin file
- `block.json` - Main block registration (references build/)
- `readme.txt` - WordPress plugin readme
- Documentation files (PATTERN-OVERRIDES.md, etc.)

**Important:** WordPress loads the block from the `build/` directory. The main plugin file (`simple-image-block.php`) correctly points to `__DIR__ . '/build'` for block registration.

## What's New in 0.2.0

### Pattern Overrides Support
- Added `__experimentalRole: "content"` to `url`, `alt`, and `title` attributes in block.json
- Enhanced edit component to detect and handle bound attributes
- Added visual indicators when attributes are connected to pattern overrides
- Added title attribute support for better accessibility

### Enhanced Features
- **Title Attribute**: Added support for image title attribute (tooltip text)
- **Pattern Integration**: Full compatibility with WordPress 6.6+ synced patterns
- **Visual Feedback**: Clear indicators when attributes are bound to pattern overrides
- **Improved UX**: Disabled editing controls for bound attributes with helpful notices

## Testing Pattern Overrides

### Prerequisites
- WordPress 6.6 or higher
- Block theme (pattern overrides don't work with classic themes)
- Simple Image Block version 0.2.0+

### Step-by-Step Testing

1. **Create a Pattern with Simple Image Block**
   ```
   - Go to Appearance > Patterns
   - Click "Add New Pattern"
   - Add a Simple Image Block to your pattern
   - Configure the image, alt text, and title
   - Set pattern as "Synced"
   - Save the pattern
   ```

2. **Enable Pattern Overrides**
   ```
   - Edit your saved pattern
   - Select the Simple Image Block
   - In the block inspector, look for "Advanced" panel
   - Click "Enable overrides" button
   - Choose which attributes to allow overriding:
     ✓ Image URL (url)
     ✓ Alt text (alt)
     ✓ Title (title)
   - Update the pattern
   ```

3. **Use Pattern with Overrides**
   ```
   - Create/edit a post or page
   - Insert your synced pattern
   - Select the image block within the pattern
   - You should see override controls for enabled attributes
   - Customize the image URL, alt text, or title
   - The styling remains consistent across all pattern instances
   ```

### Troubleshooting

**"Enable overrides" button not showing:**
- Ensure you're using WordPress 6.6+
- Confirm you're using a block theme (not classic theme)
- Verify the pattern is set as "Synced"
- Check that Simple Image Block is version 0.2.0+
- Make sure you're editing the pattern itself, not an instance

**Pattern overrides not working:**
- Rebuild the plugin: `npm run build`
- Clear any caching plugins
- Check browser console for JavaScript errors
- Verify block.json has the correct attributes with `__experimentalRole: "content"`

**Visual indicators not showing:**
- The edit component detects bindings via `attributes.metadata.bindings`
- Bound attributes show notices and disabled controls
- This only appears when the block is actually bound in a pattern instance

## Development

### Building the Plugin
```bash
npm install
npm run build
```

### File Structure
- Source files are in `src/`
- Compiled files go to `build/`
- WordPress loads from `build/` directory
- Never edit files in `build/` directly - they get overwritten

### Key Implementation Details

1. **Block Configuration** (`src/block.json`):
   ```json
   "attributes": {
     "url": {
       "type": "string",
       "__experimentalRole": "content"
     },
     "alt": {
       "type": "string",
       "__experimentalRole": "content"
     },
     "title": {
       "type": "string",
       "__experimentalRole": "content"
     }
   }
   ```

2. **Pattern Binding Detection** (`src/edit.js`):
   ```javascript
   const metadata = attributes.metadata || {};
   const bindings = metadata.bindings || {};
   const isUrlBound = !!bindings.url;
   const isAltBound = !!bindings.alt;
   const isTitleBound = !!bindings.title;
   ```

3. **Save Function** (`src/save.js`):
   ```javascript
   <img
     src={url}
     alt={alt || ''}
     title={title || undefined}
     // ... other attributes
   />
   ```

## Version History

- **0.2.0**: Added Pattern Overrides support, title attribute, file structure cleanup
- **0.1.9**: Previous stable version

## Support

For issues or questions about pattern overrides:
1. Check WordPress version (6.6+ required)
2. Verify block theme usage
3. Ensure plugin is version 0.2.0+
4. Test with default WordPress themes first