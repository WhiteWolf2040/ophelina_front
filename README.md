CONSOLA:
✅ Primero traer lo de equipo a tu rama
✅ Resolver conflictos en tu rama
✅ Después subir tu rama a equipo

1️⃣ Asegúrate de que tus cambios estén guardados en tu rama

- git branch
- git checkout rama-(suemy, jeni) 
- git add .
- git commit -m "mis cambios (o los cambios que hayas hecho)"
- git push origin rama-(suemy o jeni) 


2️⃣ Traer lo nuevo de equipo

- git pull origin equipo
  
(Si hay conflictos, los resuelves )

3️⃣ Actualiza 

- git add .
- git commit -m "Resolviendo conflictos con equipo"


4️⃣ Ahora subir tu rama actualizada

- git push origin rama-(suemy o jeni) 


5️⃣ Hacer merge a equipo

- git checkout equipo
- git pull origin equipo
- git merge rama-(suemy o jeni) 
- git push origin equipo
- git checkout rama-(suemy, jeni) 

Listo, Si tú ya subiste tus cambios a la rama equipo, ahora solo tiene que actualizar su rama desde equipo.

Supongamos que diego trabaja en rama-diego (suemy o jeni).

1️⃣ Ir a la rama equipo y actualizarla

- git checkout equipo

- git pull origin equipo


2️⃣ Volver a su rama

- git checkout rama-diego(suemy o jeni)

3️⃣ Traer los cambios de equipo a su rama

- git merge equipo


Y listo 🚀

Ahora su rama tiene:

Lo que él tenía

Lo que tú subiste

💡 Resumen mental del equipo

Cada quien hace:

mi-rama ➜ equipo
equipo ➜ mi-rama

La rama equipo es el centro de todo.

