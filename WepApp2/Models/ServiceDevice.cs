using System;
using System.Collections.Generic;

namespace WepApp2.Models;

public partial class ServiceDevice
{
    public int ServiceDeviceId { get; set; }

    public int ServiceId { get; set; }

    public int DeviceId { get; set; }

    public virtual Device Device { get; set; } = null!;

    public virtual Service Service { get; set; } = null!;
}
