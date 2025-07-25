﻿//// <auto-generated />
//using System;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.EntityFrameworkCore.Infrastructure;
//using Microsoft.EntityFrameworkCore.Metadata;
//using Microsoft.EntityFrameworkCore.Migrations;
//using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
//using WepApp2.Models;

//#nullable disable

//namespace WepApp2.Migrations
//{
//    [DbContext(typeof(Dbgroup2Context))]
//    [Migration("20250702063554_InitialCreate")]
//    partial class InitialCreate
//    {
//        /// <inheritdoc />
//        protected override void BuildTargetModel(ModelBuilder modelBuilder)
//        {
//#pragma warning disable 612, 618
//            modelBuilder
//                .UseCollation("Arabic_CI_AI")
//                .HasAnnotation("ProductVersion", "9.0.6")
//                .HasAnnotation("Relational:MaxIdentifierLength", 128);

//            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

//            modelBuilder.Entity("CoursesRequest", b =>
//                {
//                    b.Property<int>("RequestId")
//                        .HasColumnType("int")
//                        .HasColumnName("RequestID");

//                    b.Property<int>("CourseId")
//                        .HasColumnType("int")
//                        .HasColumnName("CourseID");

//                    b.HasKey("RequestId", "CourseId")
//                        .HasName("PK__CoursesR__5F3A8682B362A6F7");

//                    b.HasIndex("CourseId");

//                    b.ToTable("CoursesRequests", (string)null);
//                });

//            modelBuilder.Entity("WepApp2.Models.BookingDevice", b =>
//                {
//                    b.Property<int>("BookingDevices")
//                        .HasColumnType("int");

//                    b.Property<DateOnly>("BookingDate")
//                        .HasColumnType("date");

//                    b.Property<string>("Department")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<int?>("DeviceId")
//                        .HasColumnType("int")
//                        .HasColumnName("DeviceID");

//                    b.Property<TimeOnly>("EndTime")
//                        .HasColumnType("time");

//                    b.Property<string>("Faculty")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<string>("FilePath")
//                        .HasColumnType("nvarchar(max)");

//                    b.Property<string>("ProjectDescription")
//                        .IsRequired()
//                        .HasColumnType("nvarchar(max)");

//                    b.Property<string>("ProjectName")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<int?>("RequestId")
//                        .HasColumnType("int")
//                        .HasColumnName("RequestID");

//                    b.Property<int?>("ServiceId")
//                        .HasColumnType("int")
//                        .HasColumnName("ServiceID");

//                    b.Property<TimeOnly>("StartTime")
//                        .HasColumnType("time");

//                    b.HasKey("BookingDevices")
//                        .HasName("PK__BookingD__EDD3255410E4623A");

//                    b.HasIndex("DeviceId");

//                    b.HasIndex("RequestId");

//                    b.HasIndex("ServiceId");

//                    b.ToTable("BookingDevices");
//                });

//            modelBuilder.Entity("WepApp2.Models.Consultation", b =>
//                {
//                    b.Property<int>("ConsultationId")
//                        .HasColumnType("int")
//                        .HasColumnName("ConsultationID");

//                    b.Property<TimeOnly>("AvailableTimes")
//                        .HasColumnType("time");

//                    b.Property<string>("CommunicationMethod")
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<string>("Description")
//                        .IsRequired()
//                        .HasColumnType("nvarchar(max)");

//                    b.Property<int?>("RequestId")
//                        .HasColumnType("int")
//                        .HasColumnName("RequestID");

//                    b.Property<DateOnly>("RequestedDate")
//                        .HasColumnType("date");

//                    b.Property<int?>("ServiceId")
//                        .HasColumnType("int")
//                        .HasColumnName("ServiceID");

//                    b.HasKey("ConsultationId")
//                        .HasName("PK__Consulta__5D014A7847927F7B");

//                    b.HasIndex("RequestId");

//                    b.HasIndex("ServiceId");

//                    b.ToTable("Consultations");
//                });

//            modelBuilder.Entity("WepApp2.Models.ConsultationMajor", b =>
//                {
//                    b.Property<int>("ConsultationMajorId")
//                        .HasColumnType("int")
//                        .HasColumnName("ConsultationMajorID");

//                    b.Property<int?>("ConsultationId")
//                        .HasColumnType("int")
//                        .HasColumnName("ConsultationID");

//                    b.Property<string>("Description")
//                        .IsRequired()
//                        .HasColumnType("nvarchar(max)");

