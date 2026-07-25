/**
 * Shared scene dimensions.
 *
 * Kept in their own module so FloorLayers and HeatingSheetModel can both
 * read them without importing each other, the two files reference the same
 * footprint, and a direct import between them would be circular.
 */
export const MAT_W = 3.6;
export const MAT_L = 2.6;

/**
 * Cable spacing, in world units.
 *
 * Real mats run 50mm spacing (some 80mm) with a 1.8–3.4mm cable. The scene
 * frames roughly a 1.5m-wide section of mat, so 50mm scales to ~0.12 world
 * units, around 19 passes across the mat. The earlier 0.26 was about 5x too
 * sparse, which is what made it look like a schematic rather than a product.
 *
 * The cable radius is held slightly above true scale (a true 3mm cable would
 * be sub-pixel at this camera distance); the pass density does the realism
 * work, and density is what the eye actually reads.
 */
export const CABLE_SPACING = 0.088;

/**
 * Cable radius.
 *
 * The ratio that matters is gap-to-diameter, not either number alone. Real
 * mats sit near 15:1 (50mm spacing, ~3mm cable). At 0.016 the ratio was
 * about 3:1, which renders as glowing rope, the denser spacing actually
 * made it worse, because fat lines packed tighter just close up the gaps.
 * 0.005 against 0.088 spacing gives ~9:1, thin enough to read as cable while
 * staying above a pixel at this camera distance.
 */
export const CABLE_RADIUS = 0.005;
