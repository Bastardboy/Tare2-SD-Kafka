# SD-Homeworks2
## Integrantes: Abel Baulloza y Diego Carrillo .
**Instrucciones y uso**
NO HAY PERROOOOOS





if(bloqueados.includes(json)) /*json["name"]*/
      {
        let word = json["username"]
        //res.json(word+" bloqueado")
        console.log("ta bloqueado sorry :(")
        //return
      }else{
        if(!(json["username"] in registro)){
          var array = []
          registro[json["username"]] = array
          registro[json["username"]].push(json["tiempo"])
        }else{
          registro[json["username"]].push(json["tiempo"])
        }
        //console.log(registro[json["username"]])
        //console.log(registro[json["username"]].length)
        if(registro[json["username"]].length >= 3 && registro[json["username"]][registro[json["username"]].length -1] - registro[json["username"]][registro[json["username"]].length -5] <60){
          //console.log(registro[json["username"]][registro[json["username"]].length -1] - registro[json["username"]][registro[json["username"]].length -5])
          console.log("Bloqueado")
          bloqueados.push(json["username"])
          console.log(bloqueados)
        }
      }





Topic: Ventas
http://localhost:3001/sales

{
	"client": "abel",
  "count_sopaipillas": "3",
	"hora": "14:45",
	"stock": "5",
	"ubicacion": "2,1"
}

Topic: Stock



Topic: Coordenadas


Topic: Miembros
http://localhost:3000/new_member

{
	"name": "abel",
  	"lastname": "baulloza almeida",
	"dni": "20.245.835-1",
	"mail": "abel.baulloza@mail.udp.cl",
	"patente": "CGZY30",
	"premium":"si"
}