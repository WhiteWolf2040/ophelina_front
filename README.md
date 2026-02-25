✅ FORMA SIMPLE POR CONSOLA
1️⃣ Asegúrate de que tus cambios estén guardados en tu rama

- git checkout rama-(suemy, jeni) 

- git add .

- git commit -m "mis cambios (o los cambios que hayas hecho)"

- git push origin rama-(suemy o jeni) 


2️⃣ Cámbiate a la rama equipo

- git checkout equipo


3️⃣ Actualiza equipo

- git pull origin equipo


4️⃣ Fusiona tu rama en equipo

- git merge rama-su

(Si hay conflictos, los resuelves y haces git add . y git commit)

5️⃣ Sube equipo al remoto

- git push origin equipo


Si tú ya subiste tus cambios a la rama equipo, ahora solo tiene que actualizar su rama desde equipo.

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

