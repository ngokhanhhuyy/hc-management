namespace HCManagement.Core.Features.Orders;

public interface IOrderService
{
    #region Methods
    Task<OrderListResponseDto> GetListAsync(OrderListRequestDto requestDto);
    Task<OrderDetailResponseDto> GetDetailAsync(int id);
    Task<OrderDetailResponseDto> CreateAsync(OrderUpsertRequestDto requestDto);
    Task<OrderDetailResponseDto> UpdateAsync(int id, OrderUpsertRequestDto requestDto);
    Task FinishAsync(int id);
    Task DeleteAsync(int id);
    #endregion
}
