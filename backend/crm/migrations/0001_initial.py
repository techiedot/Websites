from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Customer",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("name", models.CharField(max_length=255)),
                ("email", models.EmailField(max_length=254)),
                ("phone", models.CharField(blank=True, max_length=32)),
                ("company", models.CharField(blank=True, max_length=255)),
                ("address", models.CharField(blank=True, max_length=255)),
                ("project_type", models.CharField(blank=True, max_length=255)),
                ("budget", models.CharField(blank=True, max_length=128)),
                ("notes", models.TextField(blank=True)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
        migrations.CreateModel(
            name="ContactEmail",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("from_name", models.CharField(max_length=255)),
                ("from_email", models.EmailField(max_length=254)),
                ("phone", models.CharField(blank=True, max_length=32)),
                ("subject", models.CharField(max_length=255)),
                ("message", models.TextField()),
                ("source", models.CharField(default="web", max_length=64)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                (
                    "customer",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="emails",
                        to="crm.customer",
                    ),
                ),
            ],
            options={
                "ordering": ["-created_at"],
            },
        ),
    ]
