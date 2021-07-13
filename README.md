# CryptoManager

Aplicación web que ayuda gestionar las criptomonedas de usuario y estudiar los datos de mercado de exchanges distintos

## Exchanges soportados
- Kraken (API pública y privada)
- Binance (API pública y privada)
- Bitvavo (API pública)


Este proyecto se ha generado con [Angular CLI](https://github.com/angular/angular-cli) version 11.2.5.

[Repositorio de CryptoManagerBackend](https://github.com/lkristianl/CryptoManagerBackend) (Necesario para hacer llamadas a la API privada, pero no es obligatorio para el funcionamiento de la aplicación)

## Dependencias

* Node.js (version 11.* o superior)
* npm (node package manager)
* MongoDB (Dependencia necesaria solo si se va a usar CryptoManagerBackend)
* angular CLI


## Instrucciones de uso

### Sin CryptoManagerBackend

1. clonar el repositorio de CryptoManager en local
```
git clone https://github.com/lkristianl/CryptoManager.git
```

2. Una vez clonado al repositorio, acceder al directorio root del repositorio y instalar las dependencias con `npm`
```
npm install
```

3. Extraer el contenido de `CorsProxy.rar` que se encuentra en la carpeta `tools` fuera del workspace de CryptoManager

4. Acceder al directorio root de CorsProxy y instalar las dependencias como se ha hecho para CryptoManager
```
npm install
```

5. Abrir el terminal con ruta el directorio root de CorsProxy y lanzar el siguiente comando y dejarlo abierto. Este es el CORS proxy que va a añadir los CORS headers cuando hagamos una peticion a las APIs de los exchanges. Escucha en `http://localhost:4202`.
```
node cors 4202
```

6. Instalar angular CLI para poder usar el CLI de angular
```
npm install -g @angular/cli
```

7. Volver al directorio root de CryptoManager y abrir un terminal para lanzar el siguiente comando
```
ng serve
```


### Con CryptoManagerBackend

Para ejecutar CryptoManager con su funcionalidad backend y poder utilizar la parte privada de nuestro sistema se siguen los mismos pasos como las instrucciones sin CryptoManagerBackend excluyendo el último paso 7.

7. clonar el repositorio de CryptoManagerBackend en local
```
git clone https://github.com/lkristianl/CryptoManagerBackEnd.git
```

8. Una vez clonado al repositorio, acceder al directorio root del repositorio y instalar las dependencias con `npm`
```
npm install
```

9. Ejecutar MongoDB en el puerto 27017 (Es el puerto por defecto de MongoDB). Si es necesario utilizar otro puerto para MongoDB hay que editar `app/config/db.config.js` para poner el nombre del nuevo puerto

10.  Abrir el terminal con ruta el directorio root de CryptoManagerBackend y lanzar el siguiente comando
```
node server
```

11. Una vez realizados estos pasos, volver al directorio root de CryptoManager y abrir un terminal para lanzar el siguiente comando
```
ng serve
```
