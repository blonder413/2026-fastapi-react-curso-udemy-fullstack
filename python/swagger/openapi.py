# config/openapi.py
from fastapi.openapi.utils import get_openapi
from fastapi.security import OAuth2PasswordBearer

# Esquema de seguridad
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# Descripción general de la API
DESCRIPTION = """
API Rest creada siguiendo curso de UDEMY. 🚀
"""

# Información de contacto
CONTACT_INFO = {
    "name": "blonder413.wordpress.com",
    "url": "https://blonder413.wordpress.com",
}

# Licencia
LICENSE_INFO = {
    "name": "Apache 2.0",
    "url": "https://www.apache.org/licenses/LICENSE-2.0.html",
}

# Términos de servicio
TERMS_OF_SERVICE = "https://blonder413.wordpress.com"

# Etiquetas de OpenAPI (tags)
OPENAPI_TAGS = [
    {"name": "Ejemplo", "description": "Ejemplo de API Rest"},
    {
        "name": "Upload",
        "description": "Ejemplo upload de archivos, locales y S3",
    },
    {"name": "State", "description": "API Rest State"},
    {"name": "Category", "description": "API Rest Categorías"},
    {"name": "Business", "description": "API Rest Negocios"},
    {"name": "BusinessLogo", "description": "Administrar logos de negocios"},
    {"name": "Business by user", "description": "Ver negocio por usuario"},
    {"name": "Plates category", "description": "API Rest Platos Categorías"},
    {"name": "Plate", "description": "API Rest Platos"},
    {"name": "Menu", "description": "API Rest Carta por slug"},
    {"name": "User", "description": "API Rest Usuarios"},
    {"name": "Login", "description": "API Rest Login"},
    {"name": "Profile", "description": "API Rest Perfil"},
    {"name": "Recovery", "description": "API Rest Restablecer contraseña"},
]


# Función para generar el esquema OpenAPI personalizado
def custom_openapi(app):
    def generate_openapi():
        if app.openapi_schema:
            return app.openapi_schema

        openapi_schema = get_openapi(
            title="API Rest con FastAPI",
            version="0.0.1",
            description=DESCRIPTION,
            routes=app.routes,
            tags=OPENAPI_TAGS,
        )

        # Añade info adicional
        openapi_schema["info"]["termsOfService"] = TERMS_OF_SERVICE
        openapi_schema["info"]["license"] = LICENSE_INFO
        openapi_schema["info"]["contact"] = CONTACT_INFO

        # Componentes de seguridad
        openapi_schema["components"]["securitySchemes"] = {
            "OAuth2PasswordBearer": {
                "type": "oauth2",
                "flows": {"password": {"tokenUrl": "/auth/login", "scopes": {}}},
            }
        }

        app.openapi_schema = openapi_schema
        return app.openapi_schema

    return generate_openapi
