from rest_framework import status, generics
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    UserSerializer,
    TeacherApprovalSerializer
)
from .permissions import IsAdmin


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                'message': 'Registration successful. Waiting for admin approval.',
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                },
                'user': UserSerializer(user).data
            },
            status=status.HTTP_201_CREATED
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )

        if not user:
            return Response(
                {'error': 'Invalid email or password.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            },
            'user': UserSerializer(user).data
        })


class AdminLoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )

        if not user or user.role != 'ADMIN':
            return Response(
                {'error': 'Invalid credentials.'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        refresh = RefreshToken.for_user(user)

        return Response({
            'tokens': {
                'access': str(refresh.access_token),
                'refresh': str(refresh),
            },
            'user': UserSerializer(user).data
        })


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response(UserSerializer(request.user).data)

    def patch(self, request):
        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class TeacherListView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAdmin]

    def get_queryset(self):
        queryset = User.objects.filter(role='TEACHER')
        approval_status = self.request.query_params.get('status')
        if approval_status == 'pending':
            queryset = queryset.filter(is_approved=False)
        elif approval_status == 'approved':
            queryset = queryset.filter(is_approved=True)
        return queryset


class TeacherApprovalView(APIView):
    permission_classes = [IsAdmin]

    def patch(self, request, pk):
        try:
            teacher = User.objects.get(pk=pk, role='TEACHER')
        except User.DoesNotExist:
            return Response(
                {'error': 'Teacher not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        serializer = TeacherApprovalSerializer(
            teacher,
            data=request.data,
            partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        action = 'approved' if teacher.is_approved else 'rejected'
        return Response({
            'message': f'Teacher {action} successfully.',
            'teacher': UserSerializer(teacher).data
        })


class TeacherDeleteView(APIView):
    permission_classes = [IsAdmin]

    def delete(self, request, pk):
        try:
            teacher = User.objects.get(pk=pk, role='TEACHER')
        except User.DoesNotExist:
            return Response(
                {'error': 'Teacher not found.'},
                status=status.HTTP_404_NOT_FOUND
            )

        teacher.delete()
        return Response(
            {'message': 'Teacher deleted successfully.'},
            status=status.HTTP_204_NO_CONTENT
        )


class CheckApprovalView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'is_approved': request.user.is_approved,
            'role': request.user.role
        })
