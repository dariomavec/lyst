# Generated by Django 2.0.6 on 2018-07-14 22:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Ingredient',
            fields=[
                ('name', models.CharField(max_length=200, primary_key=True, serialize=False)),
                ('unit', models.CharField(default='', max_length=200)),
                ('type', models.CharField(default='', max_length=200)),
            ],
        ),
        migrations.CreateModel(
            name='List',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.DecimalField(decimal_places=2, max_digits=10)),
                ('ingredient', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Ingredient')),
            ],
        ),
        migrations.CreateModel(
            name='Recipe',
            fields=[
                ('name', models.CharField(max_length=200, primary_key=True, serialize=False)),
                ('ingredient', models.ManyToManyField(through='api.List', to='api.Ingredient')),
            ],
        ),
        migrations.AddField(
            model_name='list',
            name='recipe',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Recipe'),
        ),
    ]
