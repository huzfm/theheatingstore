// Shared field styles for the measurement form. Inputs and the read-only
// "receipt" fields intentionally stay on a light/cream surface (not
// dark-glass) so they read as "type here" against the dark page.
import { C } from "@/components/sections/WhyChooseUs/theme";

export const INPUT_TEXT = "#2C1810";

export const labelStyle = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontSize: 11,
  fontWeight: 700,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: C.amberLt,
  marginBottom: 8,
};

export const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.94)",
  border: "1.5px solid rgba(255,255,255,0.65)",
  borderRadius: 12,
  padding: "13px 16px",
  fontSize: 14.5,
  color: INPUT_TEXT,
  fontFamily: "var(--font-body)",
  outline: "none",
  boxSizing: "border-box",
  boxShadow: "0 4px 20px rgba(232,140,42,0.14), 0 1px 3px rgba(0,0,0,0.3)",
};

export const readOnlyStyle = {
  ...inputStyle,
  background: "linear-gradient(135deg, rgba(196,98,58,0.09), rgba(232,140,42,0.09)), rgba(255,255,255,0.94)",
  border: "1.5px solid rgba(196,98,58,0.3)",
  color: C.amber,
  fontWeight: 600,
  fontFamily: "var(--font-heading)",
  fontSize: 17,
  textAlign: "center",
  boxShadow: "0 4px 22px rgba(232,140,42,0.2), 0 1px 3px rgba(0,0,0,0.3)",
};

export const helperTextStyle = {
  fontFamily: "var(--font-body)",
  fontSize: 12,
  color: C.soft,
  lineHeight: 1.55,
  margin: "8px 0 0",
};

export const errorTextStyle = {
  fontFamily: "var(--font-body)",
  fontSize: 12,
  color: "#ff8a75",
  lineHeight: 1.5,
  margin: "8px 0 0",
  fontWeight: 600,
};
