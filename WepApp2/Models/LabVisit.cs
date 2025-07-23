using System;
using System.Collections.Generic;

namespace WepApp2.Models;

public partial class LabVisit
{
    public int LabVisitId { get; set; }

    public int NumberOfVisitors { get; set; }

    public DateOnly VisitDate { get; set; }

    public TimeOnly PreferredTime { get; set; }

    public string? PreferredContactMethod { get; set; }

    public string? AdditionalNotes { get; set; }

    public int? ServiceId { get; set; }

    public int? RequestId { get; set; }

    public int? VisitDetailsId { get; set; }

    public virtual Request? Request { get; set; }

    public virtual Service? Service { get; set; }

    public virtual VisitsDetail? VisitDetails { get; set; }
}
