window.dataLayer = window.dataLayer || [];
export function gtag() {
  // Replaced by rollup during build
  // eslint-disable-next-line no-undef
  if (__IS_PROD__) {
    window.dataLayer.push(arguments);
  }
}
