/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {Element} Element to render.
 */
export default function save({ attributes }) {
	const {
		url,
		alt,
		width,
		height,
		sizeUnit,
		aspectRatio,
		objectFit,
		borderRadius,
		borderRadiusUnit,
		borderWidth,
		borderStyle,
		borderColor,
		imageSize,
		marginTop,
		marginRight,
		marginBottom,
		marginLeft,
		marginUnit,
		maxWidth,
		maxHeight,
	} = attributes;

	// Return null if no image URL is set
	if (!url) {
		return null;
	}

	const imageStyle = {
		width: width ? width + sizeUnit : undefined,
		height: height ? height + sizeUnit : undefined,
		maxWidth: maxWidth ? maxWidth + sizeUnit : undefined,
		maxHeight: maxHeight ? maxHeight + sizeUnit : undefined,
		aspectRatio: aspectRatio || undefined,
		objectFit: objectFit || undefined,
		borderRadius: borderRadius ? borderRadius + borderRadiusUnit : undefined,
		borderWidth: borderWidth ? borderWidth + 'px' : undefined,
		borderStyle: borderStyle || undefined,
		borderColor: borderColor || undefined,
		marginTop: marginTop ? marginTop + marginUnit : undefined,
		marginRight: marginRight ? marginRight + marginUnit : undefined,
		marginBottom: marginBottom ? marginBottom + marginUnit : undefined,
		marginLeft: marginLeft ? marginLeft + marginUnit : undefined,
	};

	// Apply the block props directly to the img tag
	const blockProps = useBlockProps.save();

	return (
		<img
			{...blockProps}
			src={url}
			alt={alt || ''}
			style={imageStyle}
			className={`${blockProps.className || ''} simple-image-block__image`.trim()}
		/>
	);
}
