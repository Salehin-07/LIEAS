# Generated by Django 5.2.2 on 2025-07-25 14:24

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leader', '0012_alter_missions_emoji'),
    ]

    operations = [
        migrations.CreateModel(
            name='Teachers',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('subject', models.CharField(max_length=100)),
                ('qualification', models.CharField(max_length=200)),
                ('experience', models.PositiveIntegerField(validators=[django.core.validators.MinValueValidator(0), django.core.validators.MaxValueValidator(50)])),
                ('img_url', models.URLField(max_length=500)),
                ('bio', models.TextField(blank=True, null=True)),
                ('email', models.EmailField(blank=True, max_length=254, null=True)),
                ('phone', models.CharField(blank=True, max_length=20, null=True)),
                ('is_active', models.BooleanField(default=True)),
                ('joined_date', models.DateField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Teacher',
                'verbose_name_plural': 'Teachers',
                'ordering': ['name'],
            },
        ),
        migrations.AlterModelOptions(
            name='achievements',
            options={'ordering': ['award_name'], 'verbose_name': 'Award', 'verbose_name_plural': 'Awards'},
        ),
        migrations.AlterModelOptions(
            name='history',
            options={'ordering': ['title'], 'verbose_name': 'History', 'verbose_name_plural': 'History'},
        ),
        migrations.AlterModelOptions(
            name='information',
            options={'verbose_name': 'Information', 'verbose_name_plural': 'Information'},
        ),
        migrations.AlterModelOptions(
            name='map',
            options={'ordering': ['title'], 'verbose_name': 'Map', 'verbose_name_plural': 'Maps'},
        ),
        migrations.AlterModelOptions(
            name='missions',
            options={'ordering': ['title'], 'verbose_name': 'Mission', 'verbose_name_plural': 'Missions'},
        ),
        migrations.AlterModelOptions(
            name='values',
            options={'ordering': ['title'], 'verbose_name': 'Value', 'verbose_name_plural': 'Values'},
        ),
    ]
