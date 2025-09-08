from django.db import models
from users.models import User

class Payment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=50)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Payout(models.Model):
    METHOD_BANK = 'BANK'
    METHOD_MOBILE = 'MOBILE'
    METHOD_CARD = 'CARD'
    METHOD_CHOICES = [
        (METHOD_BANK, 'Bank Transfer'),
        (METHOD_MOBILE, 'Mobile Wallet'),
        (METHOD_CARD, 'Card'),
    ]

    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payouts')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=10, choices=METHOD_CHOICES)

    # Banking details (optional depending on method)
    bank_name = models.CharField(max_length=100, blank=True)
    account_number = models.CharField(max_length=64, blank=True)
    routing_number = models.CharField(max_length=64, blank=True)
    holder_name = models.CharField(max_length=100, blank=True)

    mobile_provider = models.CharField(max_length=50, blank=True)
    mobile_wallet_number = models.CharField(max_length=64, blank=True)

    card_brand = models.CharField(max_length=20, blank=True)
    card_last4 = models.CharField(max_length=4, blank=True)

    status = models.CharField(max_length=20, default='Pending')  # Pending, Approved, Rejected, Paid
    requested_at = models.DateTimeField(auto_now_add=True)
    processed_at = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"Payout {self.pk} - {self.seller.username} - {self.amount} ({self.status})"
