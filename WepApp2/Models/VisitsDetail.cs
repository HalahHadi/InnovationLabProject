using System;
using System.Collections.Generic;

namespace WepApp2.Models;

public partial class VisitsDetail
{
    public int VisitDetailsId { get; set; }

    public string VisitType { get; set; } = null!;

    public bool IsDeleted { get; set; }

    public virtual ICollection<LabVisit> LabVisits { get; set; } = new List<LabVisit>();
}
