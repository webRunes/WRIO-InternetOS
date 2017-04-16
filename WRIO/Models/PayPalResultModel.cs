namespace WRIO.Models
{
    public class PayPalResultModel
    {
        public bool IsSucces { get; set; }
        public string Url { get; set; }
        public string Errors { get; set; }
    }
}