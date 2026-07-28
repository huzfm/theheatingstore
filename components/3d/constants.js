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
 * How a real electric mat is built, and the scale that follows from it.
 *
 * A heating mat is not a cable freely snaked over a whole floor. It is a
 * 500 mm wide roll of fibreglass scrim with the cable factory-bonded to it at
 * a fixed pitch. You roll a strip out, and at the wall you cut the *mesh*
 * (never the cable), rotate the roll 180°, and run the next strip back
 * alongside. So a finished floor reads as parallel 500 mm strips with a
 * visible seam between them, and the cable turns back on itself every 500 mm
 * rather than running the full length of the room.
 *
 * That is the whole reason for MAT_BANDS: three strips across MAT_L pins the
 * scene's scale at one strip = 500 mm, i.e. 1 world unit ≈ 0.577 m, so the
 * mat represents roughly a 2.1 x 1.5 m section of floor. Every measurement
 * below is a real product figure converted through that factor.
 */
export const MAT_BANDS = 3;
export const BAND_PITCH = MAT_L / MAT_BANDS;

/**
 * Gap where the mesh was cut and the roll turned. Installers butt the strips
 * up but not perfectly, ~20 mm of bare substrate shows through.
 */
export const BAND_SEAM = 0.035;

/**
 * Cable spacing: 75 mm, the standard pitch on a 150 W/m² mat (suppliers
 * offer 50/60/65/75/100 mm; mats are almost always fixed at the middle of
 * that range).
 *
 * The previous 0.088 was a similar *number* but described a completely
 * different layout, one continuous serpentine whose straight passes ran the
 * full 3.6 unit width. Twenty-nine uninterrupted parallel lines 0.088 apart
 * is a hatch pattern, not a product; the eye reads long thin channels rather
 * than a cable. Broken into strips the same pitch reads correctly, because
 * each pass is now only ~0.6 long and terminates in a visible return bend.
 */
export const CABLE_SPACING = BAND_PITCH * (0.075 / 0.5);

/**
 * Distance the cable is held in from the long edge of the mesh, ~25 mm.
 * Real mats leave this border so the strip can be trimmed and so the return
 * bends are not sitting on the very edge of the scrim.
 */
export const CABLE_INSET = 0.043;

/** Bare scrim left at the ends of each strip, before the first pass. */
export const CABLE_MARGIN = 0.12;

/**
 * Cable radius.
 *
 * The ratio that matters is pitch-to-diameter, not either number alone. Real
 * mats use a 3 mm cable at 75 mm spacing, so ~25:1. True scale here would be
 * a 0.0026 radius, which is sub-pixel at this camera distance, so it is held
 * slightly above true scale at ~18:1. The old 0.005 against 0.088 was ~9:1,
 * and with the additive glow shell on top of it the halos of neighbouring
 * passes overlapped, which is what fused the run into a single glowing block
 * instead of reading as discrete cable.
 */
export const CABLE_RADIUS = 0.0036;
