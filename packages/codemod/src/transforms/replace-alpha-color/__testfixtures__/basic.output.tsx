// @ts-nocheck
import { vars } from "@seed-design/css/vars";

export const Component = () => {
  const styles = {
    overlay: {
      backgroundColor: vars.$color.palette.staticBlackAlpha200,
    },
    shadow: {
      backgroundColor: vars.$color.palette.staticBlackAlpha500,
    },
    darkOverlay: {
      backgroundColor: vars.$color.palette.staticBlackAlpha700,
    },
    lightOverlay: {
      backgroundColor: vars.$color.palette.staticWhiteAlpha300,
    },
  };

  return (
    <div>
      <div style={styles.overlay}>Light overlay</div>
      <div style={styles.shadow}>Shadow</div>
      <div style={styles.darkOverlay}>Dark overlay</div>
      <div style={styles.lightOverlay}>Light overlay</div>
      <div style={{ color: vars.$color.palette.staticBlackAlpha200 }}>Direct usage</div>
    </div>
  );
}; 