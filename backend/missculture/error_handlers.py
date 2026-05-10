"""
Custom Error Handlers for Miss Culture Global Kenya Backend
Provides detailed error information for debugging while keeping sensitive data secure.
"""

import traceback
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework import status

logger = logging.getLogger(__name__)


class ErrorCode:
    """Standardized error codes for the API"""
    # 4xx Client Errors
    VALIDATION_ERROR = 'VALIDATION_ERROR'
    NOT_FOUND = 'NOT_FOUND'
    PERMISSION_DENIED = 'PERMISSION_DENIED'
    AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED'
    RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED'
    
    # 5xx Server Errors
    INTERNAL_ERROR = 'INTERNAL_ERROR'
    DATABASE_ERROR = 'DATABASE_ERROR'
    EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR'
    CONFIGURATION_ERROR = 'CONFIGURATION_ERROR'


def create_error_response(code, message, details=None, status_code=400, request=None):
    """
    Create a standardized error response with optional debug information.
    
    Args:
        code: Error code from ErrorCode class
        message: Human-readable error message
        details: Additional error details (validation errors, etc.)
        status_code: HTTP status code
        request: Django request object (for debug info)
    """
    error_data = {
        'success': False,
        'error': {
            'code': code,
            'message': message,
        }
    }
    
    if details:
        error_data['error']['details'] = details
    
    # Add debug information in DEBUG mode or for admin users
    if settings.DEBUG:
        error_data['error']['debug'] = {
            'settings_loaded': True,
            'database_configured': bool(settings.DATABASES.get('default', {}).get('ENGINE')),
            'allowed_hosts': settings.ALLOWED_HOSTS[:3] if settings.ALLOWED_HOSTS else [],
        }
    
    return Response(error_data, status=status_code)


# ── API Error Views ─────────────────────────────────────────────────────────

@csrf_exempt
def error_404(request, exception=None):
    """Handle 404 Not Found errors"""
    logger.warning(f'404 error: {request.path}')
    
    if request.headers.get('Accept') == 'application/json' or request.path.startswith('/api/'):
        return JsonResponse({
            'success': False,
            'error': {
                'code': ErrorCode.NOT_FOUND,
                'message': f'The requested resource "{request.path}" was not found.',
                'path': request.path,
                'method': request.method
            }
        }, status=404)
    
    # For non-API requests, return simple message
    return JsonResponse({
        'success': False,
        'error': {
            'code': ErrorCode.NOT_FOUND,
            'message': 'Page not found'
        }
    }, status=404)


@csrf_exempt
def error_500(request):
    """Handle 500 Internal Server Error"""
    logger.error(f'500 error at {request.path}')
    
    if request.headers.get('Accept') == 'application/json' or request.path.startswith('/api/'):
        error_data = {
            'success': False,
            'error': {
                'code': ErrorCode.INTERNAL_ERROR,
                'message': 'An internal server error occurred. Please try again later.',
            }
        }
        
        if settings.DEBUG:
            import sys
            exc_type, exc_value, exc_traceback = sys.exc_info()
            if exc_value:
                error_data['error']['debug'] = {
                    'exception_type': exc_type.__name__ if exc_type else 'Unknown',
                    'exception_message': str(exc_value),
                    'traceback': traceback.format_exception(exc_type, exc_value, exc_traceback) if exc_traceback else []
                }
        
        return JsonResponse(error_data, status=500)
    
    return JsonResponse({
        'success': False,
        'error': {
            'code': ErrorCode.INTERNAL_ERROR,
            'message': 'Internal server error'
        }
    }, status=500)


@csrf_exempt
def error_403(request, exception=None):
    """Handle 403 Forbidden errors"""
    logger.warning(f'403 error at {request.path}')
    
    return JsonResponse({
        'success': False,
        'error': {
            'code': ErrorCode.PERMISSION_DENIED,
            'message': 'You do not have permission to access this resource.',
            'path': request.path
        }
    }, status=403)


@csrf_exempt
def error_400(request, exception=None):
    """Handle 400 Bad Request errors"""
    logger.warning(f'400 error at {request.path}')
    
    return JsonResponse({
        'success': False,
        'error': {
            'code': ErrorCode.VALIDATION_ERROR,
            'message': 'Bad request - please check your input.',
            'path': request.path
        }
    }, status=400)


