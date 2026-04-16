from django.db import models
from subjects.models import Subject


class Student(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    roll_number = models.CharField(max_length=20, unique=True)
    email = models.EmailField(blank=True)
    phone_number = models.CharField(max_length=15, blank=True)
    subjects = models.ManyToManyField(
        Subject,
        related_name='enrolled_students',
        blank=True
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['roll_number']

    def __str__(self):
        return f"{self.roll_number} - {self.first_name} {self.last_name}"
