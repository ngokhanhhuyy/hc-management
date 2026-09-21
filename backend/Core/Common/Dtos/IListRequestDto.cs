namespace HCManagement.Core.Common.Dtos;

public interface IListRequestDto<TSortingCriterion> : IRequestDto where TSortingCriterion : struct, Enum
{
    #region Properties
    bool SortByAscending { get; set; }
    TSortingCriterion SortByCriterion { get; set; }
    #endregion
}
