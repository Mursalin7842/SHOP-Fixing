from django.urls import path
from . import views

urlpatterns = [
    path('', views.shop_groups, name='shop-groups'),
    path('public/', views.shop_list_public, name='shop-list-public'),
    path('<int:pk>/', views.shop_detail_admin, name='shop-detail-admin'),
    path('<int:pk>/approve/', views.approve_shop, name='shop-approve'),
    path('<int:pk>/reject/', views.reject_shop, name='shop-reject'),
    path('mine/', views.my_shops, name='my-shops'),
    path('mine/<int:pk>/', views.my_shop_detail, name='my-shop-detail'),
    path('submit/', views.submit_shop, name='submit-shop'),
    path('<int:pk>/upload-document/', views.upload_document, name='upload-document'),
    path('<int:pk>/upload-attachment/', views.upload_attachment, name='upload-attachment'),
]
