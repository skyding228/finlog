/*! finlog - v0.2.0 - 2017-03-09 Copyright (c) 2017 vfinance; Licensed MIT */
require("./app").register.controller("dashboardSubController",function($scope,$myhttp,$timeout){function hideDlg(){$("div.modal").hide()}function getTimeslotUnit(){return _timeslot.unit}function getChartData(url,type,dataProp,qryId){if(!$scope.closedChart[dataProp]){var timeRange=APP.getCurrentTimeRange(_timeslot);$scope.loading[dataProp]=!0,$myhttp(dataProp,$scope.loading).get(url,{type:type||getTimeslotUnit(),qryId:qryId,startTime:timeRange.startTime,endTime:timeRange.endTime},function(response){response.success===!1?alert(response.message):$scope[dataProp]=response},"JSON")}}function initDefaultCharts(){$scope.defaultCharts=[],$scope.defaultCharts.push({name:"基于字段统计日志总数",id:"halfHourData",dataUrl:countByFieldUrl,type:"appName",chartType:"countByField"}),$scope.defaultCharts.push({name:"最近半小时内每分钟的日志总数",id:"dateHistogramData",dataUrl:dateHistogramUrl,chartType:"dateHistogram"}),_.each($scope.defaultCharts,$scope.refreshDefaultChart)}function refreshChartById(id){var chart=_.find($scope.defaultCharts,function(c){return c.id===id});chart?$scope.refreshDefaultChart(chart):(chart=_.find($scope.customCharts,function(c){return c.id===id}),chart&&$scope.refreshCustomChart(chart))}function qryCustomCharts(){return $myhttp.get("/dashboard/getCustomChart")}function qryCustomChartsCB(data){$scope.customCharts=[],addCustomCharts(data)}function addCustomCharts(charts){var newCharts=[];_.each(charts,function(chart){var q=_.find($scope.customQrys,function(qry){return qry.id===chart.qryId});q?(chart.qryName=q.name,newCharts.push(chart),$scope.customCharts.push(chart)):delCustomChart(chart.id)}),getCustomChartsData(newCharts)}function delCustomChart(id){$myhttp.post("/dashboard/deleteCustomChart",JSON.stringify({id:id}),function(){console.info("删除图表成功!"+id)})}function getCustomChartsData(charts){charts.id&&(charts=[charts]),_.isArray(charts)&&_.each(charts,$scope.refreshCustomChart)}function qryCustomQrys(){return $myhttp.get("/logQry/loadQry")}function qryCustomQrysCB(data){$scope.customQrys=data}function queryFields(){return $myhttp.get("/logqry/fields")}$scope.showAdd=function(){$("#addDialog").show()},$scope.timeIntervals=[{name:"秒",value:"SECOND"},{name:"分钟",value:"MIN"},{name:"小时",value:"HOUR"},{name:"天",value:"DAY"}],$("button.btn.btn-box-tool").bind("click",hideDlg);var countByFieldUrl="/dashboard/countByField",dateHistogramUrl="/dashboard/datehistogram",_timeslot=APP.getCurrentTimeslot();$scope.$on(EVENT.CONDITION_CHANGE.broadcast,function(event,data){if(_timeslot=data,_timeslot.value=_timeslot.timeSlot,$scope.customCharts){var charts=$scope.customCharts;_.each(charts,function(chart){chart.timeslotUnit=null}),qryCustomChartsCB(charts)}_.each($scope.defaultCharts,function(chart){$scope.refreshDefaultChart(chart)})}),$scope.loading={},$scope.isSameTimeslotUnit=function(chartUnit,unit){return chartUnit?chartUnit==unit:getTimeslotUnit()==unit},$scope.getTimeslotUnit=getTimeslotUnit,$scope.halfHourData=[],$scope.dateHistogramData=[],$scope.customQrys=[],$scope.selectedQry="",$scope.customCharts=[],$scope.defaultCharts=[],$scope.closedChart=angular.store("closedChart")||{},$scope.refreshDefaultChart=function(chart){getChartData(chart.dataUrl,chart.type,chart.id)},$scope.refreshCustomChart=function(chart){getChartData(dateHistogramUrl,chart.timeslotUnit,chart.id,chart.qryId)},$scope.chartVisible=function(id,visible){$scope.closedChart[id]=!visible,angular.store("closedChart",$scope.closedChart)},$scope.reopenClosedChart=function(){var chartIds=_.keys($scope.closedChart);return $scope.closedChart={},angular.store("closedChart",$scope.closedChart),chartIds.length?void _.each(chartIds,function(id){refreshChartById(id)}):void alert("当前无已关闭的图表!")},$scope.addCustomChart=function(){var qryId=$scope.selectedQry,qry=_.find($scope.customQrys,function(c){return c.id===qryId});if(!qry)return void alert("不存在此查询!");var chart=_.find($scope.customCharts,function(c){return c.qryId===qryId});if(chart)return void alert("基于此查询的图表已经存在!");var custom={qryId:qryId};custom.id=_.makeUniqueId("chart"),custom.title="最近半小时每分钟的日志总数,基于查询:"+qry.name,hideDlg(),$myhttp.post("/dashboard/saveCustomChart",JSON.stringify(custom),function(data){console.info("保存自定义图表",data)}),addCustomCharts([custom])},$scope.closeCustomChart=function(id,del){if(del){if(!confirm("确定删除此图表吗?"))return;delCustomChart(id)}$scope.chartVisible(id,!1)},$.when(qryCustomQrys(),qryCustomCharts(),queryFields()).done(function(a,b,c){$scope.allFields=_.filter(c[0].allFields,function(f){return"message"!==f}),qryCustomQrysCB.apply(null,a),qryCustomChartsCB.apply(null,b),initDefaultCharts()})}),require("./app").register.controller("dashboardController",function($scope,$myhttp){$scope.tabPage="/public/views/dashboard_sub.html",$scope.tabConfig={newTabName:"仪表盘",tabs:[],templateUrl:$scope.tabPage,saveCallback:function(tab){var tagEntity={id:tab.id,name:tab.name,$$hashKey:tab.$$hashKey};$myhttp.post("/dashboard/tag/saveOrUpdate",JSON.stringify(tagEntity),function(response){response.success||alert(response.message)})},delCallback:function(tab){var tag={tagId:tab.id};$myhttp.post("/dashboard/tag/delete",JSON.stringify(tag),function(response){response.success||alert(response.message)})}}});