from rest_framework import serializers
from .models import Subject
from accounts.serializers import UserSerializer


class SubjectSerializer(serializers.ModelSerializer):
    teachers_detail = UserSerializer(source='teachers', many=True, read_only=True)
    teacher_ids = serializers.PrimaryKeyRelatedField(
        source='teachers',
        many=True,
        queryset=UserSerializer.Meta.model.objects.all(),
        write_only=True,
        required=False
    )
    student_count = serializers.SerializerMethodField()

    class Meta:
        model = Subject
        fields = [
            'id', 'name', 'code', 'description',
            'teachers_detail', 'teacher_ids',
            'student_count', 'created_at', 'updated_at'
        ]

    def get_student_count(self, obj):
        return obj.enrolled_students.filter(is_active=True).count()
