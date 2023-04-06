module.exports = async function (context, req) {
  var LaunchDarkly = require("launchdarkly-node-server-sdk");
  const sdkKey = "sdk-acdc19c9-4a8c-41f9-82e8-119b99d229ee";
  // Set featureFlagKey to the feature flag key you want to evaluate.
  const featureFlagKey = "LaunchDarklyTestString";
  const ldClient = LaunchDarkly.init(sdkKey);
  let responseMessage = "";

  // Set up the context properties. This context should appear on your LaunchDarkly contexts dashboard
  const context = {
    kind: "user",
    key: "example-context-key",
    name: req.query.name || "",
  };

  context.log("JavaScript HTTP trigger function processed a request.");
  ldClient
    .waitForInitialization()
    .then(function () {
      context.log("SDK successfully initialized!");
      ldClient.variation(
        featureFlagKey,
        context,
        false,
        function (err, flagValue) {
          context.log(
            "Feature flag '" +
              featureFlagKey +
              "' is " +
              flagValue +
              " for this context"
          );
          if (flagValue) {
            responseMessage = "Hello World!";
          } else {
            responseMessage = "Goodnight World!";
          }
          // Here we ensure that the SDK shuts down cleanly and has a chance to deliver analytics
          // events to LaunchDarkly before the program exits. If analytics events are not delivered,
          // the context properties and flag usage statistics will not appear on your dashboard. In a
          // normal long-running application, the SDK would continue running and events would be
          // delivered automatically in the background.
          ldClient.flush(function () {
            ldClient.close();
          });
        }
      );
    })
    .catch(function (error) {
      context.log("SDK failed to initialize: " + error);
    });

  context.res = {
    // status: 200, /* Defaults to 200 */
    body: responseMessage,
  };
};
