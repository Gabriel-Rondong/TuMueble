from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        error_data = {
            'error': True,
            'status_code': response.status_code,
            'detail': response.data,
        }
        # Simplify common error formats
        if isinstance(response.data, dict) and 'detail' in response.data:
            error_data['mensaje'] = str(response.data['detail'])
        elif isinstance(response.data, list):
            error_data['mensaje'] = str(response.data[0]) if response.data else 'Error desconocido'
        else:
            error_data['mensaje'] = 'Ha ocurrido un error'

        response.data = error_data

    return response
