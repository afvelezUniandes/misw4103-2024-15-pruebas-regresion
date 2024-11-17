# misw4103-2024-15-pruebas-regresion

## Configuración Inicial

1. Asegúrate de tener Node.js versión 16.x instalada.
2. Instala las dependencias del proyecto:

```bash
npm install
```

## Configuración de Ghost

1. Para la version 4.5 ejecutar el siguiente comando:

```bash
docker image pull ghost:4.5

docker run --name my-ghost -e NODE_ENV=development -e url=http://localhost:3001 -p 3001:2368 ghost:4.5
```

2. Para la version 5.96

```bash
docker image pull ghost:5.96

docker run --name my-ghost -e NODE_ENV=development -e url=http://localhost:2368 -p 2368:2368 ghost:5.96
```

3. Configuramos usuario admin para 4.5

```bash
http://localhost:3001/ghost
```

4. Configuramos usuario admin para 5.96

```bash
http://localhost:2368/ghost
```

### Ejecutamos las pruebas de cypress

1. El archivo de configuracion para cypress es cypress.config.js, en el debes cambiar el usuario y la contraseña creados para cada una de las versiones. Como sugerencia crear el mismo usuario y contraseña en la version 4.5 y 5.96.

2. Validar que se estan utilizando los puertos 3001 para la version 4.5 y 2368 para la version 5.96

3. corremos los siguientes scripts para generar los screenshots

```bash
GHOST_VERSION="http://localhost:3001" npx cypress run --spec "cypress/e2e/4.5/**/*"
GHOST_VERSION="http://localhost:2368" npx cypress run --spec "cypress/e2e/5.96/**/*"
```

4.  Los screenshot se generarán en la carpeta cypress/screenshots
    - Para 4.5 la subcarpeta es reference
    - Para 5.96 la subcarpeta es test

### Ejecutamos las pruebas de Backstop JS

Si es la primera vez que lo ejecutas o has actualizado las capturas de pantalla de referencia, debes correr el siguiente script para aprobar las nuevas capturas de pantalla de referencia:

```bash
npx backstop test
npx backstop approve
```

Luego, ejecuta las pruebas de BackstopJS:

```bash
npx backstop test
```
