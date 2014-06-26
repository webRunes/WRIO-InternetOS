namespace WRIO.Models
{
    public class WithdrawModel
    {
        public string Amount { get; set; }
        public string Email { get; set; }
        public bool IsTransferCanseled { get; set; }
        public string ErrorType { get; set; }
        public string ErrorMessage { get; set; }
    }

    public enum ErrorType
    {
        maximumLimit,
        minimumLimit,
        received,
        errorMessage,
        dayLimit,
        haventMoney
    }
}