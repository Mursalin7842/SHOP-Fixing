from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ( 'id', 'name', 'shop', 'status', 'price', 'created_at')
    list_filter = ('status', 'shop')
    search_fields = ('name',)
