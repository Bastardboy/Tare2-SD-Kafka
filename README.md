
<br />
<div align="center">

  <h3 align="center">Sistemas Distribuidos: Tarea 02</h3>

  <p align="center">
    Bastián Castro, David Pazán
  </p>
</div>


## Acerca del proyecto

El objetivo de esta tarea consiste en poner en práctica los conceptos de cola de eventos. Para ello se debe hacer uso de tecnlogías que permitan la solución a esta problemática


### 🛠 Construído con:

Esta sección muestra las tecnologías con las que fue construído el proyecto.

* [Kafka](https://kafka.apache.org/documentation/#gettingStarted)
* [Zookeper](https://zookeeper.apache.org/doc/r3.8.0/index.html)
* [NodeJs](https://nodejs.org/en/docs/guides/)
* [KafkaJs](https://kafka.js.org/docs/getting-started)
* [Docker](https://www.docker.com)


## 🔰 Comenzando

Para iniciar el proyecto, primero hay que copiar el repositorio y luego escribir el siguiente comando en la consola:
* docker
```sh
docker-compose --build -d
```
Para que los contenedores se inician en el ambiente local se utiliza el siguiente comando en la consola:
* docker
```sh
docker-compose up -d
```
### Pre-Requisitos

Tener Docker y Docker Compose instalado
* [Installation Guide](https://docs.docker.com/compose/install/)



## 🤝 Uso

La aplicación tiene una API, que a través del método POST se pueden hacer las peticiones de ingreso:

### Query
Busca el inventario según la coincidencia de la palabra otorgada, busca en Cache y luego en la Base de Datos.
```curl
curl −−location −−request GET http://localhost:3000/registro
```
#### 
- ☄METODO: Post
- 🔑KEY: registro
- 📃VALUE: \<JSON con los parámetros solicitados\>

#### JSON Registro
```js
{
    "name": "Bastian",
    "lastname":"Pazán",
    "dni":"13976345-7",
    "email":"quiero@morir.com",
    "patent": "XDFG65",
    "premium": "0"
}
```

```curl
curl −−location −−request GET http://localhost:3001/registro
```
#### 
- ☄METODO: Post
- 🔑KEY: ventas
- 📃VALUE: \<JSON con los parámetros solicitados\>

#### JSON Registro de Venta
```js
{
    "cliente": "Cachulo",
    "cant_sopaipa":"10",
    "patente":"patentefalsa123",
    "stock":"5",
    "ubicacion": "123,123"
}
```


```curl
curl −−location −−request GET http://localhost:3002/ubicacion
```
#### 
- ☄METODO: Post
- 🔑KEY: ubicacion
- 📃VALUE: \<JSON con los parámetros solicitados\>

#### JSON Registro de Ubicacion
```js
{
    "patente": "Cachulo",
    "coordenadas": "(14,15)",
    "reporte": 1
}
```


## 📹 Video Demostrativo
[![Alt text](https://i.imgur.com/UzCFNcT.png)](https://youtu.be/h09TIF2YaNk)
