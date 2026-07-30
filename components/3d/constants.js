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
 * The part-unrolled roll shown in the product viewer.
 *
 * One 500 mm strip rather than the three the laid-floor scenes use, because a
 * roll is what the product *is* before it is laid: the cutaway shows a mat
 * installed, this shows a mat you could pick up.
 *
 * ROLL_LENGTH is ~1.6 m at this scene's scale, well short of the 6 m a real
 * 3 m² mat comes as. That is deliberate, and the reason is framing: the product
 * is presented upright, so its length is the dimension the viewport has least
 * of, and every extra metre of mat is paid for by pushing the camera back until
 * the 2 mm cable is sub-pixel. This length keeps the roll at a believable
 * 155 mm across, gives the flap ~0.66 m of visible mat, and holds the cable at
 * a bit over two pixels.
 */
export const ROLL_WIDTH = BAND_PITCH;
export const ROLL_LENGTH = 2.8;
export const ROLL_FLAT = 1.15;

/** Cardboard core, ~40 mm radius. Visible down the end of a real roll. */
export const ROLL_CORE = 0.07;

/**
 * Height gained per wrap, ~15 mm against a sheet that is really about 5 mm
 * thick. Exaggerated on purpose: at true thickness the turns pack into a solid
 * mass and the roll stops reading as something rolled up. The gap has to clear
 * the sheet's own build-up (scrim, cable, tape, ~0.012) or the wraps intersect.
 */
export const ROLL_THICKNESS = 0.026;

/**
 * Cable pitch by output, straight off the ProWarm product guide (p.42):
 *
 *   100 W/m²  → 100 mm   tile warming / secondary heat
 *   150 W/m²  →  65 mm   primary heat for most rooms
 *   200 W/m²  →  50 mm   conservatories and high heat loss
 *
 * CABLE_SPACING above predates that table and encodes 75 mm, picked as the
 * middle of the range suppliers advertise. It is left alone because the two
 * scroll-driven scenes are composed around it; the standalone product viewer,
 * which is explicitly a 150 W mat, uses the figure the guide actually gives.
 */
export const MAT_SPACING_150 = BAND_PITCH * (0.065 / 0.5);

/**
 * The cream reinforcement tape running the length of the roll.
 *
 * Three strips across the 500 mm width, applied *over* the cable so they hold
 * it to the scrim, and print-branded along their length. Easy to miss and the
 * single most identifying feature of the real product after the cable colour
 * itself: it is what breaks the serpentine into visible bays instead of an
 * uninterrupted field of loops.
 */
export const TAPE_WIDTH = BAND_PITCH * (0.035 / 0.5);
export const TAPE_OFFSETS = [-0.26, 0, 0.26];

/**
 * Element radius for the product viewer.
 *
 * True scale is unreachable here and it is worth being precise about why: at
 * 65 mm pitch a 2 mm cable is 32:1, and with the mat framed at ~80% of a
 * 1200px canvas that puts the cable under one pixel. The scroll scenes settle
 * at ~18:1. This is ~10:1 - bolder again than either, because the viewer's
 * camera sits closer, the cable is the subject rather than one element of a
 * stack, and the mat is now shown alone against a light ground where a hairline
 * element reads as a drawn line instead of as a round object.
 *
 * There is headroom for it: MAT_SPACING_150 is 0.113, so a 0.0116 diameter
 * still leaves ~0.10 of clear scrim between consecutive passes - a pitch to
 * diameter ratio of about 10:1, against the real product's 32:1. Bolder than
 * true, honestly so, and still nowhere near closing the serpentine up.
 */
export const MAT_CABLE_RADIUS = 0.0058;

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
