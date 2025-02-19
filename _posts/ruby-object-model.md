---
title: "Ruby Object Model: Un Recordatorio Rápido"
excerpt: "Todo en Ruby es un objeto, ¡TODO!, incluidas las clases mismas. Exploremos cómo funciona, cuál es su jerarquía y singleton classes, y ¿por qué no? también el method lookup y la metaprogramación de forma práctica en el día a día."
coverImage: "/assets/blog/ruby-object-model/cover.jpg"
date: "2025-01-08T05:35:07.322Z"
author:
  name: Adrian Castillo
  picture: "/assets/blog/authors/adrian.jpeg"
ogImage:
  url: "/assets/blog/ruby-object-model/cover.jpg"
preview: false
---

## TL;DR
- **Todo en Ruby es un objeto**, incluyendo clases.
- **Las singleton classes** permiten métodos únicos por objeto.
- **El method lookup** sigue una jerarquía definida.
- **Los módulos** permiten compartir código sin herencia múltiple.
- **Metaprogramación** con `send` permite invocar métodos dinámicamente.

## Explorando el Modelo de Objetos en Ruby
El modelo de objetos en Ruby es una de las partes más interesantes y flexibles del lenguaje. Todo en Ruby es un objeto, desde los enteros hasta las clases mismas. Veamos cómo funciona con ejemplos prácticos que puedan servir como referencia en el futuro.

### Todo es un Objeto
En Ruby, *todo* es un objeto, incluyendo números, cadenas, arreglos, hashes e incluso clases mismas. Esto significa que cada dato tiene métodos y puede responder a mensajes.

```ruby
puts 42.class        # Integer
puts "hello".class   # String
puts [1, 2, 3].class # Array
puts Object.class    # Class (¡Te dije que todo es un objeto!)
```

Incluso `nil`, `true` y `false` son también objetos en Ruby.

Si todo es un objeto, ¿cómo es la jerarquía en Ruby? Es simple:

```
BasicObject → Object → Numeric → Integer
```

¿No me crees? Mira esto:

```ruby
puts 42.class # Integer
puts 42.class.superclass # Numeric
puts 42.class.superclass.superclass # Object
puts 42.class.superclass.superclass.superclass # BasicObject
```

Si seguimos, se nos acaba el camino, porque `BasicObject` y `nil` no tienen superclase.

```ruby
puts 42.class.superclass.superclass.superclass.superclass # nil
puts 42.class.superclass.superclass.superclass.superclass.superclass # undefined method `superclass' for nil:NilClass (NoMethodError)
```

Eso significa que las clases en Ruby son objetos. Así es, cada clase es una instancia de `Class`, lo que permite manipularlas dinámicamente.

```ruby
puts String.class  # Class
puts Class.superclass  # Module
puts Module.superclass  # Object
```

### Herencia en Ruby
Sin dudarlo, ¿cómo funciona la herencia en Ruby? Bueno, solo soporta herencia simple, es decir, cada clase solo puede tener una superclase de la que hereda métodos y atributos.

```ruby
class Animal
  def speak
    puts "wof miau cof cof muu who?"
  end
end

class Dog < Animal
  def speak
    puts "wof wof"
  end
end

Dog.new.speak # => wof wof
```

Ruby permite compartir código entre clases con módulos mediante mixins. Para efectos prácticos, esto se hace con `include`.

```ruby
module Flyable
  def fly
    puts "¡Mamá, puedo volar!"
  end
end

class Bird < Animal
  include Flyable
end

Bird.new.fly # => ¡Mamá, puedo volar!
```

### Clases Singleton y Eigenclass
Ahora sí, es hora de hablar de temas más interesantes: las *singleton classes*, que permiten definir métodos únicos para instancias específicas.

¿Qué? ¿Dónde? ¿Cómo? Sí, en Ruby todo es un objeto, incluidas las clases. Y como todo objeto en Ruby, pueden tener métodos únicos. Para eso están las *singleton classes*, también conocidas como *eigenclasses* o *ghost classes*. Vamos a la acción.

Agreguemos un método a un objeto y veamos qué sucede:

```ruby
str = "Hola"

def str.shout
  upcase + "!!!"
end

puts str.shout  # "HOLA!!!"

# ¿Dónde vive ese método?
puts str.singleton_class  # #<Class:#<String:0x00007ff>>
puts str.class # String
```

¿Confundido? No te preocupes. Ruby tiene un orden de búsqueda de métodos en cada una de las clases hasta llegar a `BasicObject`. Si no lo encuentra, ejecutará `method_missing`. Si este no está definido, tendremos un error.

1. **Singleton class**
2. **Clase del objeto**
3. **Módulos incluidos**
4. **Superclases**
5. **BasicObject**
6. **`method_missing`** si no se encuentra

Se pone interesante. Hagamos un ejemplo más avanzado:

```ruby
module Flyable
  def fly
    puts "¡Mamá, puedo volar!"
  end
end

class Animal
  def speak
    puts "wof miau cof cof muu who?"
  end
end

class Bird < Animal
  include Flyable

  def walk
    puts "¡Mamá, puedo caminar-ish!"
  end
end

bird = Bird.new
puts bird.walk # "¡Mamá, puedo caminar-ish!"
puts bird.fly  # "¡Mamá, puedo volar!"
puts Bird.ancestors  # [Bird, Flyable, Animal, Object, Kernel, BasicObject]

another_bird = Bird.new

def another_bird.walk
  puts "Nope, no puedo caminar!"
end

puts bird.walk # undefined method `walk' for #<Bird:0x000000010515e018> (NoMethodError)
puts another_bird.walk # undefined method `walk' for #<Bird:0x000000070565e023> (NoMethodError)
```

Si intentamos modificar métodos en módulos después de incluirlos en una clase, Ruby no lo actualizará automáticamente en las instancias existentes. Para reflejar cambios en tiempo real, puedes:

- Re-incluir el módulo (`include Flyable` de nuevo).
- Usar `extend self` para métodos de clase.
- Usar `prepend` en lugar de `include`.
- Usar `extend` en la clase para métodos de clase dinámicos.

Pero bueno, esto ya es más de metaprogramación. Y para eso, mejor hacemos otro post. 🚀

