from datetime import datetime, timedelta
from django.db.models import Count, Q
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import AttendanceRecord
from .serializers import AttendanceRecordSerializer, BulkAttendanceSerializer
from subjects.models import Subject
from students.models import Student
from accounts.permissions import IsAdmin, IsApprovedTeacher, IsAdminOrApprovedTeacher


class BulkAttendanceView(APIView):
    permission_classes = [IsApprovedTeacher]

    def post(self, request):
        serializer = BulkAttendanceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        subject_id = serializer.validated_data['subject_id']
        date = serializer.validated_data['date']
        records = serializer.validated_data['records']

        try:
            subject = Subject.objects.get(id=subject_id)
        except Subject.DoesNotExist:
            return Response(
                {'error': 'Subject not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        if not request.user.assigned_subjects.filter(id=subject_id).exists():
            return Response(
                {'error': 'You are not assigned to this subject.'},
                status=status.HTTP_403_FORBIDDEN
            )

        created_records = []
        updated_records = []

        for record in records:
            student_id = record['student_id']
            attendance_status = record['status']

            try:
                student = Student.objects.get(id=student_id, is_active=True)
            except Student.DoesNotExist:
                continue

            obj, created = AttendanceRecord.objects.update_or_create(
                student=student,
                subject=subject,
                date=date,
                defaults={
                    'teacher': request.user,
                    'status': attendance_status
                }
            )

            if created:
                created_records.append(obj)
            else:
                updated_records.append(obj)

        return Response({
            'message': 'Attendance saved successfully.',
            'created': len(created_records),
            'updated': len(updated_records),
            'total': len(created_records) + len(updated_records)
        })


class DailyAttendanceView(APIView):
    permission_classes = [IsAdminOrApprovedTeacher]

    def get(self, request):
        subject_id = request.query_params.get('subject')
        date = request.query_params.get('date', datetime.now().date().isoformat())

        if not subject_id:
            return Response(
                {'error': 'Subject parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        records = AttendanceRecord.objects.filter(
            subject_id=subject_id,
            date=date
        ).select_related('student', 'subject', 'teacher')

        if request.user.role == 'TEACHER':
            records = records.filter(teacher=request.user)

        total = records.count()
        present = records.filter(status='PRESENT').count()
        absent = records.filter(status='ABSENT').count()

        return Response({
            'date': date,
            'subject_id': int(subject_id),
            'summary': {
                'total': total,
                'present': present,
                'absent': absent,
                'percentage': round((present / total) * 100, 1) if total > 0 else 0
            },
            'records': AttendanceRecordSerializer(records, many=True).data
        })


class MonthlyAttendanceView(APIView):
    permission_classes = [IsAdminOrApprovedTeacher]

    def get(self, request):
        subject_id = request.query_params.get('subject')
        month = request.query_params.get('month', datetime.now().month)
        year = request.query_params.get('year', datetime.now().year)

        if not subject_id:
            return Response(
                {'error': 'Subject parameter is required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        records = AttendanceRecord.objects.filter(
            subject_id=subject_id,
            date__month=int(month),
            date__year=int(year)
        ).select_related('student', 'subject')

        if request.user.role == 'TEACHER':
            records = records.filter(teacher=request.user)

        students = Student.objects.filter(
            subjects__id=subject_id,
            is_active=True
        )

        student_stats = []
        for student in students:
            student_records = records.filter(student=student)
            total = student_records.count()
            present = student_records.filter(status='PRESENT').count()
            student_stats.append({
                'student_id': student.id,
                'roll_number': student.roll_number,
                'name': f"{student.first_name} {student.last_name}",
                'total_classes': total,
                'present': present,
                'absent': total - present,
                'percentage': round((present / total) * 100, 1) if total > 0 else 0
            })

        return Response({
            'month': int(month),
            'year': int(year),
            'subject_id': int(subject_id),
            'students': student_stats
        })


class DashboardStatsView(APIView):
    permission_classes = [IsAdminOrApprovedTeacher]

    def get(self, request):
        user = request.user
        today = datetime.now().date()

        if user.role == 'ADMIN':
            total_teachers = user.__class__.objects.filter(role='TEACHER').count()
            pending_teachers = user.__class__.objects.filter(role='TEACHER', is_approved=False).count()
            total_students = Student.objects.filter(is_active=True).count()
            total_subjects = Subject.objects.count()
            today_records = AttendanceRecord.objects.filter(date=today)
            today_present = today_records.filter(status='PRESENT').count()
            today_total = today_records.count()

            return Response({
                'total_teachers': total_teachers,
                'pending_teachers': pending_teachers,
                'total_students': total_students,
                'total_subjects': total_subjects,
                'today_present': today_present,
                'today_total': today_total,
                'today_percentage': round((today_present / today_total) * 100, 1) if today_total > 0 else 0
            })

        subjects = user.assigned_subjects.all()
        total_students = Student.objects.filter(
            subjects__in=subjects,
            is_active=True
        ).distinct().count()

        today_records = AttendanceRecord.objects.filter(
            teacher=user,
            date=today
        )
        today_present = today_records.filter(status='PRESENT').count()
        today_total = today_records.count()

        last_7_days = []
        for i in range(6, -1, -1):
            day = today - timedelta(days=i)
            day_records = AttendanceRecord.objects.filter(
                teacher=user,
                date=day
            )
            day_total = day_records.count()
            day_present = day_records.filter(status='PRESENT').count()
            last_7_days.append({
                'date': day.isoformat(),
                'total': day_total,
                'present': day_present,
                'percentage': round((day_present / day_total) * 100, 1) if day_total > 0 else 0
            })

        return Response({
            'total_subjects': subjects.count(),
            'total_students': total_students,
            'today_present': today_present,
            'today_total': today_total,
            'today_percentage': round((today_present / today_total) * 100, 1) if today_total > 0 else 0,
            'last_7_days': last_7_days
        })


class AttendanceAuditView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        queryset = AttendanceRecord.objects.all().select_related(
            'student', 'subject', 'teacher'
        )

        subject_id = request.query_params.get('subject')
        teacher_id = request.query_params.get('teacher')
        date_from = request.query_params.get('date_from')
        date_to = request.query_params.get('date_to')

        if subject_id:
            queryset = queryset.filter(subject_id=subject_id)
        if teacher_id:
            queryset = queryset.filter(teacher_id=teacher_id)
        if date_from:
            queryset = queryset.filter(date__gte=date_from)
        if date_to:
            queryset = queryset.filter(date__lte=date_to)

        queryset = queryset[:500]

        return Response({
            'count': queryset.count(),
            'records': AttendanceRecordSerializer(queryset, many=True).data
        })
