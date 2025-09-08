from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import SellerMessage
from .serializers import SellerMessageSerializer
from rest_framework.permissions import IsAuthenticated


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def message_list(request):
    if request.method == 'POST':
        user = request.user if request.user and request.user.is_authenticated else None
        if not user:
            return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
        receiver = request.data.get('receiver')
        message = request.data.get('message')
        if not receiver or not message:
            return Response({'detail': 'receiver and message required'}, status=status.HTTP_400_BAD_REQUEST)
        msg = SellerMessage.objects.create(sender=user, receiver_id=receiver, message=message)
        return Response(SellerMessageSerializer(msg).data, status=status.HTTP_201_CREATED)
    qs = SellerMessage.objects.select_related('sender', 'receiver').all()
    return Response({'messages': SellerMessageSerializer(qs, many=True).data})
