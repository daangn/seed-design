// @ts-nocheck
import { vars } from "@seed-design/css/vars";

export const Component = () => {
  const styles = {
    overlay: {
      backgroundColor: vars.$color.palette.staticBlackAlpha50,
    },
    shadow: {
      backgroundColor: vars.$color.palette.staticBlackAlpha200,
    },
    darkOverlay: {
      backgroundColor: vars.$color.palette.staticBlackAlpha500,
    },
    lightOverlay: {
      backgroundColor: vars.$color.palette.staticWhiteAlpha200,
    },
  };

  return (
    <div>
      <div style={styles.overlay}>Light overlay</div>
      <div style={styles.shadow}>Shadow</div>
      <div style={styles.darkOverlay}>Dark overlay</div>
      <div style={styles.lightOverlay}>Light overlay</div>
      <div style={{ color: vars.$color.palette.staticBlackAlpha50 }}>Direct usage</div>
    </div>
  );
}; 