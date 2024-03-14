import * as style from "./Iframe.css";

interface IframeProps {
  src: string;
  height?: string;
}

export const Iframe = ({ src, height = "100%" }: IframeProps) => {
  return (
    <iframe
      // NOTE: height 100% is not working in iframe
      style={{
        height,
      }}
      className={style.iframe}
      src={src}
    />
  );
};
