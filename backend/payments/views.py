from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from .models import Payment, Payout
from .serializers import PaymentSerializer, PayoutSerializer, SellerPayoutRequestSerializer
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny


@api_view(['GET'])
def payment_list(request):
    """List payments.
    Authenticated admin sees all. Unauth/public gets empty list (no 401) to prevent frontend crash.
    """
    if request.user.is_authenticated and request.user.is_staff:
        qs = Payment.objects.select_related('user').all()
        data = PaymentSerializer(qs, many=True).data
    else:
        data = []
    return Response({'payments': data})


@api_view(['GET'])
def payout_list(request):
    """List payouts.
    Admin sees all. Public returns empty list (HTTP 200) to avoid 401 noise for exploratory UI loads.
    """
    if request.user.is_authenticated and request.user.is_staff:
        qs = Payout.objects.select_related('seller').order_by('-requested_at')
        data = PayoutSerializer(qs, many=True).data
    else:
        data = []
    return Response({'payouts': data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payout(request):
    # Seller creates a payout request with chosen method details (requires auth)
    serializer = SellerPayoutRequestSerializer(data=request.data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # basic balance check could go here; for now assume allowed
    payout = serializer.save(seller=request.user, status='Pending')
    return Response(PayoutSerializer(payout).data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_payout(request, payout_id: str):
    try:
        payout = Payout.objects.get(pk=payout_id)
    except Payout.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if payout.status not in ['Pending', 'Rejected']:
        return Response({'detail': 'Invalid status transition'}, status=status.HTTP_400_BAD_REQUEST)
    payout.status = 'Approved'
    payout.processed_at = timezone.now()
    payout.save(update_fields=['status', 'processed_at'])
    return Response(PayoutSerializer(payout).data)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def reject_payout(request, payout_id: str):
    try:
        payout = Payout.objects.get(pk=payout_id)
    except Payout.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if payout.status not in ['Pending', 'Approved']:
        return Response({'detail': 'Invalid status transition'}, status=status.HTTP_400_BAD_REQUEST)
    payout.status = 'Rejected'
    payout.processed_at = timezone.now()
    payout.save(update_fields=['status', 'processed_at'])
    return Response(PayoutSerializer(payout).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_payouts(request):
    qs = Payout.objects.filter(seller=request.user).order_by('-requested_at')
    return Response({'payouts': PayoutSerializer(qs, many=True).data})


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_my_payout(request, payout_id: str):
    try:
        payout = Payout.objects.get(pk=payout_id, seller=request.user)
    except Payout.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if payout.status != 'Pending':
        return Response({'detail': 'Only pending requests can be cancelled'}, status=status.HTTP_400_BAD_REQUEST)
    payout.status = 'Cancelled'
    payout.processed_at = timezone.now()
    payout.save(update_fields=['status', 'processed_at'])
    return Response(PayoutSerializer(payout).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_my_payout(request, payout_id: str):
    """Seller confirms/withdraws an approved payout -> mark as Paid."""
    try:
        payout = Payout.objects.get(pk=payout_id, seller=request.user)
    except Payout.DoesNotExist:
        return Response({'detail': 'Not found'}, status=status.HTTP_404_NOT_FOUND)
    if payout.status != 'Approved':
        return Response({'detail': 'Only approved payouts can be withdrawn'}, status=status.HTTP_400_BAD_REQUEST)
    payout.status = 'Paid'
    payout.processed_at = timezone.now()
    payout.save(update_fields=['status', 'processed_at'])
    return Response(PayoutSerializer(payout).data)
