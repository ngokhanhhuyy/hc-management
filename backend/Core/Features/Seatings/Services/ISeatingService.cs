namespace HCManagement.Core.Features.Seatings;

public interface ISeatingService
{
    #region Methods
    Task<List<SeatingBasicResponseDto>> GetAllAsync();
    Task<SeatingDetailResponseDto> GetDetailAsync(int id);
    Task<int> CreateAsync(SeatingUpsertRequestDto requestDto);
    Task UpdateAsync(int id, SeatingUpsertRequestDto requestDto);
    Task DeleteAsync(int id);
    #endregion
}
