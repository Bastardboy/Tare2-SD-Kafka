
<br />
<div align="center">

  <h3 align="center">Sistemas Distribuidos: Tarea 02</h3>

  <p align="center">
    Bastián Castro, David Pazán
  </p>
</div>


## Acerca del proyecto

El objetivo de esta tarea consiste en poner en práctica los conceptos de Caché y RPC vistos en clases. Para ello se debe hacer uso de tecnlogías que permitan la solución a esta problemática


### 🛠 Construído con:

Esta sección muestra las tecnologías con las que fue construído el proyecto.

* [gRPC](https://grpc.io)
* [Redis](https://redis.io)
* [Postgres](https://www.postgresql.org)
* [Python](https://www.python.org)
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

La aplicación tiene una API, que a través del método GET se pueden hacer las siguientes consultas:

### Query
Busca el inventario según la coincidencia de la palabra otorgada, busca en Cache y luego en la Base de Datos.
```curl
curl −−location −−request GET http://localhost:8000/search?search=Value
```
#### 
- ☄METODO: GET
- 🔑KEY: search
- 📃VALUE: \<palabra a buscar\>

#### Response example
```js
{
    "site":
        {
            "id": 36323,
            "title": "NULL",
            "description": "Weather Underground provides local & long-range weather forecasts, weather reports, maps & tropical weather conditions for locations worldwide",
            "keyword": "NULL",
            "url": "https://www.wunderground.com/"
        }
    ]
}
```
## 📹 Video Demostrativo
[![Alt text](https://i.imgur.com/UzCFNcT.png)](https://youtu.be/h09TIF2YaNk)
