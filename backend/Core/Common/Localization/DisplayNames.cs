using System.Reflection;
using Humanizer;

namespace HCManagement.Core.Common.Localization;

public static class DisplayNames
{
    #region Fields
    private static readonly Dictionary<string, string> _names;
    #endregion

    #region Constants
    public const string User = "Người dùng";
    public const string Role = "Vị trí";
    public const string Photo = "Hình ảnh";
    public const string Announcement = "Thông báo";
    public const string Id = "Mã số";
    public const string Name = "Tên";
    public const string Account = "Tài khoản";
    public const string UserName = "Tên đăng nhập";
    public const string Password = "Mật khẩu";
    public const string CurrentPassword = "Mật khẩu hiện tại";
    public const string NewPassword = "Mật khẩu mới";
    public const string Status = "Tình trạng";
    public const string CreatedDateTime = "Ngày tạo";
    public const string LastUpdatedDateTime = "Ngày cập nhật";
    public const string CreatedUser = "Nhân viên tạo";
    public const string LastUpdatedUser = "Nhân viên cập nhật";
    public const string Note = "Ghi chú";
    public const string Introducer = "Người giới thiệu";
    public const string Description = "Mô tả";
    public const string Unit = "Đơn vị";
    public const string DefaultAmountBeforeVatPerUnit = "Giá niêm yết";
    public const string DefaultVatPercentagePerUnit = "Thuế VAT mặc định";
    public const string Amount = "Số tiền";
    public const string AmountBeforeVatPerUnit = "Số tiền trước thuế";
    public const string VatAmount = "Thuế VAT";
    public const string VatPercentagePerUnit = "Hệ số thuế";
    public const string Seating = "Bàn ăn";
    public const string MenuItem = "Món ăn";
    public const string ServiceAmount = "Tiền công";
    public const string TotalAmount = "Tổng giá tiền";
    public const string PaidAmount = "Số tiền đã thanh toán";
    public const string StartingDateTime = "Ngày giờ bắt đầu";
    public const string EndingDateTime = "Ngày giờ kết thúc";
    public const string Category = "Phân loại";
    public const string IsPinned = "Được đánh dấu";
    public const string Order = "Gọi món";
    public const string OrderItem = "Mục gọi món";
    public const string SortByFieldName = "Trường sắp xếp";
    public const string SortByAscending = "Thứ tự sắp xếp";
    public const string SearchByField = "Trường tìm kiếm";
    public const string SearchContent = "Nội dung tìm kiếm";
    public const string Page = "Trang";
    public const string ResultsPerPage = "Kết quả mỗi trang";
    public const string PageCount = "Số trang";
    public const string ResultsCount = "Số kết quả";
    public const string Results = "Kết quả";
    public const string ThumbnailFile = "File ảnh xem trước";
    public const string RangeFrom = "Khoảng bắt đầu";
    public const string RangeTo = "Khoảng kết thúc";
    public const string RangeType = "Kiểu khoảng";
    public const string RangeLength = "Độ dài khoảng";
    public const string File = "File";
    public const string UpdatedReason = "Lý do chỉnh sửa";
    public const string Debt = "Khoản nợ";
    public const string DebtIncurrence = "Ghi nợ";
    public const string DebtPayment = "Thanh toán nợ";
    public const string DebtRemainingAmount = "Số nợ còn lại";
    public const string MonthlyStats = "Thống kê tháng";
    public const string Month = "Tháng";
    public const string MonthCount = "Số lượng tháng";
    public const string DayCount = "Số lượng ngày";
    public const string Year = "Năm";
    public const string DailyStats = "Thống kê theo ngày";
    public const string RecordedDate = "Ngày thống kê";
    public const string RecordedMonth = "Tháng thống kê";
    public const string RecordedYear = "Năm thống kê";
    public const string RecordedMonthAndYear = "Tháng và năm thông kê";
    public const string IntervalInMinutes = "Số phút hiệu lực";
    public const string StatsDate = "Ngày thống kê";
    public const string Home = "Trang chủ";
    public const string Creteria = "Tiêu chí";
    public const string Count = "Số lượng";
    public const string Date = "Ngày";
    public const string Day = "Ngày";
    public const string PurchasedAmount = "Số tiền đã mua";
    public const string PurchasedTransactionCount = "Số lượng giao dịch mua";
    public const string Quantity = "Số lượng";
    public const string Default = "Mặc định";
    public const string TimeRangeUnitType = "Kiểu đơn vị khung thời gian";
    public const string TimeRangeUnitCount = "Số lượng đơn vị khung thời gian";
    #endregion

    #region StaticConstructors
    static DisplayNames()
    {
        _names = new Dictionary<string, string>();
        FieldInfo[] fields = typeof(DisplayNames).GetFields(BindingFlags.Public | BindingFlags.Static);
        foreach (FieldInfo field in fields)
        {
            string? fieldName = field.GetValue(null)?.ToString();
            if (fieldName is null)
            {
                continue;
            }

            _names.Add(field.Name, fieldName);
        }
    }
    #endregion

    #region StaticMethods
    public static string Get(string objectName)
    {
        ArgumentNullException.ThrowIfNull(objectName);
        return _names
            .Where(pair => pair.Key == objectName.Transform(To.SentenceCase))
            .Select(pair => pair.Value)
            .SingleOrDefault()
            ?? throw new InvalidOperationException($"There is no display name for {objectName}");
    }

    public static string Get(object[] objectName)
    {
        if (objectName.Length == 0)
        {
            throw new ArgumentException($"{nameof(objectName)} must be non-null and contain at least 1 element.");
        }

        return Get(objectName
            .Reverse()
            .Select(name => name.ToString()?.Transform(To.SentenceCase) ?? string.Empty)
            .First());
    }

    public static Dictionary<string, string> GetAll()
    {
        return _names;
    }
    #endregion
}
