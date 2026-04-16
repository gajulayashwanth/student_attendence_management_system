from rest_framework import generics
from .models import Student
from .serializers import StudentSerializer, StudentMinimalSerializer
from accounts.permissions import IsAdmin, IsApprovedTeacher, IsAdminOrApprovedTeacher


class StudentListCreateView(generics.ListCreateAPIView):
    serializer_class = StudentSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdmin()]
        return [IsAdminOrApprovedTeacher()]

    def get_queryset(self):
        queryset = Student.objects.filter(is_active=True)
        subject_id = self.request.query_params.get('subject')
        if subject_id:
            queryset = queryset.filter(subjects__id=subject_id)
        return queryset


class StudentDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = StudentSerializer
    queryset = Student.objects.all()

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAdminOrApprovedTeacher()]
        return [IsAdmin()]

    def perform_destroy(self, instance):
        instance.is_active = False
        instance.save()


class StudentsBySubjectView(generics.ListAPIView):
    serializer_class = StudentMinimalSerializer
    permission_classes = [IsApprovedTeacher]

    def get_queryset(self):
        subject_id = self.kwargs.get('subject_id')
        return Student.objects.filter(
            subjects__id=subject_id,
            is_active=True
        )
