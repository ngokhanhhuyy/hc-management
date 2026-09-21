namespace HCManagement.Core.Common.Dtos;

public interface IPaginatedListRequestDto<TSortingCriterion> : IListRequestDto<TSortingCriterion>
    where TSortingCriterion : struct, Enum
{
    #region Properties
    int Page { get; set; }
    int ResultsPerPage { get; set; }
    #endregion
}
