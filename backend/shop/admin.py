from django.contrib import admin
from .models import Shop
from .models import ShopDocument, ShopAttachment

@admin.register(Shop)
class ShopAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'owner', 'status', 'created_at')
    list_filter = ('status',)
    search_fields = ('name',)

@admin.register(ShopDocument)
class ShopDocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'shop', 'doc_type', 'number', 'uploaded_at')
    list_filter = ('doc_type',)
    search_fields = ('number', 'shop__name')

@admin.register(ShopAttachment)
class ShopAttachmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'shop', 'name', 'uploaded_at')
    search_fields = ('name', 'shop__name')
