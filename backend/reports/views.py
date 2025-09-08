from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Report
from .serializers import ReportSerializer


@api_view(['GET'])
def report_list(request):
    qs = Report.objects.select_related('user').all()
    return Response({'reports': ReportSerializer(qs, many=True).data})
