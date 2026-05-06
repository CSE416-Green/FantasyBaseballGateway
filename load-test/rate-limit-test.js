import http from "k6/http";
import { Counter } from "k6/metrics";
import { check, sleep } from "k6";

/**
 * How to run a k6 script: https://grafana.com/docs/k6/latest/get-started/running-k6/
 */
const throttledRequests = new Counter("throttled_requests");

export const options = {
  vus: 1,
  duration: "1m",
};

const URL =
  "https://fantasybaseballgateway.onrender.com/api/";

const API_KEY = __ENV.API_KEY || "keyId:keySecret";

export default function () {
  const params = {
    headers: {
      Authorization: `apikey ${API_KEY}`,
    },
  };

  const res = http.get(URL, params);

  if (res.status === 429) {
    throttledRequests.add(1);
    console.log("a request is throttled")
  }

  check(res, {
    "not throttled (429)": (r) => r.status !== 429,
  });

  sleep(1);
}