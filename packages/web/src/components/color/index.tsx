import React from "react";
import { tokens } from "./tokens";
import styles from "./styles.module.css";

const hues = [
  "gray",
  "carrot",
  "blue",
  "red",
  "green",
  "yellow",
  "pink",
  "purple",
];

const scales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];

export default function Color(): JSX.Element {
  const [theme, setTheme] = React.useState("light");

  return (
    <section>
      <div className="container">
        <div className="row">
          <div>
            <div className={styles.cell}></div>
            {scales.map((scale) => (
              <div className={styles.cell} key={scale}>
                {scale}
              </div>
            ))}
          </div>
          {hues.map((hue) => (
            <div key={hue}>
              <div className={styles.cell} style={{ textAlign: "center" }}>
                {hue}
              </div>
              {scales.map((scale) => (
                <div
                  key={scale}
                  className={styles.cell}
                  style={{
                    backgroundColor:
                      tokens.$scale.color[`${hue}-${scale}`].values[
                        "theme-light"
                      ],
                  }}
                ></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
