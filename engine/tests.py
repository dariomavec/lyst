from django.test import TestCase

# Create your tests here.
ingredient_test = [
    {'name': 'Arborio Rice',
     'type': 'Carbohydrate',
     'unit': 'grams'},
    {'name': 'Bean Sprouts',
     'type': 'Vegetable'},
    {'name': 'Beef stock powder',
     'type': 'Spice',
     'unit': 'tbsp'}]

recipe_test = [{
    'name': 'Test Recipe'
}]

list_test = [
    {'recipe': 'Test Recipe',
     'quantity': 1.5,
     'ingredient': 'Arborio Rice'},
    {'recipe': 'Test Recipe',
     'quantity': 0.11,
     'ingredient': 'Bean Sprouts'},
    {'recipe': 'Test Recipe',
     'quantity': 0.7,
     'ingredient': 'Beef stock powder'}]
