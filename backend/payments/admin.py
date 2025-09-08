from django.contrib import admin
from .models import Payment, Payout

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'amount', 'status', 'created_at')


@admin.register(Payout)
class PayoutAdmin(admin.ModelAdmin):
    list_display = ('id', 'seller', 'amount', 'method', 'status', 'requested_at', 'processed_at')
    list_filter = ('status', 'method')
