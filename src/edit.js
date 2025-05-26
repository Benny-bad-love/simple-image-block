/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useBlockProps,
	InspectorControls,
	MediaUpload,
	MediaUploadCheck,
} from '@wordpress/block-editor';

/**
 * WordPress dependencies
 */
import { useSelect } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

import {
	PanelBody,
	Button,
	TextControl,
	SelectControl,
	RangeControl,
	__experimentalUnitControl as UnitControl,
	__experimentalBoxControl as BoxControl,
	ColorPalette,
	Spinner,
} from '@wordpress/components';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {Element} Element to render.
 */
export default function Edit({ attributes, setAttributes }) {
	const {
		url,
		alt,
		id,
		width,
		height,
		sizeUnit,
		maxWidth,
		maxHeight,
		maxWidthUnit,
		maxHeightUnit,
		minWidth,
		minHeight,
		minWidthUnit,
		minHeightUnit,
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
	} = attributes;

	const [isLoadingImage, setIsLoadingImage] = useState(false);
	const [availableSizes, setAvailableSizes] = useState([]);

	const blockProps = useBlockProps();

	// Fetch the full image data once the ID is available
	const imageData = useSelect((select) => {
		if (!id) return null;
		return select('core').getMedia(id);
	}, [id]);

	// Update available sizes when image data changes
	useEffect(() => {
		if (!imageData || !imageData.media_details || !imageData.media_details.sizes) {
			return;
		}

		// Define a size order priority (common WordPress sizes)
		const sizeOrder = {
			'thumbnail': 1,
			'medium': 2,
			'medium_large': 3,
			'large': 4,
			'1536x1536': 5,
			'2048x2048': 6,
			'full': 999 // Always last
		};

		// Build available sizes from the image data
		const sizes = Object.keys(imageData.media_details.sizes)
			.filter(sizeSlug => {
				// Filter out any sizes without proper data
				const sizeData = imageData.media_details.sizes[sizeSlug];
				return sizeData && sizeData.width && sizeData.height;
			})
			.map((sizeSlug) => {
				const sizeData = imageData.media_details.sizes[sizeSlug];
				// Format the label nicely, replace underscores with spaces and capitalize words
				let label = sizeSlug
					.replace(/_/g, ' ')
					.replace(/\b\w/g, char => char.toUpperCase());

				// Special case for numeric sizes
				if (/^\d+x\d+$/.test(sizeSlug)) {
					label = `${sizeSlug} (${sizeData.width}×${sizeData.height})`;
				} else {
					// Add dimensions to the label for better clarity
					label += ` (${sizeData.width}×${sizeData.height})`;
				}

				return {
					value: sizeSlug,
					label: label,
					order: sizeOrder[sizeSlug] || 50 // Default to middle priority if not in our order list
				};
			});

		// Add Full Size option with dimensions but only if not already present
		if (!sizes.some(size => size.value === 'full')) {
			sizes.push({
				value: 'full',
				label: `Full Size (${imageData.media_details.width}×${imageData.media_details.height})`,
				order: sizeOrder['full']
			});
		}

		// Sort by the defined order
		const sortedSizes = sizes.sort((a, b) => a.order - b.order);

		setAvailableSizes(sortedSizes);
	}, [imageData]);

	const onSelectImage = (media) => {
		if (!media || !media.url) {
			setAttributes({ url: undefined, id: undefined, alt: '' });
			return;
		}

		setIsLoadingImage(true);

		// Set the full size initially
		setAttributes({
			url: media.url,
			id: media.id,
			alt: media.alt || '',
			imageSize: 'full'
		});

		setIsLoadingImage(false);
	};

	const onSelectSize = (newSize) => {
		if (!id) return;

		setIsLoadingImage(true);

		// Update the imageSize attribute
		setAttributes({ imageSize: newSize });

		if (newSize === 'full') {
			// For full size, use the original URL
			if (imageData && imageData.source_url) {
				setAttributes({ url: imageData.source_url });
			}
		} else if (imageData && imageData.media_details && imageData.media_details.sizes && imageData.media_details.sizes[newSize]) {
			// For other sizes, use the size-specific URL
			setAttributes({ url: imageData.media_details.sizes[newSize].source_url });
		}

		setIsLoadingImage(false);
	};

	// Handle margin change with unit
	const updateMargin = (value, side) => {
		if (!value) {
			setAttributes({ [`margin${side}`]: '0' });
			return;
		}

		const numericValue = value.replace(/[^0-9.-]/g, '');
		const unit = value.replace(/[0-9.-]/g, '');

		setAttributes({
			[`margin${side}`]: numericValue,
			marginUnit: unit || 'px'
		});
	};

	// Update all margins at once
	const updateAllMargins = (value) => {
		if (!value) {
			setAttributes({
				marginTop: '0',
				marginRight: '0',
				marginBottom: '0',
				marginLeft: '0'
			});
			return;
		}

		const numericValue = value.replace(/[^0-9.-]/g, '');
		const unit = value.replace(/[0-9.-]/g, '');

		setAttributes({
			marginTop: numericValue,
			marginRight: numericValue,
			marginBottom: numericValue,
			marginLeft: numericValue,
			marginUnit: unit || 'px'
		});
	};

	const imageStyle = {
		width: width ? width + sizeUnit : undefined,
		height: height ? height + sizeUnit : undefined,
		maxWidth: maxWidth ? maxWidth + maxWidthUnit : undefined,
		maxHeight: maxHeight ? maxHeight + maxHeightUnit : undefined,
		minWidth: minWidth ? minWidth + minWidthUnit : undefined,
		minHeight: minHeight ? minHeight + minHeightUnit : undefined,
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

	const objectFitOptions = [
		{ value: 'fill', label: 'Fill' },
		{ value: 'contain', label: 'Contain' },
		{ value: 'cover', label: 'Cover' },
		{ value: 'none', label: 'None' },
		{ value: 'scale-down', label: 'Scale Down' },
	];

	const borderStyleOptions = [
		{ value: 'solid', label: 'Solid' },
		{ value: 'dashed', label: 'Dashed' },
		{ value: 'dotted', label: 'Dotted' },
		{ value: 'double', label: 'Double' },
		{ value: 'groove', label: 'Groove' },
		{ value: 'ridge', label: 'Ridge' },
		{ value: 'inset', label: 'Inset' },
		{ value: 'outset', label: 'Outset' },
	];

	const unitOptions = [
		{ value: 'px', label: 'px' },
		{ value: '%', label: '%' },
		{ value: 'em', label: 'em' },
		{ value: 'rem', label: 'rem' },
		{ value: 'vw', label: 'vw' },
		{ value: 'vh', label: 'vh' },
	];

	const borderRadiusUnitOptions = [
		{ value: 'px', label: 'px' },
		{ value: '%', label: '%' },
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Image Settings', 'simple-image-block')} initialOpen={true}>
					<MediaUploadCheck>
						<MediaUpload
							onSelect={onSelectImage}
							allowedTypes={['image']}
							value={id}
							render={({ open }) => (
								<Button
									onClick={open}
									variant="primary"
									className="editor-media-placeholder__button"
									style={{ marginBottom: '12px', display: 'block', width: '100%' }}
								>
									{!url ? __('Select Image', 'simple-image-block') : __('Replace Image', 'simple-image-block')}
								</Button>
							)}
						/>
					</MediaUploadCheck>
					{url && (
						<>
							{isLoadingImage ? (
								<div className="simple-image-block__loading">
									<Spinner />
									<p>{__('Loading image...', 'simple-image-block')}</p>
								</div>
							) : (
								availableSizes.length > 0 && (
									<div className="simple-image-block__size-selector">
										<SelectControl
											label={__('Image Size', 'simple-image-block')}
											value={imageSize || 'full'}
											options={availableSizes}
											onChange={onSelectSize}
											className="simple-image-block__size-select"
										/>
										<p className="simple-image-block__size-help">
											{__('Select the size of the image to display.', 'simple-image-block')}
										</p>
									</div>
								)
							)}

							<TextControl
								label={__('Alt Text', 'simple-image-block')}
								value={alt}
								onChange={(value) => setAttributes({ alt: value })}
								help={__('Alternative text describes your image to people who cannot see it.', 'simple-image-block')}
							/>

							{/* Width and Height controls in one row */}
							<div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
								<UnitControl
									label={__('Width', 'simple-image-block')}
									value={width ? width + sizeUnit : ''}
									onChange={(value) => {
										if (!value) {
											setAttributes({ width: undefined });
											return;
										}
										const numericValue = value.replace(/[^0-9.]/g, '');
										const unit = value.replace(/[0-9.]/g, '');
										setAttributes({
											width: numericValue,
											sizeUnit: unit || 'px'
										});
									}}
									units={[
										{ value: 'px', label: 'px' },
										{ value: '%', label: '%' },
										{ value: 'vw', label: 'vw' },
									]}
								/>
								<UnitControl
									label={__('Height', 'simple-image-block')}
									value={height ? height + sizeUnit : ''}
									onChange={(value) => {
										if (!value) {
											setAttributes({ height: undefined });
											return;
										}
										const numericValue = value.replace(/[^0-9.]/g, '');
										const unit = value.replace(/[0-9.]/g, '');
										setAttributes({
											height: numericValue,
											sizeUnit: unit || 'px'
										});
									}}
									units={[
										{ value: 'px', label: 'px' },
										{ value: '%', label: '%' },
										{ value: 'vh', label: 'vh' },
									]}
								/>
							</div>

							{/* Max Width and Max Height controls in another row */}
							<div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
								<UnitControl
									label={__('Max Width', 'simple-image-block')}
									value={maxWidth ? maxWidth + maxWidthUnit : ''}
									onChange={(value) => {
										if (!value) {
											setAttributes({ maxWidth: undefined });
											return;
										}
										const numericValue = value.replace(/[^\d.\-]/g, '');
										const unit = value.replace(/[0-9.\-]/g, '');
										setAttributes({
											maxWidth: numericValue,
											maxWidthUnit: unit || 'px'
										});
									}}
									units={[
										{ value: 'px', label: 'px' },
										{ value: '%', label: '%' },
										{ value: 'vw', label: 'vw' },
									]}
								/>
								<UnitControl
									label={__('Max Height', 'simple-image-block')}
									value={maxHeight ? maxHeight + maxHeightUnit : ''}
									onChange={(value) => {
										if (!value) {
											setAttributes({ maxHeight: undefined });
											return;
										}
										const numericValue = value.replace(/[^\d.\-]/g, '');
										const unit = value.replace(/[0-9.\-]/g, '');
										setAttributes({
											maxHeight: numericValue,
											maxHeightUnit: unit || 'px'
										});
									}}
									units={[
										{ value: 'px', label: 'px' },
										{ value: '%', label: '%' },
										{ value: 'vh', label: 'vh' },
									]}
								/>
							</div>

							{/* Min Width and Min Height controls in another row */}
							<div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
								<UnitControl
									label={__('Min Width', 'simple-image-block')}
									value={minWidth ? minWidth + minWidthUnit : ''}
									onChange={(value) => {
										if (!value) {
											setAttributes({ minWidth: undefined });
											return;
										}
										const numericValue = value.replace(/[^\d.\-]/g, '');
										const unit = value.replace(/[0-9.\-]/g, '');
										setAttributes({
											minWidth: numericValue,
											minWidthUnit: unit || 'px'
										});
									}}
									units={[
										{ value: 'px', label: 'px' },
										{ value: '%', label: '%' },
										{ value: 'vw', label: 'vw' },
									]}
								/>
								<UnitControl
									label={__('Min Height', 'simple-image-block')}
									value={minHeight ? minHeight + minHeightUnit : ''}
									onChange={(value) => {
										if (!value) {
											setAttributes({ minHeight: undefined });
											return;
										}
										const numericValue = value.replace(/[^\d.\-]/g, '');
										const unit = value.replace(/[0-9.\-]/g, '');
										setAttributes({
											minHeight: numericValue,
											minHeightUnit: unit || 'px'
										});
									}}
									units={[
										{ value: 'px', label: 'px' },
										{ value: '%', label: '%' },
										{ value: 'vh', label: 'vh' },
									]}
								/>
							</div>

							<TextControl
								label={__('Aspect Ratio', 'simple-image-block')}
								help={__('e.g., 16/9, 4/3, 1/1', 'simple-image-block')}
								value={aspectRatio || ''}
								onChange={(value) => setAttributes({ aspectRatio: value })}
							/>

							<SelectControl
								label={__('Object Fit', 'simple-image-block')}
								value={objectFit}
								options={objectFitOptions}
								onChange={(value) => setAttributes({ objectFit: value })}
							/>

							<div style={{ marginBottom: '24px' }}>
								<div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
									<span>{__('Border Radius', 'simple-image-block')}</span>
									<SelectControl
										value={borderRadiusUnit}
										options={borderRadiusUnitOptions}
										onChange={(unit) => setAttributes({ borderRadiusUnit: unit })}
										__nextHasNoMarginBottom
										style={{ width: '70px' }}
									/>
								</div>
								<RangeControl
									value={parseInt(borderRadius) || 0}
									onChange={(value) => setAttributes({ borderRadius: value.toString() })}
									min={0}
									max={borderRadiusUnit === 'px' ? 100 : 50}
									__nextHasNoMarginBottom
								/>
							</div>

							<PanelBody title={__('Border Settings', 'simple-image-block')} initialOpen={false}>
								<RangeControl
									label={__('Border Width', 'simple-image-block')}
									value={parseInt(borderWidth) || 0}
									onChange={(value) => setAttributes({ borderWidth: value.toString() })}
									min={0}
									max={20}
								/>

								<SelectControl
									label={__('Border Style', 'simple-image-block')}
									value={borderStyle}
									options={borderStyleOptions}
									onChange={(value) => setAttributes({ borderStyle: value })}
								/>

								<div>
									<p>{__('Border Color', 'simple-image-block')}</p>
									<ColorPalette
										value={borderColor}
										onChange={(color) => setAttributes({ borderColor: color })}
									/>
								</div>
							</PanelBody>

							<PanelBody title={__('Margin Settings', 'simple-image-block')} initialOpen={false}>
								<div>
									<UnitControl
										label={__('All Margins', 'simple-image-block')}
										value={marginTop === marginRight && marginTop === marginBottom && marginTop === marginLeft ?
											marginTop + marginUnit : ''}
										onChange={updateAllMargins}
										units={unitOptions}
										help={__('Set all margins at once or use individual controls below.', 'simple-image-block')}
									/>
								</div>

								<div style={{ marginTop: '16px' }}>
									<h3 className="simple-image-block__individual-margins-title">
										{__('Individual Margins', 'simple-image-block')}
									</h3>
									<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginTop: '8px' }}>
										<UnitControl
											label={__('Top', 'simple-image-block')}
											value={marginTop + marginUnit}
											onChange={(value) => updateMargin(value, 'Top')}
											units={unitOptions}
										/>
										<UnitControl
											label={__('Right', 'simple-image-block')}
											value={marginRight + marginUnit}
											onChange={(value) => updateMargin(value, 'Right')}
											units={unitOptions}
										/>
										<UnitControl
											label={__('Bottom', 'simple-image-block')}
											value={marginBottom + marginUnit}
											onChange={(value) => updateMargin(value, 'Bottom')}
											units={unitOptions}
										/>
										<UnitControl
											label={__('Left', 'simple-image-block')}
											value={marginLeft + marginUnit}
											onChange={(value) => updateMargin(value, 'Left')}
											units={unitOptions}
										/>
									</div>
								</div>
							</PanelBody>
						</>
					)}
				</PanelBody>
			</InspectorControls>

			{!url ? (
				<MediaUploadCheck>
					<MediaUpload
						onSelect={onSelectImage}
						allowedTypes={['image']}
						value={id}
						render={({ open }) => (
							<Button
								{...blockProps}
								onClick={open}
								variant="secondary"
								className={`${blockProps.className || ''} simple-image-block__upload-button`.trim()}
							>
								{__('Upload Image', 'simple-image-block')}
							</Button>
						)}
					/>
				</MediaUploadCheck>
			) : (
				<>
					{isLoadingImage ? (
						<div {...blockProps} className={`${blockProps.className || ''} simple-image-block__loading-container`.trim()}>
							<Spinner />
						</div>
					) : (
						<img
							{...blockProps}
							src={url}
							alt={alt}
							style={imageStyle}
							className={`${blockProps.className || ''} simple-image-block__image`.trim()}
						/>
					)}
				</>
			)}
		</>
	);
}
