from rest_framework import serializers
from .models import Report


class ReportSerializer(serializers.ModelSerializer):
    userId = serializers.SerializerMethodField()
    subject = serializers.CharField(source='type')
    date = serializers.SerializerMethodField()

    class Meta:
        model = Report
        fields = ['id', 'userId', 'subject', 'status', 'date', 'details']

    def get_userId(self, obj: Report):
        return f'USR-{obj.user.pk}'

    def get_date(self, obj: Report):
        return (obj.created_at.date().isoformat() if obj.created_at else '')