//                    b.Property<string>("Major")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.HasKey("ConsultationMajorId")
//                        .HasName("PK__Consulta__C757E54FCA8BDCBC");

//                    b.HasIndex("ConsultationId");

//                    b.ToTable("ConsultationMajors");
//                });

//            modelBuilder.Entity("WepApp2.Models.Course", b =>
//                {
//                    b.Property<int>("CourseId")
//                        .HasColumnType("int")
//                        .HasColumnName("CourseID");

//                    b.Property<DateOnly>("CourseDate")
//                        .HasColumnType("date");

//                    b.Property<string>("CourseDescription")
//                        .IsRequired()
//                        .HasColumnType("nvarchar(max)");

//                    b.Property<string>("CourseField")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<string>("CourseName")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<TimeOnly>("EndTime")
//                        .HasColumnType("time");

//                    b.Property<string>("PresenterName")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<int?>("RequestId")
//                        .HasColumnType("int")
//                        .HasColumnName("RequestID");

//                    b.Property<int?>("SeatCapacity")
//                        .HasColumnType("int");

//                    b.Property<int?>("ServiceId")
//                        .HasColumnType("int")
//                        .HasColumnName("ServiceID");

//                    b.Property<TimeOnly>("StartTime")
//                        .HasColumnType("time");

//                    b.HasKey("CourseId")
//                        .HasName("PK__Courses__C92D718765CDAE24");

//                    b.HasIndex("RequestId");

//                    b.HasIndex("ServiceId");

//                    b.ToTable("Courses");
//                });

//            modelBuilder.Entity("WepApp2.Models.Device", b =>
//                {
//                    b.Property<int>("DeviceId")
//                        .HasColumnType("int")
//                        .HasColumnName("DeviceID");

//                    b.Property<string>("BrandName")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<string>("DeviceLocation")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<string>("DeviceModel")
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<string>("DeviceName")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<string>("DeviceStatus")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<string>("DeviceType")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<DateTime>("LastMaintenance")
//                        .HasColumnType("datetime");

//                    b.Property<DateTime>("LastUpdate")
//                        .HasColumnType("datetime");

//                    b.Property<string>("SerialNumber")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<int?>("ServiceId")
//                        .HasColumnType("int")
//                        .HasColumnName("ServiceID");

//                    b.HasKey("DeviceId")
//                        .HasName("PK__Devices__49E123315D92FBB2");

//                    b.HasIndex("ServiceId");

//                    b.ToTable("Devices");
//                });

//            modelBuilder.Entity("WepApp2.Models.DeviceLoan", b =>
//                {
//                    b.Property<int>("LoanId")
//                        .HasColumnType("int")
//                        .HasColumnName("LoanID");

//                    b.Property<int?>("DeviceId")
//                        .HasColumnType("int")
//                        .HasColumnName("DeviceID");

//                    b.Property<DateOnly>("EndDate")
//                        .HasColumnType("date");

//                    b.Property<string>("PreferredContactMethod")
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<string>("Purpose")
//                        .IsRequired()
//                        .HasColumnType("nvarchar(max)");

//                    b.Property<int?>("RequestId")
//                        .HasColumnType("int")
//                        .HasColumnName("RequestID");

//                    b.Property<int?>("ServiceId")
//                        .HasColumnType("int")
//                        .HasColumnName("ServiceID");

//                    b.Property<DateOnly>("StartDate")
//                        .HasColumnType("date");

//                    b.HasKey("LoanId")
//                        .HasName("PK__DeviceLo__4F5AD4374F130F35");

//                    b.HasIndex("DeviceId");

//                    b.HasIndex("RequestId");

//                    b.HasIndex("ServiceId");

//                    b.ToTable("DeviceLoans");
//                });

//            modelBuilder.Entity("WepApp2.Models.LabVisit", b =>
//                {
//                    b.Property<int>("LabVisitId")
//                        .HasColumnType("int")
//                        .HasColumnName("LabVisitID");

//                    b.Property<string>("AdditionalNotes")
//                        .HasColumnType("nvarchar(max)");

//                    b.Property<string>("CommunicationMethod")
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<int>("NumberOfVisitors")
//                        .ValueGeneratedOnAdd()
//                        .HasColumnType("int")
//                        .HasDefaultValue(1);

//                    b.Property<TimeOnly>("PreferredTime")
//                        .HasColumnType("time");

