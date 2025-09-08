from rest_framework import serializers
from django.utils.timezone import localdate
from .models import Payment, Payout


class PaymentSerializer(serializers.ModelSerializer):
    customer = serializers.SerializerMethodField()
    seller = serializers.SerializerMethodField()
    orderId = serializers.SerializerMethodField()
    total = serializers.DecimalField(max_digits=10, decimal_places=2, source='amount')
    date = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = ['id', 'orderId', 'customer', 'seller', 'total', 'date', 'status']

    def get_customer(self, obj: Payment):
        # demo: same as user
        return obj.user.get_full_name() or obj.user.username

    def get_seller(self, obj: Payment):
        return ''

    def get_orderId(self, obj: Payment):
        return f'ORD-{obj.pk:04d}'

    def get_date(self, obj: Payment):
        return (obj.created_at.date().isoformat() if obj.created_at else '')

class PayoutSerializer(serializers.ModelSerializer):
    seller = serializers.SerializerMethodField()
    requestedDate = serializers.SerializerMethodField()

    class Meta:
        model = Payout
        fields = [
            'id', 'seller', 'amount', 'method', 'status', 'requestedDate', 'processed_at',
            'bank_name', 'account_number', 'routing_number', 'holder_name',
            'mobile_provider', 'mobile_wallet_number',
            'card_brand', 'card_last4',
        ]

    def get_seller(self, obj: Payout):
        return obj.seller.get_full_name() or obj.seller.username

    def get_requestedDate(self, obj: Payout):
        try:
            return obj.requested_at.date().isoformat()
        except Exception:
            return localdate().isoformat()


class SellerPayoutRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payout
        fields = [
            'id', 'amount', 'method',
            'bank_name', 'account_number', 'routing_number', 'holder_name',
            'mobile_provider', 'mobile_wallet_number',
            'card_brand', 'card_last4',
        ]
        read_only_fields = ['id']
