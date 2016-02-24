define(['angular-batch'], function () {
    var app = angular.module("app", ['jcs.angular-http-batch']);

    app.config([
           'httpBatchConfigProvider', function (httpBatchConfigProvider) {
               //register an endpoint that can accept a HTTP 1.1 batch request.
               httpBatchConfigProvider.setAllowedBatchEndpoint(
                   appConfig.apiServer,
                   appConfig.apiBatchServer,
                   {
                       maxBatchedRequestPerCall: 20,
                       minimumBatchSize: 2 //The smallest number of individual calls allowed in a batch request
                   });
           }
    ]);
    return app;
});