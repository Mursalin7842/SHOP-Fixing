from django.db import models

# Shop model for seller/admin
class Shop(models.Model):
    name = models.CharField(max_length=255)
    owner = models.ForeignKey('users.User', on_delete=models.CASCADE)
    status = models.CharField(max_length=50, default='pending')  # pending|approved|rejected|modification
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class ShopDocument(models.Model):
    DOC_TYPES = [
        ('NID', 'National ID'),
        ('TradeLicense', 'Trade License'),
        ('Tax', 'Tax Document'),
        ('Other', 'Other'),
    ]
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='documents')
    doc_type = models.CharField(max_length=32, choices=DOC_TYPES)
    number = models.CharField(max_length=128, blank=True)
    file = models.FileField(upload_to='shop_docs/%Y/%m/%d/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


class ShopAttachment(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, related_name='attachments')
    file = models.FileField(upload_to='shop_attachments/%Y/%m/%d/')
    name = models.CharField(max_length=255, blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)
