from django.core.management.base import BaseCommand, CommandError
from engine.sheets_api import read_sheet, authenticate_sheets_service
import pandas as pd
from api.models import Ingredient, Recipe, List, Procedure

SPREADSHEET_ID = '1eOi0MZdR9u8lhE9Z47NLaAs8It-6bLApPo4Xg5fBTms'
RECIPE_INGREDIENTS_RANGE = 'Recipes!B3:AA69'
PROCEDURE_RANGE = 'Procedure!A1:AA21'

def load_ingredient_from_dict(d):
    key = d.pop('name')
    obj, created = Ingredient.objects.update_or_create(name=key, defaults=d)
    obj.save()


class Command(BaseCommand):
    help = 'Test data load.'

    def handle(self, *args, **options):
        service = authenticate_sheets_service()

        # sheet_data = read_sheet(service, SPREADSHEET_ID, RECIPE_INGREDIENTS_RANGE)
        # sheet_df = pd.DataFrame(sheet_data[1:], columns=sheet_data[0])
        # sheet_df['Unit'] = sheet_df['Ingredients'].str.split('(', expand=True)[1].str.replace('\)', '')
        # sheet_df['Ingredients'] = sheet_df['Ingredients'].str.split('(', expand=True)[0].str.strip()
        #
        # # INGREDIENTS
        # for idx, row in sheet_df.iterrows():
        #     def translate_keys(row):
        #         return str(row['Ingredients']).lower(), \
        #                {
        #                    'unit': str(row['Unit']).lower(),
        #                    'type': str(row['Type']).lower()
        #                }
        #
        #     key, defaults = translate_keys(row.to_dict())
        #     obj, created = Ingredient.objects.update_or_create(name=key, defaults=defaults)
        #     obj.save()
        #
        # # RECIPES and LISTS
        # recipe_names = list(sheet_df.columns[3:])
        # recipe_names.remove('Unit')
        # for recipe_name in recipe_names:
        #     recipe, created = Recipe.objects.get_or_create(name=recipe_name)
        #     recipe.save()
        #
        #     recipe_list = sheet_df[['Ingredients', recipe_name]]
        #     recipe_list[recipe_name] = recipe_list[recipe_name].str.strip()
        #     # Filter out any rows with no ingredient quantity data
        #     recipe_list = recipe_list.loc[recipe_list[recipe_name].str.len() > 0]
        #
        #     for idx, row in recipe_list.iterrows():
        #         def translate_keys(row):
        #             # print(row)
        #             ingredient_name = str(row['Ingredients']).lower()
        #             ingredient = Ingredient.objects.get(name=ingredient_name)
        #             defaults = {'quantity': float(row[recipe_name])}
        #             return ingredient, defaults
        #
        #         ingredient, defaults = translate_keys(row.to_dict())
        #
        #         obj, created = List.objects.update_or_create(recipe=recipe,
        #                                                      ingredient=ingredient,
        #                                                      defaults=defaults)
        #         obj.save()

        # PROCEDURES
        sheet_data = read_sheet(service, SPREADSHEET_ID, PROCEDURE_RANGE)
        print(sheet_data)
        sheet_df = pd.DataFrame(sheet_data[1:], columns=sheet_data[0][0:len(sheet_data[1])])
        print(sheet_df)
        recipe_names = list(sheet_df.columns[1:])
        for recipe_name in recipe_names:
            recipe, created = Recipe.objects.get_or_create(name=recipe_name)
            recipe.save()
            procedure_list = sheet_df[['Step', recipe_name]]
            procedure_list[recipe_name] = procedure_list[recipe_name].str.strip()
            # Filter out any rows with no ingredient quantity data
            procedure_list = procedure_list.loc[procedure_list[recipe_name].str.len() > 0]

            for idx, row in procedure_list.iterrows():
                print(row)
                step_id = row[0]
                defaults = {'step_details': row[1]}

                obj, created = Procedure.objects.update_or_create(recipe=recipe,
                                                                  step_id=step_id,
                                                                  defaults=defaults)
                obj.save()