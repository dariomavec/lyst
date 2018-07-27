from rest_framework import serializers
from api.models import Ingredient, Recipe, List
from django.contrib.auth.models import User


class UserSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = User
        fields = ('url', 'id', 'username')


class IngredientSerializer(serializers.ModelSerializer):
    name = serializers.CharField()
    unit = serializers.CharField()
    type = serializers.CharField()

    class Meta:
        model = Ingredient
        fields = ('name', 'unit', 'type')


class ListSerializer(serializers.HyperlinkedModelSerializer):
    recipe = serializers.CharField()
    ingredient = serializers.CharField()
    quantity = serializers.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        model = List
        fields = ('recipe', 'ingredient', 'quantity', )


class RecipeSerializer(serializers.HyperlinkedModelSerializer):
    name = serializers.CharField()
    # ingredient = IngredientSerializer(read_only=True, many=True)
    list = ListSerializer(source='membership_set', many=True)

    class Meta:
        model = Recipe
        fields = ('name', 'list')

# groups = MembershipSerializer(source='membership_set', many=True)
# class MembershipSerializer(serializers.HyperlinkedModelSerializer):
#
#     id = serializers.Field(source='group.id')
#     name = serializers.Field(source='group.name')
#
#     class Meta:
#         model = Membership
#
#         fields = ('id', 'name', 'join_date', )
