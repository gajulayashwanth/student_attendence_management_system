from rest_framework import serializers
from .models import User


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name',
            'phone_number', 'password', 'confirm_password'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({
                'confirm_password': 'Passwords do not match.'
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            'id', 'email', 'first_name', 'last_name',
            'phone_number', 'role', 'is_approved',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'role', 'is_approved', 'created_at', 'updated_at']


class TeacherApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'is_approved']
        read_only_fields = ['id']
