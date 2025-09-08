from django.urls import path
from . import views

urlpatterns = [
    path('', views.order_list, name='order-list'),
    path('update-status/', views.update_order_status, name='order-update-status'),
]
