if (typeof console === "undefined" || DEBUG === false) {
  window.console = {
    log: function () {}
  };
}