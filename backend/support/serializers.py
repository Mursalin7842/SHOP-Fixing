from rest_framework import serializers
from .models import SupportTicket


class SupportTicketSerializer(serializers.ModelSerializer):
    userName = serializers.SerializerMethodField()
    date = serializers.SerializerMethodField()

    class Meta:
        model = SupportTicket
        fields = ['id', 'subject', 'message', 'status', 'userName', 'date']

    def get_userName(self, obj: SupportTicket):
        return obj.user.get_full_name() or obj.user.username

    def get_date(self, obj: SupportTicket):
        return (obj.created_at.date().isoformat() if obj.created_at else '')
