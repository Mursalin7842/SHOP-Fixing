from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from .models import Shop
from .serializers import ShopSerializer, ShopDetailSerializer, ShopDocumentSerializer, ShopAttachmentSerializer
from .models import ShopDocument, ShopAttachment
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.shortcuts import get_object_or_404


@api_view(['GET'])
@permission_classes([IsAdminUser])
def shop_groups(request):
    qs = Shop.objects.all()
    serialize = lambda q: ShopSerializer(q, many=True).data
    groups = {
        'pending': serialize(qs.filter(status='pending')),
        'approved': serialize(qs.filter(status='approved')),
        'rejected': serialize(qs.filter(status='rejected')),
        'modification': serialize(qs.filter(status='modification')),
    }
    return Response(groups)


@api_view(['GET'])
@permission_classes([AllowAny])  # make a lightweight public listing (can tighten later)
def shop_list_public(request):
    qs = Shop.objects.all()
    data = ShopSerializer(qs, many=True).data
    return Response({'shops': data})


@api_view(['POST'])
@permission_classes([IsAdminUser])
def approve_shop(request, pk: int):
    try:
        s = Shop.objects.get(pk=pk)
        s.status = 'approved'
        s.save(update_fields=['status', 'updated_at'])
        return Response({'ok': True})
    except Shop.DoesNotExist:
        return Response({'ok': False, 'error': 'not_found'}, status=404)


@api_view(['POST'])
@permission_classes([IsAdminUser])
def reject_shop(request, pk: int):
    try:
        s = Shop.objects.get(pk=pk)
        s.status = 'rejected'
        s.save(update_fields=['status', 'updated_at'])
        return Response({'ok': True})
    except Shop.DoesNotExist:
        return Response({'ok': False, 'error': 'not_found'}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_shops(request):
    user = request.user if request.user and request.user.is_authenticated else None
    if not user:
        return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    qs = Shop.objects.filter(owner=user)
    return Response(ShopSerializer(qs, many=True).data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_shop_detail(request, pk: int):
    user = request.user
    shop = get_object_or_404(Shop, pk=pk, owner=user)
    serializer = ShopDetailSerializer(shop, context={'request': request})
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def submit_shop(request):
    user = request.user if request.user and request.user.is_authenticated else None
    if not user:
        return Response({'detail': 'Authentication required'}, status=status.HTTP_401_UNAUTHORIZED)
    name = request.data.get('name')
    if not name:
        return Response({'detail': 'name required'}, status=status.HTTP_400_BAD_REQUEST)
    s = Shop.objects.create(owner=user, name=name, status='pending')
    return Response(ShopSerializer(s).data, status=status.HTTP_201_CREATED)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_document(request, pk: int):
    user = request.user
    shop = get_object_or_404(Shop, pk=pk, owner=user)
    doc_type = request.data.get('doc_type') or request.data.get('type')
    number = request.data.get('number', '')
    file = request.FILES.get('file')
    if not file or not doc_type:
        return Response({'detail': 'file and doc_type are required'}, status=400)
    doc = ShopDocument.objects.create(shop=shop, doc_type=doc_type, number=number, file=file)
    serializer = ShopDocumentSerializer(doc, context={'request': request})
    return Response(serializer.data, status=201)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_attachment(request, pk: int):
    user = request.user
    shop = get_object_or_404(Shop, pk=pk, owner=user)
    file = request.FILES.get('file')
    name = request.data.get('name', '')
    if not file:
        return Response({'detail': 'file is required'}, status=400)
    att = ShopAttachment.objects.create(shop=shop, file=file, name=name or getattr(file, 'name', ''))
    serializer = ShopAttachmentSerializer(att, context={'request': request})
    return Response(serializer.data, status=201)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def shop_detail_admin(request, pk: int):
    shop = get_object_or_404(Shop, pk=pk)
    serializer = ShopDetailSerializer(shop, context={'request': request})
    return Response(serializer.data)
