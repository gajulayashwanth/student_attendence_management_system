from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView,
    LoginView,
    AdminLoginView,
    ProfileView,
    TeacherListView,
    TeacherApprovalView,
    TeacherDeleteView,
    CheckApprovalView
)

urlpatterns = [
    path('register/', RegisterView.as_view()),
    path('login/', LoginView.as_view()),
    path('admin-login/', AdminLoginView.as_view()),
    path('token/refresh/', TokenRefreshView.as_view()),
    path('profile/', ProfileView.as_view()),
    path('teachers/', TeacherListView.as_view()),
    path('teachers/<int:pk>/approve/', TeacherApprovalView.as_view()),
    path('teachers/<int:pk>/delete/', TeacherDeleteView.as_view()),
    path('check-approval/', CheckApprovalView.as_view()),
]
