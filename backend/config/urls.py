from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/shop/', include(('shop.urls', 'shop'), namespace='shop')),
    path('api/users/', include(('users.urls', 'users'), namespace='users')),
    path('api/products/', include(('products.urls', 'products'), namespace='products')),
    path('api/orders/', include(('orders.urls', 'orders'), namespace='orders')),
    path('api/support/', include(('support.urls', 'support'), namespace='support')),
    path('api/payments/', include(('payments.urls', 'payments'), namespace='payments')),
    path('api/reports/', include(('reports.urls', 'reports'), namespace='reports')),
    path('api/seller-messages/', include(('seller_messages.urls', 'seller_messages'), namespace='seller_messages')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