# ── Debug & Health Check Endpoints ──────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """
    Public health check endpoint - returns basic system status
    """
    from django.db import connection
    from django.core.cache import cache
    
    health_data = {
        'status': 'healthy',
        'timestamp': None,
        'checks': {}
    }
    
    # Database check
    try:
        with connection.cursor() as cursor:
            cursor.execute("SELECT 1")
            health_data['checks']['database'] = 'connected'
    except Exception as e:
        health_data['checks']['database'] = f'error: {str(e)}'
        health_data['status'] = 'unhealthy'
    
    # Email configuration check
    try:
        health_data['checks']['email'] = {
            'configured': bool(settings.RESEND_API_KEY),
            'from_email': settings.DEFAULT_FROM_EMAIL,
            'admin_email': settings.ADMIN_EMAIL
        }
    except Exception as e:
        health_data['checks']['email'] = f'error: {str(e)}'
    
    # Cloudinary check
    try:
        import cloudinary
        cloud_name = cloudinary.config().cloud_name
        health_data['checks']['cloudinary'] = {
            'configured': bool(cloud_name),
            'cloud_name': cloud_name if settings.DEBUG else '***'
        }
    except Exception as e:
        health_data['checks']['cloudinary'] = f'error: {str(e)}'
    
    # M-Pesa configuration
    try:
        health_data['checks']['mpesa'] = {
            'configured': bool(settings.MPESA_CONSUMER_KEY and settings.MPESA_CONSUMER_SECRET),
            'environment': settings.MPESA_ENVIRONMENT,
            'shortcode': settings.MPESA_SHORTCODE if settings.DEBUG else '***'
        }
    except Exception as e:
        health_data['checks']['mpesa'] = f'error: {str(e)}'
    
    status_code = 200 if health_data['status'] == 'healthy' else 503
    return Response(health_data, status=status_code)


@api_view(['GET'])
@permission_classes([AllowAny])
def debug_info(request):
    """
    Public debug endpoint with safe configuration info
    """
    debug_data = {
        'application': 'Miss Culture Global Kenya API',
        'version': '1.0.0',
        'environment': {
            'debug_mode': settings.DEBUG,
            'allowed_hosts_count': len(settings.ALLOWED_HOSTS),
        },
        'features': {
            'email_enabled': bool(settings.RESEND_API_KEY),
            'cloudinary_enabled': bool(settings.CLOUDINARY_STORAGE.get('CLOUD_NAME')),
            'mpesa_enabled': bool(settings.MPESA_CONSUMER_KEY),
            'telegram_enabled': bool(getattr(settings, 'TELEGRAM_BOT_TOKEN', None)),
        },
        'endpoints': {
            'health': '/api/health/',
            'settings': '/api/main/settings/',
            'events': '/api/events/',
            'contact': '/api/main/contact/',
        }
    }
    
    return Response(debug_data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_debug_info(request):
    """
    Admin-only debug endpoint with detailed information
    """
    from django.db import connection
    from django.db.migrations.executor import MigrationExecutor
    
    # Get migration status
    executor = MigrationExecutor(connection)
    plan = executor.migration_plan(executor.loader.graph.leaf_nodes())
    pending_migrations = [str(m) for m in plan]
    
    debug_data = {
        'environment': {
            'debug': settings.DEBUG,
            'secret_key_prefix': settings.SECRET_KEY[:10] + '...' if settings.SECRET_KEY else None,
            'database_engine': settings.DATABASES.get('default', {}).get('ENGINE'),
        },
        'migrations': {
            'applied': list(executor.loader.applied_migrations),
            'pending': pending_migrations,
        },
        'email': {
            'resend_api_key': '***' if settings.RESEND_API_KEY else 'Not configured',
            'default_from': settings.DEFAULT_FROM_EMAIL,
            'admin_email': settings.ADMIN_EMAIL,
        },
        'storage': settings.CLOUDINARY_STORAGE,
        'mpesa': {
            'consumer_key': '***' if settings.MPESA_CONSUMER_KEY else 'Not configured',
            'environment': settings.MPESA_ENVIRONMENT,
            'shortcode': settings.MPESA_SHORTCODE,
        },
        'request_info': {
            'path': request.path,
            'method': request.method,
            'user': str(request.user),
            'remote_addr': request.META.get('REMOTE_ADDR'),
        }
    }
    
    return Response(debug_data)


# ── Exception Handler for DRF ────────────────────────────────────────────────

from rest_framework.views import exception_handler as drf_exception_handler

def custom_exception_handler(exc, context):
    """
    Custom DRF exception handler with detailed error information
    """
    response = drf_exception_handler(exc, context)
    
    if response is not None:
        # Add error code to the response
        error_code = ErrorCode.VALIDATION_ERROR
        if response.status_code == 404:
            error_code = ErrorCode.NOT_FOUND
        elif response.status_code == 403:
            error_code = ErrorCode.PERMISSION_DENIED
        elif response.status_code == 401:
            error_code = ErrorCode.AUTHENTICATION_FAILED
        elif response.status_code == 429:
            error_code = ErrorCode.RATE_LIMIT_EXCEEDED
        elif response.status_code >= 500:
            error_code = ErrorCode.INTERNAL_ERROR
        
        response.data = {
            'success': False,
            'error': {
                'code': error_code,
                'message': response.data.get('detail', 'An error occurred'),
                'details': response.data if len(response.data) > 1 else None
            }
        }
        
        # Add debug info in DEBUG mode
        if settings.DEBUG:
            import sys
            exc_type, exc_value, exc_traceback = sys.exc_info()
            response.data['error']['debug'] = {
                'exception_type': exc_type.__name__ if exc_type else 'Unknown',
                'exception_message': str(exc_value) if exc_value else 'None',
            }
    
    return response
