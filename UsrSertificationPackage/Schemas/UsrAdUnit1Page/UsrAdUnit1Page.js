define("UsrAdUnit1Page", ["ProcessModuleUtilities","UsrConstants"], function(ProcessModuleUtilities, UsrConstants) {
	return {
		entitySchemaName: "UsrAdUnit",
		attributes: {
			"UsrResponsible": {
				"dataValueType": Terrasoft.DataValueType.LOOKUP,
				"lookupListConfig": {
					"filters": [
						function() {
							var filterGroup = Ext.create("Terrasoft.FilterGroup");
							filterGroup.add("IsEmployee",
								Terrasoft.createColumnFilterWithParameter(
									Terrasoft.ComparisonType.EQUAL,
									"Type", UsrConstants.Contact.Type.Employee));
							return filterGroup;
						}
					]
				}
			}
        },
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "UsrAdUnitFile",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "UsrAdUnit"
				}
			},
			"UsrReleaseDetail": {
				"schemaName": "UsrReleaseDetail",
				"entitySchemaName": "UsrRelease",
				"filter": {
					"detailColumn": "UsrAdUnit",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{}/**SCHEMA_BUSINESS_RULES*/,
		methods: {
          	init: function(){
              	this.callParent(arguments);
                this.subscriptionFunction();
			},
          	subscriptionFunction: function() {
         	 	Terrasoft.ServerChannel.on(Terrasoft.EventName.ON_MESSAGE,
        	  	this.onReloadDetailMessage, this);
          	},
          	onReloadDetailMessage: function(scope, message) {
    	   	   	if (!message || message.Header.Sender !== "UsrAddReleasesToAdBlock") {
          			return;
          		}
              	else {
                  	this.updateDetail({"detail": "UsrReleaseDetail"}); 
          		}
          	},
			asyncValidate: function(callback, scope) {
                this.callParent([function(response) {
                    if (!this.validateResponse(response)) {
                        return;
                    }
                    Terrasoft.chain(
                        function(next) {
                            this.periodicityValidation(function(response) {
                                if (this.validateResponse(response)) {
                                    next();
                                }
                            }, this);
                        },
                        function() {
                            callback.call(scope, response);
                        },
                    this);
                }, this]);
			},
          
			periodicityValidation: function(callback, scope) {
            	var result = {success: true};
            	var periodicity = scope.get("UsrPeriodicity");
              	var isActive = scope.get("UsrIsActive");
            	if(periodicity.value.toUpperCase() == UsrConstants.Periodicity.Hourly && isActive){
                    var esq = Ext.create("Terrasoft.EntitySchemaQuery", {
                        rootSchemaName: "UsrAdUnit"
                    });
                    esq.addColumn("UsrPeriodicity", "UsrPeriodicity");
                    esq.addColumn("UsrIsActive", "UsrIsActive");
                    var esqFilter1 = esq.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, 
                                                                            "UsrPeriodicity", 
                                                                            UsrConstants.Periodicity.Hourly);
                    var esqFilter2 = esq.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, 
                                                                            "UsrIsActive", 
                                                                            true);
                    var esqFilter3 = esq.createColumnFilterWithParameter(Terrasoft.ComparisonType.NOT_EQUAL, 
                                                                            "Id", 
                                                                            scope.get("Id"));
                    esq.filters.logicalOperation = Terrasoft.LogicalOperatorType.AND; 
                    esq.filters.add("esqFilter1", esqFilter1);
                    esq.filters.add("esqFilter2", esqFilter2);
                    esq.filters.add("esqFilter3", esqFilter3);
                    esq.getEntityCollection(function(response) {
                        var activeHourlyAds = response.collection.getCount();
                        scope.Terrasoft.SysSettings.querySysSettingsItem("UsrMaximumNumberOfActiveReleases", function(maxActiveHourlyAds){
                            if (activeHourlyAds >= maxActiveHourlyAds){
                                result.message = scope.get("Resources.Strings.ManyAdsException") + maxActiveHourlyAds.toString();
                                result.success = false;
                            }
                        callback.call(scope||this, result);
                        });
                    }, this);	
                }
              	else{
              		callback.call(scope||this, result);
              	}
			},
			getActions: function() {
				var actionMenuItems = this.callParent(arguments);
				actionMenuItems.addItem(this.getButtonMenuItem({
					Type: "Terrasoft.MenuSeparator",
					Caption: ""
				}));
				actionMenuItems.addItem(this.getButtonMenuItem({
					"Caption": {
						bindTo: "Resources.Strings.AddReleases"
					},
					"Tag": "addReleases",
					"Enabled": true 
				}));
				return actionMenuItems;
			},
			addReleases: function() {
				var processArgs = {
					sysProcessName: "UsrAddReleasesToAdBlock",
					parameters: {
						AdUnitId: this.get("Id")
					}
				};
				ProcessModuleUtilities.executeProcess(processArgs);
			}
        },
      dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "UsrNamed8e808a3-7f9c-4b8a-b1b3-80b0099aa332",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrName"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrCode44652bb4-32bf-4ca5-9817-7058ee022f5d",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrCode"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "UsrPeriodicity649f9a9b-dbba-46f2-9e4e-d895f1856f2a",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrPeriodicity"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "UsrResponsible614e9991-ff3b-4c7a-905e-7b59d2e85c0e",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrResponsible"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "UsrComment81383b0d-77e3-4c24-be2d-5aa15d5fd540",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 4,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrComment"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "UsrIsActivefd8df2e9-29a0-4169-ba25-ed9d64e48323",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 5,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrIsActive"
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "insert",
				"name": "ReleasesTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.ReleasesTabTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrReleaseDetail",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "ReleasesTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesAndFilesTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.NotesAndFilesTabCaption"
					},
					"items": [],
					"order": 1
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Files",
				"values": {
					"itemType": 2
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesControlGroup",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.NotesGroupCaption"
					},
					"items": []
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Notes",
				"values": {
					"bindTo": "UsrNotes",
					"dataValueType": 1,
					"contentType": 4,
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 24
					},
					"labelConfig": {
						"visible": false
					},
					"controlConfig": {
						"imageLoaded": {
							"bindTo": "insertImagesToNotes"
						},
						"images": {
							"bindTo": "NotesImagesCollection"
						}
					}
				},
				"parentName": "NotesControlGroup",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "merge",
				"name": "ESNTab",
				"values": {
					"order": 2
				}
			}
		]/**SCHEMA_DIFF*/
	};
});
