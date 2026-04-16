from rest_framework.permissions import BasePermission


class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'ADMIN'
        )


class IsApprovedTeacher(BasePermission):
    def has_permission(self, request, view):
        return (
            request.user
            and request.user.is_authenticated
            and request.user.role == 'TEACHER'
            and request.user.is_approved
        )


class IsAdminOrApprovedTeacher(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if request.user.role == 'ADMIN':
            return True
        if request.user.role == 'TEACHER' and request.user.is_approved:
            return True
        return False
