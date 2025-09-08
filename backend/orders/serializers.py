from rest_framework import serializers
from .models import Order


class OrderSerializer(serializers.ModelSerializer):
    customer = serializers.SerializerMethodField()
    product_name = serializers.SerializerMethodField()
    shop = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()

    class Meta:
        model = Order
        fields = [
            'id', 'status', 'quantity',
            'customer', 'product_name', 'shop', 'date'
        ]

    def get_customer(self, obj: Order):
        return obj.user.get_full_name() or obj.user.username

    def get_product_name(self, obj: Order):
        return getattr(obj.product, 'name', '')

    def get_shop(self, obj: Order):
        try:
            return obj.product.shop.name
        except Exception:
            return ''

    def get_date(self, obj: Order):
        return (obj.created_at.date().isoformat() if obj.created_at else '')
