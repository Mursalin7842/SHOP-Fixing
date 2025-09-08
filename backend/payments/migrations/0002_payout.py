from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
        ('payments', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Payout',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('amount', models.DecimalField(decimal_places=2, max_digits=10)),
                ('method', models.CharField(choices=[('BANK', 'Bank Transfer'), ('MOBILE', 'Mobile Wallet'), ('CARD', 'Card')], max_length=10)),
                ('bank_name', models.CharField(blank=True, max_length=100)),
                ('account_number', models.CharField(blank=True, max_length=64)),
                ('routing_number', models.CharField(blank=True, max_length=64)),
                ('holder_name', models.CharField(blank=True, max_length=100)),
                ('mobile_provider', models.CharField(blank=True, max_length=50)),
                ('mobile_wallet_number', models.CharField(blank=True, max_length=64)),
                ('card_brand', models.CharField(blank=True, max_length=20)),
                ('card_last4', models.CharField(blank=True, max_length=4)),
                ('status', models.CharField(default='Pending', max_length=20)),
                ('requested_at', models.DateTimeField(auto_now_add=True)),
                ('processed_at', models.DateTimeField(blank=True, null=True)),
                ('seller', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='payouts', to='users.user')),
            ],
        ),
    ]
