# Code Citations

## License: desconocido
https://github.com/Marost/webpperu/blob/9ae5864972f358f95cde4cb8554023b2cdabdbe9/columnista-noticia.php

```
>
<!DOCTYPE
```


## License: desconocido
https://github.com/Marost/webpperu/blob/9ae5864972f358f95cde4cb8554023b2cdabdbe9/columnista-noticia.php

```
>
<!DOCTYPE html>
<html
```


## License: desconocido
https://github.com/Marost/webpperu/blob/9ae5864972f358f95cde4cb8554023b2cdabdbe9/columnista-noticia.php

```
>
<!DOCTYPE html>
<html lang="es">
```


## License: desconocido
https://github.com/Marost/webpperu/blob/9ae5864972f358f95cde4cb8554023b2cdabdbe9/columnista-noticia.php

```
>
<!DOCTYPE html>
<html lang="es">
<head>
    
```


## License: desconocido
https://github.com/Marost/webpperu/blob/9ae5864972f358f95cde4cb8554023b2cdabdbe9/columnista-noticia.php

```
>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF
```


## License: desconocido
https://github.com/Marost/webpperu/blob/9ae5864972f358f95cde4cb8554023b2cdabdbe9/columnista-noticia.php

```
>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    
```


## License: desconocido
https://github.com/Marost/webpperu/blob/9ae5864972f358f95cde4cb8554023b2cdabdbe9/columnista-noticia.php

```
>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport
```


## License: desconocido
https://github.com/Marost/webpperu/blob/9ae5864972f358f95cde4cb8554023b2cdabdbe9/columnista-noticia.php

```
>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=
```


## License: desconocido
https://github.com/Marost/webpperu/blob/9ae5864972f358f95cde4cb8554023b2cdabdbe9/columnista-noticia.php

```
>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial
```


## License: desconocido
https://github.com/Marost/webpperu/blob/9ae5864972f358f95cde4cb8554023b2cdabdbe9/columnista-noticia.php

```
>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.
```


## License: desconocido
https://github.com/Marost/webpperu/blob/9ae5864972f358f95cde4cb8554023b2cdabdbe9/columnista-noticia.php

```
>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
```


## License: desconocido
https://github.com/Marost/webpperu/blob/9ae5864972f358f95cde4cb8554023b2cdabdbe9/columnista-noticia.php

```
>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>
```

# Estilos CSS para Modal de Usuario

Agregar al archivo `css/admin-usuarios.css` o en el `<style>` del HTML:

```css
/* Modal de información de usuario */
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
}

.modal-content {
    background-color: #ffffff;
    margin: 5% auto;
    padding: 0;
    border-radius: 12px;
    width: 90%;
    max-width: 800px;
    max-height: 85vh;
    overflow-y: auto;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    transform: scale(0.8);
    opacity: 0;
    transition: all 0.3s ease;
}

.modal-header {
    background: linear-gradient(135deg, #2c3e50, #34495e);
    color: #ffffff;
    padding: 20px;
    border-radius: 12px 12px 0 0;
    position: relative;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 600;
}

.close-modal {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 2rem;
    font-weight: bold;
    color: #ffffff;
    cursor: pointer;
    border: none;
    background: none;
    padding: 5px 10px;
    border-radius: 50%;
    transition: background-color 0.3s;
}

.close-modal:hover {
    background-color: rgba(255, 255, 255, 0.2);
}

.modal-body {
    padding: 25px;
    background-color: #ffffff;
    color: #2c3e50;
}

.user-details-section {
    margin-bottom: 25px;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    overflow: hidden;
}

.section-header {
    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
    padding: 15px 20px;
    border-bottom: 1px solid #dee2e6;
}

.section-header h3 {
    margin: 0;
    color: #495057;
    font-size: 1.2rem;
    font-weight: 600;
}

.details-grid {
    padding: 20px;
    background-color: #ffffff;
}

.detail-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 0;
    border-bottom: 1px solid #f1f3f4;
}

.detail-item:last-child {
    border-bottom: none;
}

.detail-item label {
    font-weight: 600;
    color: #495057;
    margin-right: 15px;
    min-width: 150px;
}

.detail-item span {
    color: #212529;
    font-weight: 500;
    flex: 1;
    text-align: right;
}

.password-display {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-end;
}

.password-code {
    background: #f8f9fa;
    color: #495057;
    padding: 8px 12px;
    border-radius: 6px;
    font-family: 'Courier New', monospace;
    border: 1px solid #dee2e6;
    font-weight: 600;
    letter-spacing: 1px;
}

.btn-copy-small {
    background: #007bff;
    color: #ffffff;
    border: none;
    padding: 6px 12px;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.3s;
}

.btn-copy-small:hover {
    background: #0056b3;
}

.status-badge {
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
}

.status-pendiente {
    background: #fff3cd;
    color: #856404;
    border: 1px solid #ffeaa7;
}

.status-aprobada {
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.status-rechazada {
    background: #f8d7da;
    color: #721c24;
    border: 1px solid #f5c6cb;
}

.modal-footer {
    background: #f8f9fa;
    padding: 20px;
    border-radius: 0 0 12px 12px;
    display: flex;
    justify-content: space-between;
    gap: 15px;
}

.btn-close, .btn-copy-all {
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
    border: none;
}

.btn-close {
    background: #6c757d;
    color: #ffffff;
}

.btn-close:hover {
    background: #545b62;
}

.btn-copy-all {
    background: #28a745;
    color: #ffffff;
}

.btn-copy-all:hover {
    background: #1e7e34;
}

/* Mejora de contraste y legibilidad */
.modal-body {
    background: #ffffff !important;
    color: #212529 !important;
}

.detail-item label {
    color: #495057 !important;
    font-weight: 700 !important;
}

.detail-item span {
    color: #212529 !important;
    font-weight: 600 !important;
}

.password-code {
    background: #f1f3f4 !important;
    color: #212529 !important;
    font-weight: 700 !important;
}
```

