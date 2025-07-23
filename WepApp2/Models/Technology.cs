using System;
using System.Collections.Generic;

namespace WepApp2.Models;

public partial class Technology
{
    public int TechnologyId { get; set; }

    public string TechnologyName { get; set; } = null!;

    public string TechnologyDescription { get; set; } = null!;

    public bool IsDeleted { get; set; }

    public virtual ICollection<Device> Devices { get; set; } = new List<Device>();
}
