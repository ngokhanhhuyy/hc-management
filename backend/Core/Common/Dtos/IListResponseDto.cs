namespace HCManagement.Core.Common.Dtos;

public interface IListResponseDto<TBasic> where TBasic : IResponseDto
{
    #region Properties
    List<TBasic> Items { get; }
    int PageCount { get; }
    int ItemCount { get; }
    #endregion
}
