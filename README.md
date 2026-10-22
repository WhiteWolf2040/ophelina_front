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

- git checkout rama-su2
git pull origin rama-su2              # trae los commits de Diego en tu rama
git merge ophelina_10cuatri          # fusiona la rama principal
# resolver conflictos si hay
git push origin rama-su2

4️⃣ Hacer merge a equipo

- git checkout equipo
- git pull origin equipo
- git merge rama-(suemy o jeni) 
- git push origin equipo


5️⃣ volver a tu rama

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

