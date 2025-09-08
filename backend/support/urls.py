from django.urls import path
from . import views

urlpatterns = [
    path('', views.ticket_list, name='ticket-list'),
]
