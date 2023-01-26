interface IframeProps {
  src: string;
  height?: string;
}

const Iframe = ({ src, height = "100%" }: IframeProps) => {
  return (
    <iframe
      style={{
        border: "none",
        minHeight: "150px",
        height,
        width: "100%",
      }}
      src={src}
    />
  );
};

export default Iframe;
