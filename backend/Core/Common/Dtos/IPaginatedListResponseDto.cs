namespace HCManagement.Core.Common.Dtos;

public interface IPaginatedListResponseDto<TBasic> : IListResponseDto<TBasic> where TBasic : IResponseDto
{
    #region Properties
    int PageCount { get; }
    #endregion
}
