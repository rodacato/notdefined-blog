---
title: "Ruby, Concurrencia y Paralelismo: La Verdad"
excerpt: "Si creías que los threads te darían paralelismo real en Ruby… oops. Pero tranquilo, hay formas de sacarle jugo a la concurrencia y al paralelismo con Fibers, Processes y Ractors. Vamos a destriparlos con ejemplos claros y comparaciones de rendimiento."
coverImage: "/assets/blog/ruby-parallelism-and-concurrency/cover.jpg"
date: "2025-01-23T05:35:07.322Z"
author:
  name: Adrian Castillo
  picture: "/assets/blog/authors/adrian.jpeg"
ogImage:
  url: "/assets/blog/ruby-parallelism-and-concurrency/cover.jpg"
---

# Ruby y la Concurrencia: Threads, Fibers, Procesos y Ractors sin Mitos

## TL;DR
Si creías que los threads te darían paralelismo real en Ruby… oops. Pero tranquilo, hay formas de sacarle jugo a la concurrencia y al paralelismo con **Fibers, Processes y Ractors**. Vamos a destriparlos con ejemplos claros y comparaciones de rendimiento.

Si quieres hacer varias cosas a la vez en Ruby, tienes varias opciones:
- **Threads**: Concurrencia dentro del mismo proceso (afectado por el GIL en MRI).
- **Fibers**: Concurrencia cooperativa, ideales para operaciones I/O intensivas.
- **Processes**: Paralelismo real creando múltiples procesos del sistema.
- **Ractors (Ruby 3+)**: Nueva alternativa para ejecutar código en paralelo sin las limitaciones del GIL.

Cada uno tiene su lugar dependiendo de lo que quieras lograr.

## Concurrencia vs Paralelismo: Conceptos clave

Vamos a dejar las cosas claras, para que no te confundas.

- **Concurrencia**: Manejo de múltiples tareas al mismo tiempo. Se trata de estructurar tu programa para que diferentes partes se ejecuten concurrentemente, aunque no necesariamente al mismo tiempo exacto. Es como un chef preparando varias recetas a la vez: puede picar vegetales, luego revolver una salsa, pero no lo hace todo en el mismo instante.
- **Paralelismo**: Ejecutar múltiples tareas simultáneamente, lo que requiere múltiples unidades de procesamiento (como múltiples núcleos en tu CPU). Siguiendo el ejemplo del chef, esto sería como tener varios chefs trabajando en diferentes platos al mismo tiempo.

## Ruby y sus mecanismos de concurrencia y paralelismo

Ahora sí, sabiendo qué es, podemos ver qué cuchara usar y cómo comerlo.

### 1️⃣ Threads: Concurrencia dentro de un proceso

Los **threads** son unidades ligeras de ejecución dentro de un solo proceso que comparten el mismo espacio de memoria. MRI (la implementación estándar de Ruby) históricamente usaba **green threads** gestionados por la VM, lo que significa que no había paralelismo real. Hoy en día, usa **threads nativos**, pero el **Global Interpreter Lock (GIL)** impide la ejecución paralela de múltiples threads en CPU.

En corto:
- Ideales para **tareas con mucho I/O** (requests HTTP, archivos, bases de datos).
- No recomendados para tareas intensivas en CPU (debido al GIL).

```ruby
threads = []
10.times do |i|
  threads << Thread.new do
    puts "Thread #{i}: Starting"
    sleep(1) # Simula trabajo
    puts "Thread #{i}: Finishing"
  end
end
threads.each(&:join) # Espera a que terminen
puts "All threads done."
```

Tienen el problema de que múltiples threads pueden modificar la misma variable sin control, generando valores inesperados (race conditions). Nada que un `Mutex` no resuelva, pero es algo a tener en cuenta.

Algo asi:
```ruby
mutex = Mutex.new

counter = 0
threads = 10.times.map do
  Thread.new do
    mutex.synchronize { counter += 1 }
  end
end
threads.each(&:join)
puts counter  # Siempre será 10
```

### 2️⃣ Fibers: Concurrencia cooperativa

