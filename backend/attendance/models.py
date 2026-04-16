from django.db import models
from django.conf import settings
from students.models import Student
from subjects.models import Subject


class AttendanceRecord(models.Model):
    class Status(models.TextChoices):
        PRESENT = 'PRESENT', 'Present'
        ABSENT = 'ABSENT', 'Absent'

    student = models.ForeignKey(
        Student,
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )
    teacher = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='attendance_records'
    )
    date = models.DateField()
    status = models.CharField(
        max_length=10,
        choices=Status.choices,
        default=Status.ABSENT
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-date', 'student__roll_number']
        unique_together = ['student', 'subject', 'date']

    def __str__(self):
        return f"{self.student.roll_number} - {self.subject.code} - {self.date} - {self.status}"
