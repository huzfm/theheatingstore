// Shared field helpers for the measurement form. Visual treatment lives in
// measuring-up.css (.mu-field-*, .mu-readout-*) so every input reads as a
// precision instrument — large tabular numerals on a hairline rule, not a
// filled box. This file only keeps the bits that are simplest as plain JS.
import { C } from "@/components/sections/WhyChooseUs/theme";

export const helperTextStyle = {
  fontFamily: "var(--font-body)",
  fontSize: 12,
  color: C.mute,
  lineHeight: 1.55,
  margin: "8px 0 0",
};
