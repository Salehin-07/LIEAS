# Generated by Django 5.2.2 on 2025-07-03 09:16

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leader', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='events',
            old_name='event_year',
            new_name='event_month',
        ),
        migrations.AddField(
            model_name='events',
            name='img_url',
            field=models.CharField(default=12, max_length=500),
            preserve_default=False,
        ),
    ]
