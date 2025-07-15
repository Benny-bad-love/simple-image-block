=== Simple Image Block ===
Contributors:      The WordPress Contributors
Tags:              block, image, gutenberg, media, patterns, overrides
Tested up to:      6.8.1
Stable tag:        0.2.1
License:           GPL-2.0-or-later
License URI:       https://www.gnu.org/licenses/gpl-2.0.html

A simple, clean image block without unnecessary wrappers - just the image you need. Now with Pattern Overrides support!

== Description ==

Simple Image Block provides a straightforward way to add images to your WordPress content without extra div wrappers or unnecessary markup.

Features include:
* Clean image implementation with no extra wrapper elements
* **NEW: Pattern Overrides support** for WordPress 6.6+ synced patterns
* Extensive styling options including border, margin, and radius controls
* Aspect ratio control for consistent image displays
* Object fit properties (cover, contain, fill, etc.)
* Full support for alt text, title attributes, and accessibility
* Image size selection from WordPress media library sizes
* Width and height controls with various unit options
* Automatic updates from GitHub repository
* Lightweight and optimized for performance

**Pattern Overrides Support:**
With WordPress 6.6+, you can now use this block in synced patterns with overridable content. Create consistent layouts while allowing specific images, alt text, and titles to be customized per instance. Perfect for hero sections, product cards, team member profiles, and more!

For developers, this block follows WordPress coding standards and provides a clean, semantic HTML output that's easy to style with your theme.

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/simple-image-block` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress
3. Add the Simple Image Block in the block editor
4. The plugin will automatically check for updates from the GitHub repository

== Usage ==

1. In the WordPress block editor, click the + icon to add a new block
2. Search for "Simple Image" and select the Simple Image Block
3. Upload or select an image from your media library
4. Use the block toolbar and sidebar panel to customize the image display

**Using with Pattern Overrides (WordPress 6.6+):**
1. Create a synced pattern containing your Simple Image Block
2. Edit the original pattern and select your image block
3. In the Advanced panel, click "Enable overrides"
4. Choose which attributes to make overridable (URL, alt text, title)
5. Use the pattern across your site with customizable content per instance

See PATTERN-OVERRIDES.md for detailed instructions.

== Frequently Asked Questions ==

= How is this different from the core WordPress image block? =

The Simple Image Block provides a cleaner HTML output without wrapper divs, while offering advanced styling options like aspect ratio control, object-fit properties, and comprehensive border/margin settings in one convenient interface. It also supports Pattern Overrides for WordPress 6.6+.

= Can I control the size of the image? =

Yes! You can select from your WordPress-defined image sizes, or set custom width and height values with various unit options (px, %, em, rem, etc.).

= Does this block support responsive images? =

Yes, the block outputs standard img tags that will respond to your theme's responsive design.

= What are Pattern Overrides? =

Pattern Overrides (WordPress 6.6+) allow you to create synced patterns where the layout and styling stay consistent, but specific content like images can be customized per instance. This is perfect for creating reusable design components.

= Does this plugin support automatic updates? =

Yes! The plugin will check for updates from the GitHub repository automatically.

== Screenshots ==

1. Block settings showing image options
2. Border and margin controls
3. Example of a styled image with border radius and custom border
4. Pattern overrides in action with synced patterns

== Changelog ==

= 0.2.1 =
* Security update.

= 0.2.0 =
* Added Pattern Overrides support for WordPress 6.6+
* Added title attribute support for better accessibility
* Enhanced editor experience with binding indicators
* Improved block bindings compatibility
* Added comprehensive pattern overrides documentation

= 0.1.9 =
* Fixing the fields not saving correctly... again.

= 0.1.8 =
* Fix for fields not saving correctly

= 0.1.7 =
* Fix for the block not working in the editor

= 0.1.6 =
* Added support for min-width and min-height

= 0.1.5 =
* Fixed units not applying correctly on max-width and max-height

= 0.1.4 =
* Added support for custom max-width and max-height

= 0.1.3 =
* Added support for custom width and height

= 0.1.2 =
* New description for the plugin

= 0.1.1 =
* Added GitHub update checker

= 0.1.0 =
* Initial release
* Basic image functionality
* Styling options including border, radius, and margin controls
* Aspect ratio and object fit settings

== Upgrade Notice ==

= 0.2.0 =
Major update: Added Pattern Overrides support for WordPress 6.6+! Create synced patterns with customizable image content while maintaining consistent design.

= 0.1.9 =
Bug fixes for field saving issues.