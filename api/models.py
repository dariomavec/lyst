from django.db import models
# from django.db.models import Q, F, FloatField, Count, Sum, Value, DecimalField
# from django.db.models.functions import Cast


class Ingredient(models.Model):
    name = models.CharField(max_length=200, primary_key=True)
    unit = models.CharField(max_length=200, default='')
    type = models.CharField(max_length=200, default='')

    def __str__(self):
        return str((self.name, self.unit, self.type))


class Recipe(models.Model):
    name = models.CharField(max_length=200, primary_key=True)
    ingredient = models.ManyToManyField(Ingredient, through='List')

    def __str__(self):
        return self.name


class List(models.Model):
    recipe = models.ForeignKey(Recipe, on_delete=models.CASCADE)
    ingredient = models.ForeignKey(Ingredient, on_delete=models.CASCADE)
    quantity = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return str((self.recipe, self.ingredient, self.quantity))
