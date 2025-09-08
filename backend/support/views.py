from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import SupportTicket
from .serializers import SupportTicketSerializer
from rest_framework.permissions import IsAuthenticated


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def ticket_list(request):
    if request.method == 'POST':
        user = request.user if request.user and request.user.is_authenticated else None
        if not user:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        subject = request.data.get('subject')
        message = request.data.get('message')
        if not subject or not message:
            return Response({'detail': 'subject and message required'}, status=status.HTTP_400_BAD_REQUEST)
        t = SupportTicket.objects.create(user=user, subject=subject, message=message, status='open')
        return Response(SupportTicketSerializer(t).data, status=status.HTTP_201_CREATED)
    qs = SupportTicket.objects.select_related('user').all()
    return Response({'tickets': SupportTicketSerializer(qs, many=True).data})
