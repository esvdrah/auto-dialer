# Auto-Dialer 📞

Sistema automatizado para registrar marca de entrada y salida (asistencia) en Buk Register usando tareas cron programadas.

## Características

- ✅ Marcaje automático de entrada y salida según horarios configurables
- 🔄 Ejecución secuencial de endpoints (no paralelo)
- 📊 Sistema de logging con niveles (info, success, warning, error)
- ⏰ Soporte para múltiples horarios por día usando expresiones cron
- 🔐 Configuración centralizada con variables de entorno

## Instalación

Requiere Bun como runtime. Para instalar las dependencias:

```bash
bun install
```

## Configuración

Crear archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# DNI/RUT del usuario (sin puntos ni guión)
DNI_NUMBER=99999999

# URL base de la API (opcional si usas el valor por defecto)
BASE_DIAL_URL=https://app.ctrlit.cl/ctrl/dial/

# Horarios de marcaje (formato cron, separados por comas)
# SCHEDULE_ENTRY: Entrada - ejemplo 08:00 y 14:00
SCHEDULE_ENTRY=0 8 * * 1-5,0 14 * * 1-5

# SCHEDULE_EXIT: Salida - ejemplo 13:00 y 18:00
SCHEDULE_EXIT=0 13 * * 1-5,0 18 * * 1-5
```

### Formato de Expresiones Cron

```
┌───────────── minuto (0 - 59)
│ ┌───────────── hora (0 - 23)
│ │ ┌───────────── día del mes (1 - 31)
│ │ │ ┌───────────── mes (1 - 12)
│ │ │ │ ┌───────────── día de la semana (0 - 7) (0 y 7 son domingo)
│ │ │ │ │
│ │ │ │ │
* * * * *
```

**Ejemplos:**
- `0 8 * * 1-5` → Todos los días a las 08:00 (lunes a viernes)
- `0 13 * * *` → Todos los días a las 13:00 (incluidos fines de semana)
- `0 14 * * 0` → Todos los domingos a las 14:00

## Uso

### Modo desarrollo (con reinicio automático)

```bash
bun run dev
```

### Modo producción

```bash
bun run start
```

### Pruebas manuales

Descomenta las líneas al final del archivo `src/index.js`:

```javascript
// executeDialSequence(Object.values(CONFIG.dialUrlsEntry));
// executeDialSequence(Object.values(CONFIG.dialUrlsExit));
```

## Estructura del Proyecto

```
src/
├── index.js          # Lógica principal de cron jobs
├── config/
│   └── index.js      # Configuración centralizada
└── helpers/
    ├── index.js      # Exportador de helpers
    └── logger.js     # Sistema de logging
```

## Endpoints de Marcaje

El sistema ejecuta dos endpoints de forma **secuencial** para cada marcaje:

1. **REGISTRATION**: Registra la marca en el sistema
2. **WORK_INFO**: Consulta información adicional de la jornada

Cada endpoint recibe parámetros como:
- `sentido`: 1 (entrada) o 0 (salida)
- `rut`: RUT del usuario
- `latitud` / `longitud`: coordenadas (opcional)

## Logging

El sistema proporciona logs con timestamp y niveles:

```
[2024-03-18T10:30:00.123Z] ✅ Marcaje completado exitosamente
[2024-03-18T10:30:05.456Z] ❌ Error en petición a https://...
```

**Niveles de log:**
- 🔵 `info` - Información general
- ✅ `success` - Operación exitosa
- ⚠️ `warning` - Advertencia
- ❌ `error` - Error

## Solución de Problemas

### Las llamadas se hacen en paralelo
El proyecto está configurado para ser **secuencial**. Cada endpoint se ejecuta después de que termina el anterior.

### Variables de entorno no se cargan
- Verifica que el archivo `.env` exista en la raíz del proyecto
- Asegúrate de que Bun esté leyendo correctamente con `Bun.env`

### La API retorna errores
- Verifica que el `DNI_NUMBER` sea válido
- Comprueba que `BASE_DIAL_URL` sea accesible
- Revisa los logs para detalles del error

## Licencia

Este proyecto está bajo licencia MIT – ver archivo [LICENSE](LICENSE) para detalles.
