from rest_framework import serializers
from .models import SellerMessage


class SellerMessageSerializer(serializers.ModelSerializer):
    senderName = serializers.SerializerMethodField()
    receiverName = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()

    class Meta:
        model = SellerMessage
        fields = ['id', 'sender', 'receiver', 'message', 'senderName', 'receiverName', 'date']

    def get_senderName(self, obj: SellerMessage):
        return obj.sender.get_full_name() or obj.sender.username

    def get_receiverName(self, obj: SellerMessage):
        return obj.receiver.get_full_name() or obj.receiver.username

    def get_date(self, obj: SellerMessage):
        return (obj.created_at.date().isoformat() if obj.created_at else '')
