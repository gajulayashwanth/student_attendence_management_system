from django.urls import path
from .views import (
    BulkAttendanceView,
    DailyAttendanceView,
    MonthlyAttendanceView,
    DashboardStatsView,
    AttendanceAuditView
)

urlpatterns = [
    path('mark/', BulkAttendanceView.as_view()),
    path('daily/', DailyAttendanceView.as_view()),
    path('monthly/', MonthlyAttendanceView.as_view()),
    path('dashboard-stats/', DashboardStatsView.as_view()),
    path('audit/', AttendanceAuditView.as_view()),
]
