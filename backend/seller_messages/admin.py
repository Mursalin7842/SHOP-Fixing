from django.contrib import admin
from .models import SellerMessage

@admin.register(SellerMessage)
class SellerMessageAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'receiver', 'created_at')
