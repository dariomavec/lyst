"""
Provides authentication and a read sheets handler for the Google Sheets V4 API.
"""
from apiclient.discovery import build
from httplib2 import Http
from oauth2client import file, client, tools


def authenticate_sheets_service():
    # Setup the Sheets API
    SCOPES = 'https://www.googleapis.com/auth/spreadsheets.readonly'
    store = file.Storage('engine/credentials/credentials.json')
    creds = store.get()
    if not creds or creds.invalid:
        flow = client.flow_from_clientsecrets('engine/credentials/drive_key.json', SCOPES)
        creds = tools.run_flow(flow, store)
    service = build('sheets', 'v4', http=creds.authorize(Http()))
    return service


def read_sheet(service, spreadsheet_id, range_name):
    # Call the Sheets API
    result = service.spreadsheets().values().get(
        spreadsheetId=spreadsheet_id, range=range_name).execute()
    numRows = result.get('values') if result.get('values') is not None else 0
    return numRows
