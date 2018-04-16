/*! finlog - v0.2.0 - 2017-03-09 Copyright (c) 2017 vfinance; Licensed MIT */
require("app").register.controller("warnruleController",function($scope,$myhttp){function getSliderPosition(frequency,frequencyUnit){for(var index=-1,i=0;i<values.length;i++){var value=values[i];if(value.frequency==frequency&&value.frequencyUnit==frequencyUnit){index=i;break}}return-1!=index?$scope.sliderOpts.ticks[index]:null}function initQueryFields(){$myhttp.get("/logQry/loadQry",function(response){$scope.fields=[],response.length>0&&($scope.fields=response)})}function checkWarnData(data){if(!data.name)return alert("请输入名称!"),!1;if(!data.queryField)return alert("请选择查询!"),!1;if(!data.type)return alert("请选择告警类型!"),!1;if(!data.minutes)return alert("请输入正确的分钟数!"),!1;if(!data.comSymbol)return alert("请选择操作符!"),!1;if(!data.peakValue)return alert("请输入正确的比较值!"),!1;if("2"===data.type){if(!data.fieldName)return alert("请选择字段!"),!1;if(!data.dimension)return alert("请选择比较条件!"),!1}return data.email?!0:(alert("请输入正确的邮箱!"),!1)}function setDefaultStop(){$scope.stopObj=stopObjs[0]}function setDefaultWarning(){$scope.warningObj=warningObjs[0]}$scope.showEdit=!1,$scope.changeEdit=function(flag){$scope.showEdit=flag},$scope.confirmCfg={msg:"确认删除吗?",onclose:function(){},onconfirm:function(){var data={};$scope.warnRule?$scope.warnRule.id&&(data={id:$scope.warnRule.id}):data={id:$scope._id},data.id&&$myhttp.post("/warnRule/delete",JSON.stringify(data),function(response){response.success?$scope.searchByCondition():alert(response.message)},"JSON"),$scope.warnRule=null,$scope.sliderOpts.value=12.5,setDefaultStop(),setDefaultWarning()}};var values=[{frequency:1,frequencyUnit:"min"},{frequency:5,frequencyUnit:"min"},{frequency:10,frequencyUnit:"min"},{frequency:15,frequencyUnit:"min"},{frequency:30,frequencyUnit:"min"},{frequency:1,frequencyUnit:"hr"},{frequency:6,frequencyUnit:"hr"},{frequency:12,frequencyUnit:"hr"},{frequency:1,frequencyUnit:"day"}];$scope.sliderOpts={ticks:[0,12.5,25,37.5,50,62.5,75,87.5,100],ticks_positions:[0,12.5,25,37.5,50,62.5,75,87.5,100],ticks_labels:["1<br><small>min</small>","5<br><small>min</small>","10<br><small>min</small>","15<br><small>min</small>","30<br><small>min</small>","1<br><small>hr</small>","6<br><small>hr</small>","12<br><small>hr</small>","1<br><small>day</small>"],step:12.5,value:12.5,tooltip:"hide"},$scope.add=function(){$scope.warnRule=null,$scope.changeEdit(!0),$scope.sliderOpts.value=12.5,setDefaultStop(),setDefaultWarning()},$scope.changeQueryField=function(){for(var i=0;i<$scope.fields.length;i++)$scope.warnRule.queryField==$scope.fields[i].id&&($scope.allFields=$scope.fields[i].allFields)},$scope.saveOrUpdate=function(warnRule){var data={};if(warnRule)data=warnRule;else{var value=values[($scope.warnRule&&$scope.warnRule.frequency?$scope.warnRule.frequency:$scope.sliderOpts.value)/$scope.sliderOpts.step],data=$.extend($scope.warnRule,value);data.warning=$scope.warningObj==warningObjs[0]?!0:!1,data.disabled=$scope.stopObj==stopObjs[0]?!1:!0}checkWarnData(data)&&$myhttp.post("/warnRule/saveOrUpdate",JSON.stringify(data),function(response){response.success?($scope.searchByCondition($scope.currentPage),$scope.changeEdit(!1)):alert(response.message)})},$scope.searchByCondition=function(page){var condition={condition:$scope.condition,currentPage:page?page:1,pageSize:10};$scope.currentPage=condition.currentPage,$myhttp.post("/warnRule/search",JSON.stringify(condition),function(response){response.success?($scope.page=response.info,$scope.warnRules=$scope.page.records):alert(response.message)})},$scope.warnTypes=[{css:"display: block",tooltip:"日志数",value:"1"},{css:"display: none",tooltip:"字段统计",value:"2"}],$scope.dimensions=[{tooltip:"非重复数",value:"1"},{tooltip:"总数",value:"2"}],$scope.comSymbols=[{tooltip:">",value:"gt"},{tooltip:"<",value:"lt"},{tooltip:">=",value:"gte"},{tooltip:"<=",value:"lte"}],$scope.changeWarnType=function(type){for(var i=0;i<$scope.warnTypes.length;i++)$scope.warnTypes[i].value!=type?$scope.warnTypes[i].css="display: none":$scope.warnTypes[i].css="display: block"};var warningObjs=[{css:"fa-bell-slash-o",tooltip:"关闭告警"},{css:"fa-bell-o",tooltip:"打开告警"}],stopObjs=[{css:"fa-ban",tooltip:"停用"},{css:"fa-check-circle-o",tooltip:"启用"}];$scope.changeWarning=function(){$scope.warnRule&&$scope.warnRule.id?$scope.switchWarning($scope.warnRule):$scope.warningObj==warningObjs[0]?$scope.warningObj=warningObjs[1]:$scope.warningObj=warningObjs[0]},$scope.switchWarning=function(warnRule){warnRule.warning?warnRule.warning=!1:warnRule.warning=!0,$scope.saveOrUpdate(warnRule)},$scope.swithStop=function(warnRule){warnRule.disabled?warnRule.disabled=!1:warnRule.disabled=!0,$scope.saveOrUpdate(warnRule)},$scope.changeStop=function(){$scope.warnRule&&$scope.warnRule.id?$scope.swithStop($scope.warnRule):$scope.stopObj==stopObjs[0]?$scope.stopObj=stopObjs[1]:$scope.stopObj=stopObjs[0]},$scope.remove=function(_id){$scope._id=_id,$scope.confirmCfg.handle.show()},$scope.queryByPage=function(page){$scope.searchByCondition(page)},$scope.edit=function(warnRule){$scope.changeEdit(!0),$scope.warnRule=$.extend({},warnRule),$scope.sliderOpts.value=getSliderPosition(warnRule.frequency,warnRule.frequencyUnit),$scope.warnRule.disabled?$scope.stopObj=stopObjs[1]:$scope.stopObj=stopObjs[0],$scope.warnRule.warning?$scope.warningObj=warningObjs[0]:$scope.warningObj=warningObjs[1],$scope.changeWarnType(warnRule.type),$scope.changeQueryField()},initQueryFields(),setDefaultStop(),setDefaultWarning(),$scope.searchByCondition()});