from rest_framework import serializers
from .models import Student
from subjects.serializers import SubjectSerializer


class StudentSerializer(serializers.ModelSerializer):
    subjects_detail = SubjectSerializer(source='subjects', many=True, read_only=True)
    subject_ids = serializers.PrimaryKeyRelatedField(
        source='subjects',
        many=True,
        queryset=SubjectSerializer.Meta.model.objects.all(),
        write_only=True,
        required=False
    )

    class Meta:
        model = Student
        fields = [
            'id', 'first_name', 'last_name', 'roll_number',
            'email', 'phone_number', 'subjects_detail',
            'subject_ids', 'is_active', 'created_at', 'updated_at'
        ]


class StudentMinimalSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'first_name', 'last_name', 'roll_number']
