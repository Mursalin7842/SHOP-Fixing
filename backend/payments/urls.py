from django.urls import path
from . import views

urlpatterns = [
    path('', views.payment_list, name='payment-list'),
    path('payouts/', views.payout_list, name='payout-list'),
    path('payouts/create/', views.create_payout, name='payout-create'),
    path('payouts/<str:payout_id>/approve/', views.approve_payout, name='payout-approve'),
    path('payouts/<str:payout_id>/reject/', views.reject_payout, name='payout-reject'),
    # Seller endpoints
    path('payouts/mine/', views.my_payouts, name='my-payouts'),
    path('payouts/mine/<str:payout_id>/cancel/', views.cancel_my_payout, name='my-payout-cancel'),
    path('payouts/mine/<str:payout_id>/confirm/', views.confirm_my_payout, name='my-payout-confirm'),
]
