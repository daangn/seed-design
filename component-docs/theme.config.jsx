export default {
  logo: () => (
    <div style={{ display: "flex" }}>
      <svg width="60" height="25" viewBox="0 0 191 103" fill="none" xmlns="http://www.w3.org/2000/svg">
        <title>Seed Components</title>
        <path d="M52.976 43.2052H59.5514C59.4462 36.7613 53.9491 32.2111 45.8745 32.2111C37.8525 32.2111 31.882 36.6824 31.882 43.4156C31.882 48.8864 35.7746 52.0426 42.0345 53.6733L46.3479 54.778C50.4773 55.83 53.2127 57.0925 53.239 60.0909C53.2127 63.3523 50.1091 65.5354 45.6115 65.5617C41.2717 65.5354 37.9314 63.589 37.6158 59.6175H30.8825C31.1718 67.1398 36.8004 71.4007 45.6641 71.4007C54.7908 71.4007 60.0774 66.8242 60.0774 60.1435C60.0774 53.5155 54.6067 50.5171 48.9255 49.202L45.3485 48.2551C42.1923 47.5187 38.7993 46.2036 38.8256 42.9948C38.8519 40.1279 41.4295 38.0237 45.7693 38.05C49.8724 38.0237 52.6341 39.9175 52.976 43.2052ZM65.7586 70.822H90.6401V65.0356H72.5971V54.6201H89.2198V48.8864H72.5971V38.4709H90.5349V32.7371H65.7586V70.822ZM97.1103 70.822H121.992V65.0356H103.949V54.6201H120.571V48.8864H103.949V38.4709H121.887V32.7371H97.1103V70.822ZM141.402 70.822C152.975 70.822 159.84 63.6416 159.866 51.727C159.84 39.8649 152.975 32.7371 141.613 32.7371H128.462V70.822H141.402ZM135.3 64.8778V38.6813H141.245C149.004 38.655 153.028 42.9948 153.028 51.727C153.028 60.5117 149.004 64.9041 141.034 64.8778H135.3Z" fill="black"/>
        <path d="M3.99994 51.5C3.99994 78.8153 41.7528 99 95.5721 99C149.391 99 187.144 78.8153 187.144 51.5C187.144 24.1847 149.391 4 95.5721 4C41.7528 4 3.99994 24.1847 3.99994 51.5Z" stroke="black" strokeWidth="6.50685"/>
      </svg>

      <span style={{ fontWeight: 'lighter', marginLeft: "4px" }}>Components</span>
    </div>
  ),
  head: () => (
    <>
      <link rel="icon" type="image/png" sizes="160x160" href="/favicon.png" />
    </>
  ),
  project: {
    link: 'https://github.com/daangn/seed-design'
  },
  docsRepositoryBase: "https://github.com/daangn/seed-design/tree/main/component-docs",
  useNextSeoProps() {
    return {
      titleTemplate: "%s - Seed Components",
    };
  },
  sidebar: {
    titleComponent({ title, type }) {
      if (type === "separator") {
        return <span style={{ cursor: "default" }}>{title}</span>;
      }
      return <>{title}</>;
    },
    defaultMenuCollapseLevel: 2,
    toggleButton: true,
  },
  primaryHue: 35,
  primarySaturation: 100,
  darkMode: false,
  footer: {
    text: <span>© {new Date().getFullYear()} Seed Design.</span>,
  },
  toc: {
    backToTop: true,
  },
}
