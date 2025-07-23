using System;
using System.Collections.Generic;

namespace WepApp2.Models;

public partial class Device
{
    public int DeviceId { get; set; }

    public string DeviceName { get; set; } = null!;

    public string BrandName { get; set; } = null!;

    public string? DeviceModel { get; set; }

    public string SerialNumber { get; set; } = null!;

    public string DeviceStatus { get; set; } = null!;

    public string DeviceLocation { get; set; } = null!;

    public DateTime? LastMaintenance { get; set; }

    public DateTime? LastUpdate { get; set; }

    public bool IsDeleted { get; set; }

    public int? TechnologyId { get; set; }

    public virtual ICollection<BookingDevice> BookingDevices { get; set; } = new List<BookingDevice>();

    public virtual ICollection<DeviceLoan> DeviceLoans { get; set; } = new List<DeviceLoan>();

    public virtual ICollection<Request> Requests { get; set; } = new List<Request>();

    public virtual ICollection<ServiceDevice> ServiceDevices { get; set; } = new List<ServiceDevice>();

    public virtual Technology? Technology { get; set; }
}
