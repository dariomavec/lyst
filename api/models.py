from django.db import models
# from django.db.models import Q, F, FloatField, Count, Sum, Value, DecimalField
# from django.db.models.functions import Cast


class Ingredient(models.Model):
    name = models.CharField(max_length=200)
    unit = models.CharField(max_length=200, default='')
    type = models.CharField(max_length=200, default='')
    def __str__(self):
        return self


class Recipe(models.Model):
    name = models.CharField(max_length=200)
    ingredients = models.ManyToManyField(Ingredient)

    def __str__(self):
        return self