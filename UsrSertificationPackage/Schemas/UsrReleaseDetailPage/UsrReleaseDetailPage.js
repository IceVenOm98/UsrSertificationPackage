define("UsrReleaseDetailPage", [], function() {
    return {
        entitySchemaName: "UsrRelease",
        details: /**SCHEMA_DETAILS*/{}/**SCHEMA_DETAILS*/,
        modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "UsrLeading",
				"values": {
					"layout": {
						"colSpan": 7,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrLeading"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "UsrDateRelease",
				"values": {
					"layout": {
						"colSpan": 7,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "UsrDateRelease"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "UsrDuration",
				"values": {
					"layout": {
						"colSpan": 9,
						"rowSpan": 1,
						"column": 7,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrDuration"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "UsrReleaseStatus",
				"values": {
					"layout": {
						"colSpan": 9,
						"rowSpan": 1,
						"column": 7,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "UsrReleaseStatus"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "UsrCost",
				"values": {
					"layout": {
						"colSpan": 8,
						"rowSpan": 1,
						"column": 16,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrCost"
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 4
			}
		]/**SCHEMA_DIFF*/,
        methods: {},
        rules: {}
    };
});