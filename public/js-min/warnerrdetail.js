/*! finlog - v0.2.0 - 2017-03-09 Copyright (c) 2017 vfinance; Licensed MIT */
require("app").register.controller("warnerrdetailController",function($scope,$myhttp){$scope.searchByCondition=function(page){var condition={name:$scope.name,startDate:$scope.startDate,endDate:$scope.endDate,currentPage:page?page:1,pageSize:10};$myhttp.post("/warnErrorInfo/search",JSON.stringify(condition),function(response){response.success?($scope.page=response.info,$scope.warnErrorInfos=$scope.page.records):alert(response.message)})},$scope.queryByPage=function(page){$scope.searchByCondition(page)},$scope.searchByCondition()});