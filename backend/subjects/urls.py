from django.urls import path
from .views import (
    SubjectListCreateView,
    SubjectDetailView,
    TeacherSubjectsView
)

urlpatterns = [
    path('', SubjectListCreateView.as_view()),
    path('<int:pk>/', SubjectDetailView.as_view()),
    path('my-subjects/', TeacherSubjectsView.as_view()),
]
