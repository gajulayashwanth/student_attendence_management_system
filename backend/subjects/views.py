from rest_framework import generics
from rest_framework.response import Response
from .models import Subject
from .serializers import SubjectSerializer
from accounts.permissions import IsAdmin, IsApprovedTeacher, IsAdminOrApprovedTeacher


class SubjectListCreateView(generics.ListCreateAPIView):
    serializer_class = SubjectSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdmin()]
        return [IsAdminOrApprovedTeacher()]

    def get_queryset(self):
        user = self.request.user
        if user.role == 'ADMIN':
            return Subject.objects.all()
        return user.assigned_subjects.all()


class SubjectDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = SubjectSerializer
    queryset = Subject.objects.all()

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAdminOrApprovedTeacher()]
        return [IsAdmin()]


class TeacherSubjectsView(generics.ListAPIView):
    serializer_class = SubjectSerializer
    permission_classes = [IsApprovedTeacher]

    def get_queryset(self):
        return self.request.user.assigned_subjects.all()
