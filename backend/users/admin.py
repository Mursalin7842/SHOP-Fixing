from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as DjangoUserAdmin
from .models import User

@admin.register(User)
class UserAdmin(DjangoUserAdmin):
    fieldsets = (*DjangoUserAdmin.fieldsets, (None, {'fields': ('is_seller',)}))
    add_fieldsets = (*DjangoUserAdmin.add_fieldsets, (None, {'fields': ('is_seller',)}))
    list_display = ('id', 'username', 'email', 'is_staff', 'is_seller')
