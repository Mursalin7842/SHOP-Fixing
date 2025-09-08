from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth import get_user_model
from typing import cast
from .models import User
from shop.models import Shop
from .serializers import UserSerializer


@api_view(['GET'])
def user_list(request):
    data = UserSerializer(User.objects.all(), many=True).data
    return Response({'users': data})


@api_view(['GET'])
def sellers_summary(request):
    # Provide sellers with status based on activation
    sellers = []
    for u in User.objects.filter(is_seller=True):
        shop_count = Shop.objects.filter(owner=u).count()
        sellers.append({
            'id': u.pk,
            'name': u.get_full_name() or u.username,
            'email': u.email,
            'status': 'approved' if u.is_active else 'pending',
            'dateApplied': (u.date_joined.date().isoformat() if hasattr(u, 'date_joined') else ''),
            'shopName': '',  # Placeholder single shop label
            'shopsCount': shop_count,
        })
    return Response({'sellers': sellers})


@api_view(['POST'])
def register_seller(request):
    # Minimal seller registration: create inactive seller user awaiting admin approval
    UserModel = get_user_model()
    username = request.data.get('username')
    email = request.data.get('email', '')
    password = request.data.get('password')
    if not username or not password:
        return Response({'detail': 'username and password required'}, status=status.HTTP_400_BAD_REQUEST)
    if UserModel.objects.filter(username=username).exists():
        return Response({'detail': 'username already exists'}, status=status.HTTP_400_BAD_REQUEST)
    user_obj = UserModel.objects.create_user(username=username, email=email)
    user_obj.set_password(password)
    user: User = cast(User, user_obj)
    user.is_seller = True
    user.is_active = False  # require admin approval
    user.save(update_fields=['password', 'is_seller', 'is_active'])
    return Response({'ok': True, 'message': 'Registration received. Awaiting admin approval.'}, status=status.HTTP_201_CREATED)


@api_view(['POST'])
def approve_seller(request, pk: int):
    try:
        user = User.objects.get(pk=pk, is_seller=True)
    except User.DoesNotExist:
        return Response({'ok': False, 'error': 'not_found'}, status=404)
    user.is_active = True
    user.save(update_fields=['is_active'])
    return Response({'ok': True})


@api_view(['POST'])
def reject_seller(request, pk: int):
    try:
        user = User.objects.get(pk=pk, is_seller=True)
    except User.DoesNotExist:
        return Response({'ok': False, 'error': 'not_found'}, status=404)
    # Keep user but ensure inactive; optionally record reason (omitted for brevity)
    user.is_active = False
    user.save(update_fields=['is_active'])
    return Response({'ok': True})


@api_view(['GET'])
def me(request):
    if not request.user or not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'}, status=401)
    u = request.user
    return Response({
        'id': u.id,
        'username': u.username,
        'email': u.email,
        'is_staff': u.is_staff,
        'is_superuser': getattr(u, 'is_superuser', False),
        'is_seller': getattr(u, 'is_seller', False),
    })
