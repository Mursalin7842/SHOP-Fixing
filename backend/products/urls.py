from django.urls import path
from . import views

urlpatterns = [
    path('', views.product_groups, name='product-groups'),
    path('public/', views.product_groups_public, name='product-groups-public'),
    path('<int:pk>/approve/', views.approve_product, name='product-approve'),
    path('<int:pk>/reject/', views.reject_product, name='product-reject'),
    path('mine/', views.my_products, name='my-products'),
    path('submit/', views.submit_product, name='submit-product'),
    path('<int:pk>/stock/', views.update_stock, name='product-update-stock'),
    path('<int:pk>/request-edit/', views.request_edit, name='product-request-edit'),
]
