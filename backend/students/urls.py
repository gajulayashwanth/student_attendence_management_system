from django.urls import path
from .views import (
    StudentListCreateView,
    StudentDetailView,
    StudentsBySubjectView
)

urlpatterns = [
    path('', StudentListCreateView.as_view()),
    path('<int:pk>/', StudentDetailView.as_view()),
    path('by-subject/<int:subject_id>/', StudentsBySubjectView.as_view()),
]
