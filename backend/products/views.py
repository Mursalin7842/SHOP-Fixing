from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer
from shop.models import Shop
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny


@api_view(['GET'])
@permission_classes([IsAdminUser])
def product_groups(request):
    qs = Product.objects.all()
    serialize = lambda q: ProductSerializer(q, many=True).data
    groups = {
        'pending': serialize(qs.filter(status='pending')),
        'approved': serialize(qs.filter(status='approved')),
        'rejected': serialize(qs.filter(status='rejected')),
        'flagged': serialize(qs.filter(status='flagged')),
        'modification': serialize(qs.filter(status='modification')),
    }
    return Response(groups)


@api_view(['GET'])
@permission_classes([AllowAny])
def product_groups_public(request):
    qs = Product.objects.all()
    serialize = lambda q: ProductSerializer(q, many=True).data
    groups = {
        'approved': serialize(qs.filter(status='approved')),
    }
    return Response(groups)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_product(request, pk: int):
    try:
        p = Product.objects.get(pk=pk)
        p.status = 'approved'
        p.save(update_fields=['status', 'updated_at'])
        return Response({'ok': True})
    except Product.DoesNotExist:
        return Response({'ok': False, 'error': 'not_found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def reject_product(request, pk: int):
    try:
        p = Product.objects.get(pk=pk)
        p.status = 'rejected'
        p.save(update_fields=['status', 'updated_at'])
        return Response({'ok': True})
    except Product.DoesNotExist:
        return Response({'ok': False, 'error': 'not_found'}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_products(request):
    user = request.user if request.user and request.user.is_authenticated else None
    if not user:
        return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    shops = Shop.objects.filter(owner=user)
    qs = Product.objects.filter(shop__in=shops)
    return Response(ProductSerializer(qs, many=True).data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_product(request):
    user = request.user if request.user and request.user.is_authenticated else None
    if not user:
        return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    shop_id = request.data.get('shop')
    name = request.data.get('name')
    price = request.data.get('price')
    category = request.data.get('category', '')
    description = request.data.get('description', '')
    if not shop_id or not name or price is None:
        return Response({'detail': 'Missing fields'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        shop = Shop.objects.get(pk=shop_id, owner=user)
    except Shop.DoesNotExist:
        return Response({'detail': 'Shop not found'}, status=status.HTTP_404_NOT_FOUND)
    p = Product.objects.create(shop=shop, name=name, price=price, description=description, category=category, status='pending')
    return Response(ProductSerializer(p).data, status=status.HTTP_201_CREATED)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_stock(request, pk: int):
    try:
        p = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'detail': 'not found'}, status=404)
    stock = request.data.get('stock')
    # Demo model lacks stock; ignore or extend model in real implementation
    return Response({'ok': True})


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def request_edit(request, pk: int):
    try:
        _ = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({'detail': 'not found'}, status=404)
    # Accept and noop store pending changes for demo
    return Response({'ok': True})
