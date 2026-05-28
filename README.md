# Plataforma E-commerce Joyería MIIO

Una solución web de comercio electrónico robusta y escalable diseñada específicamente para la gestión, exhibición y venta en línea de productos de joyería fina. El sistema integra un backend potente para el procesamiento seguro de transacciones junto con un panel administrativo completo para el control absoluto del inventario, pedidos y clientes.

## Objetivos del Proyecto

- **Automatización Comercial:** Transformar operaciones tradicionales de venta de joyería en un ecosistema digital de alta disponibilidad.
- **Gestión Integral de Inventario:** Controlar con precisión quirúrgica existencias basadas en atributos específicos (materiales, quilates, tallas, tipo de gema).
- **Experiencia de Usuario de Alta Gama:** Interfaz intuitiva y fluida orientada a la conversión y fidelización del cliente.

---

## Stack Tecnológico y Arquitectura

La plataforma fue construida utilizando un enfoque de arquitectura limpia, asegurando la separación de responsabilidades y la mantenibilidad a largo plazo.

### **Backend & Lógica de Negocio**
- **Lenguaje:** C# (.NET)
- **Patrón Arquitectónico:** Modelo-Vista-Controlador (MVC) / Arquitectura en Capas (Presentación, Negocio, Acceso a Datos).
- **Seguridad:** Autenticación y autorización basada en roles (Administrador, Cliente) y protección contra vulnerabilidades web comunes (CSRF, Inyección SQL).

### **Persistencia de Datos**
- **Motor de Base de Datos:** Microsoft SQL Server
- **Acceso a Datos:** Procedimientos almacenados robustos y consultas optimizadas para garantizar tiempos de respuesta mínimos bajo alta concurrencia.
- **Estructura:** Relacional, completamente normalizada para mitigar la redundancia de datos de productos y transacciones.

### **Frontend**
- **Vistas:** Razor Pages HTML5 y CSS3 con diseño responsivo (adaptable a dispositivos móviles y escritorio).
- **Interactividad:** JavaScript nativo y librerías dinámicas para la gestión asíncrona del carrito de compras sin recargas innecesarias de página.

---

## Características Principales

### Módulo de Clientes (E-commerce)
- **Catálogo Dinámico:** Filtrado avanzado de piezas de joyería por categorías, materiales y rangos de precio.
- **Carrito de Compras Asíncrono:** Adición, modificación y persistencia de artículos seleccionados en tiempo real.
- **Historial de Pedidos:** Espacio personalizado para que los clientes verifiquen el estado de sus compras anteriores y transacciones activas.

### Módulo Administrativo (Back-Office)
- **Dashboard de Control:** Métricas clave sobre el rendimiento del negocio y pedidos pendientes.
- **Gestión Avanzada de Productos:** CRUD completo (Crear, Leer, Actualizar, Eliminar) de inventario, con soporte para carga de imágenes y especificaciones técnicas de joyería.
- **Control de Ventas y Órdenes:** Monitoreo del flujo de estados de los pedidos desde la confirmación del pago hasta el envío.

---

## Diseño de la Base de Datos

El núcleo analítico y transaccional reside en un esquema de base de datos relacional robusto en **SQL Server**. Las principales entidades del dominio incluyen:

- `Usuarios` / `Clientes`: Almacenamiento de perfiles y credenciales seguras.
- `Productos` / `Categoria`: Catálogo detallado de piezas (anillos, collares, pulseras) con atributos de materiales preciosos.
- `Carrito` / `DetalleCarrito`: Persistencia de la intención de compra del usuario.
- `Pedidos` / `DetallePedido`: Registro histórico inmutable de transacciones financieras y logísticas.