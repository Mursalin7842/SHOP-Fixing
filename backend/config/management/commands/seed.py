from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from typing import cast
from shop.models import Shop
from products.models import Product
from users.models import User as UserType


class Command(BaseCommand):
    help = 'Seed development data for admin and seller frontends'

    def handle(self, *args, **options):
        UserModel = get_user_model()

        # Admin user
        if not UserModel.objects.filter(username='admin').exists():
            UserModel.objects.create_superuser('admin', 'admin@example.com', 'admin123')
            self.stdout.write(self.style.SUCCESS('Created admin user admin/admin123'))

        # Sellers
        s1_obj, _ = UserModel.objects.get_or_create(
            username='jane', defaults={'email': 'jane@example.com'}
        )
        s1: UserType = cast(UserType, s1_obj)
        s1.is_seller = True
        s1.set_password('pass1234')
        s1.save()

        s2_obj, _ = UserModel.objects.get_or_create(
            username='sam', defaults={'email': 'sam@example.com'}
        )
        s2: UserType = cast(UserType, s2_obj)
        s2.is_seller = True
        s2.set_password('pass1234')
        s2.save()

        # Shops
        shop1, _ = Shop.objects.get_or_create(
            name="Smith's Wares", owner=s1, defaults={'status': 'approved'}
        )
        shop2, _ = Shop.objects.get_or_create(
            name='Green Thumb Gardens', owner=s2, defaults={'status': 'pending'}
        )

        # Products
        Product.objects.get_or_create(
            shop=shop1,
            name='Cyber-Knit Jacket',
            defaults={'price': 350.00, 'status': 'approved', 'description': 'Smart fabric jacket'},
        )
        Product.objects.get_or_create(
            shop=shop1,
            name='Aether-Light Sneakers',
            defaults={'price': 120.00, 'status': 'pending', 'description': 'Lightweight sneakers'},
        )
        Product.objects.get_or_create(
            shop=shop2,
            name='Quantum Headset',
            defaults={'price': 199.99, 'status': 'pending', 'description': 'Immersive 7.1 sound'},
        )

        self.stdout.write(self.style.SUCCESS('Seeding complete'))