//                    b.Property<int?>("RequestId")
//                        .HasColumnType("int")
//                        .HasColumnName("RequestID");

//                    b.Property<int?>("ServiceId")
//                        .HasColumnType("int")
//                        .HasColumnName("ServiceID");

//                    b.Property<DateOnly>("VisitDate")
//                        .HasColumnType("date");

//                    b.HasKey("LabVisitId")
//                        .HasName("PK__LabVisit__DDA1234232DDD84C");

//                    b.HasIndex("RequestId");

//                    b.HasIndex("ServiceId");

//                    b.ToTable("LabVisits");
//                });

//            modelBuilder.Entity("WepApp2.Models.Request", b =>
//                {
//                    b.Property<int>("RequestId")
//                        .HasColumnType("int")
//                        .HasColumnName("RequestID");

//                    b.Property<string>("AdminStatus")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<int?>("DeviceId")
//                        .HasColumnType("int")
//                        .HasColumnName("DeviceID");

//                    b.Property<string>("Notes")
//                        .IsRequired()
//                        .HasColumnType("nvarchar(max)");

//                    b.Property<DateTime>("RequestDate")
//                        .HasColumnType("datetime");

//                    b.Property<string>("RequestType")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<int?>("ServiceId")
//                        .HasColumnType("int")
//                        .HasColumnName("ServiceID");

//                    b.Property<int>("SupervisorAssigned")
//                        .HasColumnType("int");

//                    b.Property<string>("SupervisorStatus")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<int?>("UserId")
//                        .HasColumnType("int")
//                        .HasColumnName("UserID");

//                    b.HasKey("RequestId")
//                        .HasName("PK__Request__33A8519A6244A6D5");

//                    b.HasIndex("DeviceId");

//                    b.HasIndex("ServiceId");

//                    b.HasIndex("UserId");

//                    b.ToTable("Request", (string)null);
//                });

//            modelBuilder.Entity("WepApp2.Models.Service", b =>
//                {
//                    b.Property<int>("ServiceId")
//                        .HasColumnType("int")
//                        .HasColumnName("ServiceID");

//                    b.Property<string>("Description")
//                        .IsRequired()
//                        .HasColumnType("nvarchar(max)");

//                    b.Property<string>("ServiceName")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<int?>("TechnologyId")
//                        .HasColumnType("int")
//                        .HasColumnName("TechnologyID");

//                    b.HasKey("ServiceId")
//                        .HasName("PK__Services__C51BB0EACFB7ECCB");

//                    b.HasIndex("TechnologyId");

//                    b.ToTable("Services");
//                });

//            modelBuilder.Entity("WepApp2.Models.Technology", b =>
//                {
//                    b.Property<int>("TechnologyId")
//                        .HasColumnType("int")
//                        .HasColumnName("TechnologyID");

//                    b.Property<string>("Description")
//                        .IsRequired()
//                        .HasColumnType("nvarchar(max)");

//                    b.Property<int?>("DeviceId")
//                        .HasColumnType("int")
//                        .HasColumnName("DeviceID");

//                    b.Property<string>("TechnologyName")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.HasKey("TechnologyId")
//                        .HasName("PK__Technolo__705701784316E071");

//                    b.HasIndex("DeviceId");

//                    b.ToTable("Technologies");
//                });

//            modelBuilder.Entity("WepApp2.Models.User", b =>
//                {
//                    b.Property<int>("UserId")
//                        .HasColumnType("int")
//                        .HasColumnName("UserID");

//                    b.Property<string>("Department")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<string>("Email")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<string>("Faculty")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<string>("FirstName")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<bool>("IsActive")
//                        .ValueGeneratedOnAdd()
//                        .HasColumnType("bit")
//                        .HasDefaultValue(true);

//                    b.Property<DateTime>("LastLogIn")
//                        .HasColumnType("datetime");

//                    b.Property<string>("LastName")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<string>("PassWord")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<int>("PhoneNumber")
//                        .HasColumnType("int");

//                    b.Property<string>("Role")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.Property<string>("UserName")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)");

//                    b.HasKey("UserId")
//                        .HasName("PK__Users__1788CCAC48D148C7");

//                    b.ToTable("Users");
//                });

//            modelBuilder.Entity("WepApp2.Models.VisitsDetail", b =>
//                {
//                    b.Property<int>("VisitsDetailsId")
//                        .HasColumnType("int")
//                        .HasColumnName("VisitsDetailsID");

