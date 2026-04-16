from rest_framework import serializers
from .models import AttendanceRecord
from students.serializers import StudentMinimalSerializer


class AttendanceRecordSerializer(serializers.ModelSerializer):
    student_detail = StudentMinimalSerializer(source='student', read_only=True)
    teacher_name = serializers.SerializerMethodField()
    subject_name = serializers.CharField(source='subject.name', read_only=True)
    student_name = serializers.SerializerMethodField()

    class Meta:
        model = AttendanceRecord
        fields = [
            'id', 'student', 'subject', 'teacher',
            'date', 'status', 'student_detail',
            'teacher_name', 'subject_name', 'student_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'teacher', 'created_at', 'updated_at']

    def get_teacher_name(self, obj):
        if obj.teacher:
            return f"{obj.teacher.first_name} {obj.teacher.last_name}"
        return ""

    def get_student_name(self, obj):
        if obj.student:
            return f"{obj.student.first_name} {obj.student.last_name}"
        return ""


class BulkAttendanceSerializer(serializers.Serializer):
    subject_id = serializers.IntegerField()
    date = serializers.DateField()
    records = serializers.ListField(
        child=serializers.DictField()
    )

    def validate_records(self, value):
        for record in value:
            if 'student_id' not in record or 'status' not in record:
                raise serializers.ValidationError(
                    'Each record must have student_id and status.'
                )
            if record['status'] not in ['PRESENT', 'ABSENT']:
                raise serializers.ValidationError(
                    'Status must be PRESENT or ABSENT.'
                )
        return value

