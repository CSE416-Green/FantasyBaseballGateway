"use strict";

module.exports = {
  version: "1.0.0",
  init: function (context) {
    context.registerPolicy({
      name: "ip-whitelist",
      policy: require("./policies/ip-whitelist"),
    });
  },
};