//                    b.Property<int?>("LabVisitId")
//                        .HasColumnType("int")
//                        .HasColumnName("LabVisitID");

//                    b.Property<string>("VisitType")
//                        .IsRequired()
//                        .HasMaxLength(255)
//                        .HasColumnType("nvarchar(255)")
//                        .HasColumnName("visitType");

//                    b.HasKey("VisitsDetailsId")
//                        .HasName("PK__VisitsDe__746A09CF6F218A8C");

//                    b.HasIndex("LabVisitId");

//                    b.ToTable("VisitsDetails");
//                });

//            modelBuilder.Entity("CoursesRequest", b =>
//                {
//                    b.HasOne("WepApp2.Models.Course", null)
//                        .WithMany()
//                        .HasForeignKey("CourseId")
//                        .IsRequired()
//                        .HasConstraintName("FK__CoursesRe__Cours__6D0D32F4");

//                    b.HasOne("WepApp2.Models.Request", null)
//                        .WithMany()
//                        .HasForeignKey("RequestId")
//                        .IsRequired()
//                        .HasConstraintName("FK__CoursesRe__Reque__6C190EBB");
//                });

//            modelBuilder.Entity("WepApp2.Models.BookingDevice", b =>
//                {
//                    b.HasOne("WepApp2.Models.Device", "Device")
//                        .WithMany("BookingDevices")
//                        .HasForeignKey("DeviceId")
//                        .HasConstraintName("FK_BookingDevices_Devices");

//                    b.HasOne("WepApp2.Models.Request", "Request")
//                        .WithMany("BookingDevices")
//                        .HasForeignKey("RequestId")
//                        .HasConstraintName("FK_BookingDevices_Request");

//                    b.HasOne("WepApp2.Models.Service", "Service")
//                        .WithMany("BookingDevices")
//                        .HasForeignKey("ServiceId")
//                        .HasConstraintName("FK_BookingDevices_Services");

//                    b.Navigation("Device");

//                    b.Navigation("Request");

//                    b.Navigation("Service");
//                });

//            modelBuilder.Entity("WepApp2.Models.Consultation", b =>
//                {
//                    b.HasOne("WepApp2.Models.Request", "Request")
//                        .WithMany("Consultations")
//                        .HasForeignKey("RequestId")
//                        .HasConstraintName("FK_Consultations_Request");

//                    b.HasOne("WepApp2.Models.Service", "Service")
//                        .WithMany("Consultations")
//                        .HasForeignKey("ServiceId")
//                        .HasConstraintName("FK_Consultations_Services");

//                    b.Navigation("Request");

//                    b.Navigation("Service");
//                });

//            modelBuilder.Entity("WepApp2.Models.ConsultationMajor", b =>
//                {
//                    b.HasOne("WepApp2.Models.Consultation", "Consultation")
//                        .WithMany("ConsultationMajors")
//                        .HasForeignKey("ConsultationId")
//                        .HasConstraintName("FK_ConsultationMajors_Consultations");

//                    b.Navigation("Consultation");
//                });

//            modelBuilder.Entity("WepApp2.Models.Course", b =>
//                {
//                    b.HasOne("WepApp2.Models.Request", "Request")
//                        .WithMany("Courses")
//                        .HasForeignKey("RequestId")
//                        .HasConstraintName("FK_Courses_Request");

//                    b.HasOne("WepApp2.Models.Service", "Service")
//                        .WithMany("Courses")
//                        .HasForeignKey("ServiceId")
//                        .HasConstraintName("FK_Courses_Services");

//                    b.Navigation("Request");

//                    b.Navigation("Service");
//                });

//            modelBuilder.Entity("WepApp2.Models.Device", b =>
//                {
//                    b.HasOne("WepApp2.Models.Service", "Service")
//                        .WithMany("Devices")
//                        .HasForeignKey("ServiceId")
//                        .HasConstraintName("FK_Devices_Services");

//                    b.Navigation("Service");
//                });

//            modelBuilder.Entity("WepApp2.Models.DeviceLoan", b =>
//                {
//                    b.HasOne("WepApp2.Models.Device", "Device")
//                        .WithMany("DeviceLoans")
//                        .HasForeignKey("DeviceId")
//                        .HasConstraintName("FK_DeviceLoans_Devices");

//                    b.HasOne("WepApp2.Models.Request", "Request")
//                        .WithMany("DeviceLoans")
//                        .HasForeignKey("RequestId")
//                        .HasConstraintName("FK_DeviceLoans_Request");

