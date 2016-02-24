define(['js/common/service'], function (service) {

    function dicServiceProxy() {

        //----根据parentKey获取字典
        this.getDicItems = function (parentKey) {
            return service.backgroundCall("Utilities/Dictionaries/" + parentKey, {}, "get");
        }
        /* var result = [];
         var sessionKey = parentKey + "_dicKey";
         var sessionValue = sessionStorage.getItem(sessionKey);
         if (sessionValue != null) {
             result = JSON.parse(sessionValue);
             var defer = $.Deferred();
             result.$promise = defer.promise();
             defer.resolve({ Data: result });
             return result;
         } else {
             service.backgroundCall("Utilities/Dictionaries/" + parentKey, {}, "get").$promise.then(function (response) {
                 if (response.Code === 0) {
                     sessionStorage.setItem(sessionKey, JSON.stringify(response.Data));
                     result = response.Data;
                 }
                 return result;
             });
         }
     }*/
    }

    return new dicServiceProxy();
});