namespace Terrasoft.Configuration
{
	using System;
	using System.Collections.Generic;
	using System.ServiceModel;
	using System.ServiceModel.Activation;
	using System.ServiceModel.Web;
	using Terrasoft.Web.Common;
	using Terrasoft.Core.Factories;
	using Newtonsoft.Json;
	using System.Net;	
	using Terrasoft.Core.DB;
    using Terrasoft.Core.Entities;
    using Terrasoft.Common;

	[ServiceContract]
	[AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Required)]
	public class UsrCountingSumOfReleasesService : BaseService
	{
		[OperationContract]
		[WebInvoke(Method = "POST", ResponseFormat = WebMessageFormat.Json,
			BodyStyle = WebMessageBodyStyle.WrappedRequest)]
		public double CountSum (string code) {
        	Guid adUnitId = GetAdId(code);
            if (adUnitId == Guid.Empty){
				return -1;
			}
            else{
				return GetSumOfReleases(adUnitId);
            }
		}
        
        private Guid GetAdId(string code){
			EntitySchemaQuery esq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "UsrAdUnit");
            esq.AddAllSchemaColumns();
            esq.Filters.Add(esq.CreateFilterWithParameters(FilterComparisonType.Equal, "UsrCode", code));
			EntityCollection entities = esq.GetEntityCollection(UserConnection);
            if(entities.Count==0){
				return Guid.Empty;
			}
            else{
            	return entities[0].GetTypedColumnValue<Guid>("Id");
          	}
		}
        
        private double GetSumOfReleases(Guid adUnitId){
			EntitySchemaQuery esq = new EntitySchemaQuery(UserConnection.EntitySchemaManager, "UsrRelease");
			var sumColumn = esq.AddColumn(esq.CreateAggregationFunction(AggregationTypeStrict.Sum, "UsrCost"));
			var filterByAdUnit = esq.CreateFilterWithParameters(
				FilterComparisonType.Equal,
				"UsrAdUnit",
				adUnitId
			);
			esq.Filters.Add(filterByAdUnit);
               
			var filterByStatus = esq.CreateFilterWithParameters(
				FilterComparisonType.Equal,
				"UsrReleaseStatus",
				Guid.Parse(UsrBackendConstants.UsrReleaseStatusFinished)
			);
			esq.Filters.Add(filterByStatus);
			EntityCollection entities = esq.GetEntityCollection(UserConnection);
			return entities[0].GetTypedColumnValue<double>(sumColumn.Name);
		}
}
}