//                    b.HasOne("WepApp2.Models.Service", "Service")
//                        .WithMany("DeviceLoans")
//                        .HasForeignKey("ServiceId")
//                        .HasConstraintName("FK_DeviceLoans_Services");

//                    b.Navigation("Device");

//                    b.Navigation("Request");

//                    b.Navigation("Service");
//                });

//            modelBuilder.Entity("WepApp2.Models.LabVisit", b =>
//                {
//                    b.HasOne("WepApp2.Models.Request", "Request")
//                        .WithMany("LabVisits")
//                        .HasForeignKey("RequestId")
//                        .HasConstraintName("FK_LabVisits_Request");

//                    b.HasOne("WepApp2.Models.Service", "Service")
//                        .WithMany("LabVisits")
//                        .HasForeignKey("ServiceId")
//                        .HasConstraintName("FK_LabVisits_Services");

//                    b.Navigation("Request");

//                    b.Navigation("Service");
//                });

//            modelBuilder.Entity("WepApp2.Models.Request", b =>
//                {
//                    b.HasOne("WepApp2.Models.Device", "Device")
//                        .WithMany("Requests")
//                        .HasForeignKey("DeviceId")
//                        .HasConstraintName("FK_Request_Devices");

//                    b.HasOne("WepApp2.Models.Service", "Service")
//                        .WithMany("Requests")
//                        .HasForeignKey("ServiceId")
//                        .HasConstraintName("FK_Request_Services");

//                    b.HasOne("WepApp2.Models.User", "User")
//                        .WithMany("Requests")
//                        .HasForeignKey("UserId")
//                        .HasConstraintName("FK_Request_Users");

//                    b.Navigation("Device");

//                    b.Navigation("Service");

//                    b.Navigation("User");
//                });

//            modelBuilder.Entity("WepApp2.Models.Service", b =>
//                {
//                    b.HasOne("WepApp2.Models.Technology", "Technology")
//                        .WithMany("Services")
//                        .HasForeignKey("TechnologyId")
//                        .HasConstraintName("FK_Services_Technologies");

//                    b.Navigation("Technology");
//                });

//            modelBuilder.Entity("WepApp2.Models.Technology", b =>
//                {
//                    b.HasOne("WepApp2.Models.Device", "Device")
//                        .WithMany("Technologies")
//                        .HasForeignKey("DeviceId")
//                        .HasConstraintName("FK_Technologies_Devices");

//                    b.Navigation("Device");
//                });

//            modelBuilder.Entity("WepApp2.Models.VisitsDetail", b =>
//                {
//                    b.HasOne("WepApp2.Models.LabVisit", "LabVisit")
//                        .WithMany("VisitsDetails")
//                        .HasForeignKey("LabVisitId")
//                        .HasConstraintName("FK_VisitsDetails_LabVisits");

//                    b.Navigation("LabVisit");
//                });

//            modelBuilder.Entity("WepApp2.Models.Consultation", b =>
//                {
//                    b.Navigation("ConsultationMajors");
//                });

//            modelBuilder.Entity("WepApp2.Models.Device", b =>
//                {
//                    b.Navigation("BookingDevices");

//                    b.Navigation("DeviceLoans");

//                    b.Navigation("Requests");

//                    b.Navigation("Technologies");
//                });

//            modelBuilder.Entity("WepApp2.Models.LabVisit", b =>
//                {
//                    b.Navigation("VisitsDetails");
//                });

//            modelBuilder.Entity("WepApp2.Models.Request", b =>
//                {
//                    b.Navigation("BookingDevices");

//                    b.Navigation("Consultations");

//                    b.Navigation("Courses");

//                    b.Navigation("DeviceLoans");

//                    b.Navigation("LabVisits");
//                });

//            modelBuilder.Entity("WepApp2.Models.Service", b =>
//                {
//                    b.Navigation("BookingDevices");

//                    b.Navigation("Consultations");

//                    b.Navigation("Courses");

//                    b.Navigation("DeviceLoans");

//                    b.Navigation("Devices");

//                    b.Navigation("LabVisits");

//                    b.Navigation("Requests");
//                });

//            modelBuilder.Entity("WepApp2.Models.Technology", b =>
//                {
//                    b.Navigation("Services");
//                });

//            modelBuilder.Entity("WepApp2.Models.User", b =>
//                {
//                    b.Navigation("Requests");
//                });
//#pragma warning restore 612, 618
//        }
//    }
//}
