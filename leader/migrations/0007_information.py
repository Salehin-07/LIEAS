# Generated by Django 5.2.2 on 2025-07-19 09:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('leader', '0006_address_email_map_phone_worktime'),
    ]

    operations = [
        migrations.CreateModel(
            name='Information',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('students_number', models.IntegerField(default=0)),
                ('pass_rate', models.IntegerField(default=100)),
                ('teacher_number', models.IntegerField(default=10)),
            ],
        ),
    ]