Los **fibers** son incluso más livianos que los threads. Son **hilos cooperativos** que solo avanzan cuando explícitamente se les indica. No son preemptivos, lo que significa que un fiber **no interrumpe a otro automáticamente**.

¿Cómo me sirven?
- Útiles para **concurrencia controlada**.
- Muy usados en **I/O asíncrono** y en implementaciones de iteradores.

```ruby
fiber1 = Fiber.new do
  puts "Fiber 1: Starting"
  Fiber.yield
  puts "Fiber 1: Resuming"
end

fiber2 = Fiber.new do
  puts "Fiber 2: Starting"
  fiber1.resume
  puts "Fiber 2: Finishing"
end

fiber2.resume
puts "Done."
```

A diferencia de los threads, los fibers no se ejecutan automáticamente; debes gestionarlos manualmente. Úsalos con tareas livianas para evitar complicaciones

### 3️⃣ Processes: Paralelismo real

Los **procesos** son instancias separadas del intérprete de Ruby, cada una con su propio espacio de memoria. Debido a esto, **evitan el GIL** y pueden ejecutarse en paralelo.

Dicho de otra manera:
- **Tareas CPU-intensivas** donde el paralelismo real es clave.
- Cuando se necesita aislar memoria entre tareas.

```ruby
processes = []
10.times do |i|
  processes << Process.fork do
    puts "Process #{i}: Starting"
    sleep(1)
    puts "Process #{i}: Finishing"
  end
end
processes.each { |p| Process.wait(p) }
puts "All processes done."
```

Cada proceso es independiente, lo que significa mayor consumo de memoria (uno por cada proceso que crees). La mayor dificultad es compartir datos entre ellos, pero puedes usar Pipes o una base de datos para solucionarlo.

### 4️⃣ Ractors: Concurrencia en Ruby 3+

Los **ractors** (Ruby 3+) permiten paralelismo sin las limitaciones del GIL. Funcionan con **estado aislado**, lo que evita condiciones de carrera y problemas de concurrencia.

Puedes usarlos en estos casos:
- Cuando se requiere paralelismo sin compartir memoria.
- Alternativa segura a threads para código concurrente en Ruby 3+.

```ruby
r = Ractor.new do
  puts "Ractor: Starting"
  Ractor.receive
  puts "Ractor: Received a message"
end

r.send("Hello from the main Ractor!")
puts "Main Ractor: Sending a message"
r.take
puts "Main Ractor: Done"
```

Esto es lo nuevo y emocionante. Aún no los he usado en un proyecto real, pero nada es gratis. Luego actualizaré el post para reflejar lo que aprenda de ellos. Mientras tanto, úsalos con precaución.

## 🛠 En resumen, Cuándo usar qué

Yo diria que todo esta claro, pero si no, aqui tienes un resumen

| Método    | Ideal para...                                    | No recomendado para...                |
|-----------|------------------------------------------------|----------------------------------|
| **Threads**  | Muchas tareas con I/O (HTTP, DB, archivos)  | Cálculos intensivos (GIL lo limita) |
| **Fibers**   | Tareas livianas con control manual         | Tareas paralelas o intensivas    |
| **Processes**| Cálculos pesados, procesamiento en paralelo | Compartir memoria o datos       |
| **Ractors**  | Paralelismo seguro sin compartir memoria  | Ruby < 3 o código con muchas dependencias |

Me concentraría en threads y processes. Honestamente, rara vez uso fibers, y Ractor es el nuevo en la cuadra. Como sobresimplificación (porque seguro te lo preguntarán en una entrevista), piensa en esto:

- Threads: Son como varios asistentes trabajando en la misma cocina (proceso). Comparten ingredientes (memoria) y pueden cocinar a la vez, usando mas CPU y siendo buenisimos para tareas con mucho I/O (requests, files, etc).

- Processes: Son como cocinas separadas, cada una con su propio equipo y recursos. No comparten nada directamente,usan mas memoria y son perfectos para tareas pesadas en CPU (calculos, etc).

Ya te la sabes,**Threads para I/O, Processes para CPU, Fibers para control fino.**. Y si todo falla, **prueba Elixir o Rust. 😆**
