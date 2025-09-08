from django.urls import path
from . import views

urlpatterns = [
    path('', views.user_list, name='user-list'),
    path('sellers/', views.sellers_summary, name='sellers-summary'),
    path('sellers/<int:pk>/approve/', views.approve_seller, name='seller-approve'),
    path('sellers/<int:pk>/reject/', views.reject_seller, name='seller-reject'),
    path('register-seller/', views.register_seller, name='register-seller'),
    path('me/', views.me, name='me'),
]
