"use strict";

const net = require("net");
const ip = require("ip");

const normalizeIp = (req) => {
  let clientIp = req.headers["x-forwarded-for"];

  if (clientIp) {
    clientIp = clientIp.split(",")[0].trim();
  } else if (req.ip) {
    clientIp = req.ip;
  } else if (req.connection && req.connection.remoteAddress) {
    clientIp = req.connection.remoteAddress;
  } else if (req.socket && req.socket.remoteAddress) {
    clientIp = req.socket.remoteAddress;
  }

  if (typeof clientIp === "string" && clientIp.startsWith("::ffff:")) {
    clientIp = clientIp.substr(7);
  }

  return clientIp;
};

const isCidr = (entry) => entry.includes("/");

const isAllowedIp = (clientIp, entry) => {
  if (!entry) return false;
  if (isCidr(entry)) {
    try {
      return ip.cidrSubnet(entry).contains(clientIp);
    } catch (err) {
      return false;
    }
  }

  return clientIp === entry;
};

module.exports =
  (actionParams = {}) =>
  (req, res, next) => {
    const allowedIPs = Array.isArray(actionParams.allowedIPs)
      ? actionParams.allowedIPs
      : typeof actionParams.allowedIPs === "string"
        ? [actionParams.allowedIPs]
        : [];

    const clientIp = normalizeIp(req);
    console.log(`Client IP: ${clientIp}`);

    if (!clientIp || !allowedIPs.length) {
      return res
        .status(actionParams.statusCode || 403)
        .send(actionParams.message || "Forbidden");
    }

    const allowed = allowedIPs.some((entry) => isAllowedIp(clientIp, entry));

    if (!allowed) {
      return res
        .status(actionParams.statusCode || 403)
        .send(actionParams.message || "Forbidden");
    }

    next();
  };
