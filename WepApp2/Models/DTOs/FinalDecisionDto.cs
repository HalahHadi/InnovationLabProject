namespace WepApp2.Models.DTOs
{
    public class FinalDecisionDto
    {
        public int requestId { get; set; }
        public string decision { get; set; }

        public string? notes { get; set; }
    }
}