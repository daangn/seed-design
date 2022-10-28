exports.onRenderBody = ({ setBodyAttributes, setHtmlAttributes }) => {
  setHtmlAttributes({
    "data-seed": "auto",
    lang: "ko",
  });

  setBodyAttributes({
    "data-seed-scale-color": "light",
    "data-seed-scale-letter-spacing": "ios",
  });
};
