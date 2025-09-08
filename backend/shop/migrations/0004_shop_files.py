from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('shop', '0003_alter_shop_status'),
    ]

    operations = [
        migrations.CreateModel(
            name='ShopDocument',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('doc_type', models.CharField(choices=[('NID', 'National ID'), ('TradeLicense', 'Trade License'), ('Tax', 'Tax Document'), ('Other', 'Other')], max_length=32)),
                ('number', models.CharField(blank=True, max_length=128)),
                ('file', models.FileField(upload_to='shop_docs/%Y/%m/%d/')),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('shop', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='documents', to='shop.shop')),
            ],
        ),
        migrations.CreateModel(
            name='ShopAttachment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('file', models.FileField(upload_to='shop_attachments/%Y/%m/%d/')),
                ('name', models.CharField(blank=True, max_length=255)),
                ('uploaded_at', models.DateTimeField(auto_now_add=True)),
                ('shop', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='attachments', to='shop.shop')),
            ],
        ),
    ]
