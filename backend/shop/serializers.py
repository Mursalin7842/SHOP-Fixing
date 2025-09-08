from rest_framework import serializers
from .models import Shop, ShopDocument, ShopAttachment
from products.models import Product
from products.serializers import ProductSerializer


class ShopDocumentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    class Meta:
        model = ShopDocument
        fields = ['id', 'doc_type', 'number', 'file', 'file_url', 'uploaded_at']

    def get_file_url(self, obj):
        request = self.context.get('request') if isinstance(self.context, dict) else None
        if hasattr(obj, 'file') and obj.file:
            url = obj.file.url
            return request.build_absolute_uri(url) if request else url
        return None


class ShopAttachmentSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    class Meta:
        model = ShopAttachment
        fields = ['id', 'name', 'file', 'file_url', 'uploaded_at']

    def get_file_url(self, obj):
        request = self.context.get('request') if isinstance(self.context, dict) else None
        if hasattr(obj, 'file') and obj.file:
            url = obj.file.url
            return request.build_absolute_uri(url) if request else url
        return None


class ShopSerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Shop
        fields = ['id', 'name', 'owner', 'status', 'created_at', 'updated_at', 'product_count']

    def get_product_count(self, obj):
        return Product.objects.filter(shop=obj).count()


class ShopDetailSerializer(serializers.ModelSerializer):
    documents = ShopDocumentSerializer(many=True, read_only=True)
    attachments = ShopAttachmentSerializer(many=True, read_only=True)
    products = serializers.SerializerMethodField()
    product_count = serializers.SerializerMethodField()

    class Meta:
        model = Shop
        fields = ['id', 'name', 'owner', 'status', 'created_at', 'updated_at', 'product_count', 'products', 'documents', 'attachments']

    def get_products(self, obj):
        qs = Product.objects.filter(shop=obj)
        return ProductSerializer(qs, many=True, context=self.context).data

    def get_product_count(self, obj):
        return Product.objects.filter(shop=obj).count()
