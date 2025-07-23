using System;
using System.Collections.Generic;

namespace WepApp2.Models;

public partial class DeviceLoan
{
    public int DeviceLoanId { get; set; }

    public string Purpose { get; set; } = null!;

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public string? PreferredContactMethod { get; set; }

    public int? ServiceId { get; set; }

    public int? DeviceId { get; set; }

    public int? RequestId { get; set; }

    public virtual Device? Device { get; set; }

    public virtual Request? Request { get; set; }

    public virtual Service? Service { get; set; }
}
