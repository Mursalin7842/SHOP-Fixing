from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Order
from .serializers import OrderSerializer
from rest_framework.permissions import IsAdminUser


@api_view(['GET'])
def order_list(request):
    qs = Order.objects.select_related('user', 'product', 'product__shop').all()
    return Response({'orders': OrderSerializer(qs, many=True).data})


@api_view(['PATCH'])
@permission_classes([IsAdminUser])
def update_order_status(request):
    order_id = request.data.get('id')
    status_val = request.data.get('status')
    if not order_id or not status_val:
        return Response({'detail': 'id and status required'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        o = Order.objects.get(pk=order_id)
    except Order.DoesNotExist:
        return Response({'detail': 'not found'}, status=404)
    o.status = status_val
    o.save(update_fields=['status', 'updated_at'])
    return Response({'ok': True})
