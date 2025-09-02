---
title: "Principios SOLID"
description: "Explicación de los principios SOLID en el desarrollo de software orientado a objetos."
---

![Diagrama de los principios SOLID](/images/solid.png)

## Antecedentes

Los principios SOLID fueron introducidos por primera vez por el famoso científico informático Robert J. Martin (también conocido como el tío Bob) en uno de sus artículos en 2000. Pero el acrónimo SOLID fue introducido más tarde por Michael Feathers.

El tío Bob también es el autor de los libros best-sellers Clean Code y Clean Architecture, y es uno de los participantes de la "Alianza Agile".

Veamos cada principio uno por uno. Siguiendo el acrónimo inglés SOLID, son:

- S: El Principio de responsabilidad única (Single Responsibility Principle)
- O: El Principio Abierto-Cerrado (Open-Closed Principle)
- L: El Principio de sustitución de Liskov (Liskov Substitution Principle)
- I: El Principio de segregación de interfaz (Interface Segregation Principle)
- D: El Principio de inversión de dependencia (Dependency Inversion Principle)

## Principio de responsabilidad única
El Principio de Responsabilidad Única dice que **una clase debe hacer una cosa y, por lo tanto, debe tener una sola razón para cambiar**.

### Ej: 
``` 
public class Factura {

	private Libro libro;
	private int cantidad;
	private double tasaDescuento;
	private double tasaImpuesto;
	private double total;

	public Factura(Libro libro, int cantidad, double tasaDescuento, double tasaImpuesto) {
		this.libro = libro;
		this.cantidad = cantidad;
		this.tasaDescuento = tasaDescuento;
		this.tasaImpuesto = tasaImpuesto;
		this.total = this.calculaTotal();
	}

	public double calculaTotal() {
	        double precio = ((libro.precio - libro.precio * tasaDescuento) * this.cantidad);

		double precioConImpuestos = precio * (1 + tasaImpuesto);

		return precioConImpuestos;
	}

	public void imprimeFactura() {
            System.out.println(cantidad + "x " + libro.nombre + " " +          libro.precio + "$");
            System.out.println("Tasa de Descuento: " + tasaDescuento);
            System.out.println("Tasa de Impuesto: " + tasaImpuesto);
            System.out.println("Total: " + total);
	}

        public void guardarArchivo(String nombreArchivo) {
	// Crea un archivo con el nombre dado y escribe la factura.
}
```

La primera violación es el método imprimeFactura, el cual contiene nuestra lógica de impressión. El PRU establece que nuestra clase solo debería tener una única razón para cambiar, y esa razón debería ser un cambio en el cálculo de la factura para nuestra clase.

Hay otro método que viola el PRU en nuestra clase: el método guardarArchivo. También es un error extremadamente común mezclar la lógica de persistencia con la lógica de negocios.

**Solución**: Creamos 2 clases, FacturaImpresion y FacturaPersistencia, y movemos los métodos.

## Principio de apertura y cierre
El principio de apertura y cierre exige que **las clases deban estar abiertas a la extensión y cerradas a la modificación**.

Modificación significa cambiar el código de una clase existente y extensión significa agregar una nueva funcionalidad.

### Ej: problema de modificación al agregar otro metodo guardar
```
public class FacturaPersistencia {
    Factura factura;

    public FacturaPersistencia(Factura factura) {
        this.factura = factura;
    }

    public void guardarArchivo(String nombreArchivo) {
        // Crea un archivo con el nombre dado y escribe la factura.
    }

    public void guardarEnBaseDatos() {
        // Guarda la factura en la base de datos
    }
}
```

**Solucion**: Creamos 2 clases, BaseDeDatosPersistencia y ArchivoPersistencia, y movemos los métodos. Con ayuda del *POLIMORFISMO* podemos hacer que ambas clases implementen una interfaz común, lo que nos permitirá utilizarlas de manera intercambiable.

```
interface FacturaPersistencia {

    public void guardar(Factura factura);
}
```
```
public class BaseDeDatosPersistencia implements FacturaPersistencia {

    @Override
    public void guardar(Factura factura) {
        // Guardar en la base de datos
    }
}
```
```
public class ArchivoPersistencia implements FacturaPersistencia {

    @Override
    public void guardar(Factura factura) {
        // Guardar en archivo
    }
}
```
Así que nuestra estructura de clases ahora se ve así:

![Diagrama de los principios SOLID](/images/SOLID-Tutorial-1.png)

 Si nuestro jefe nos pide que agreguemos otra base de datos y tengamos 2 tipos diferentes de bases de datos como MySQL y MongoDB, podemos hacerlo fácilmente.

## Principio de sustitución de Liskov
El Principio de Sustitución de Liskov establece que **las subclases deben ser sustituibles por sus clases base**.

Esto significa que, dado que la clase B es una subclase de la clase A, deberíamos poder pasar un objeto de la clase B a cualquier método que espere un objeto de la clase A y el método no debería dar ningún resultado extraño en ese caso.

Este es el comportamiento esperado, porque cuando usamos la herencia asumimos que la clase secundaria hereda todo lo que tiene la superclase. La clase secundaria extiende el comportamiento pero nunca lo reduce.

### Esto "NO" es la definición de Barbara Liskov
Muchas veces me encuentro situaciones en las que la gente me dice bueno lo que quiere decir es que en una relación de herencia tenemos que buscar que la clase hija tenga una relación de “es de” . Por ejemplo no puede haber herencia entre Coche y Motor porque un Motor no es un Coche . Sin embargo sí puede haber relación de herencia entre Persona y Deportista ya que un deportista es una persona. 

### Ej: 
```
public class Persona {
 
    private String dni;
    private String nombre;
    private String apellidos;
    private String tarjeta;

    public void pagar () {

    }
}
```
Se trata de una clase sencilla , vamos ahora a usar la herencia y crear una clase hija . En este caso vamos a heredar la clase Niño ya que un niño “es una Persona” por lo tanto es correcto usar la herencia ya que estamos ante una relación de categorización o ¿quizás no?.
```
public class Niño  extends Persona{
 
    public Niño(String nombre, String apellidos) {
        super(null, nombre, apellidos, null);
        // TODO Auto-generated constructor stub
    }
 
    @Override
    public void pagar() {
        // TODO Auto-generated method stub
        throw new RuntimeException(&amp;amp;quot;un niño no puede pagar&amp;amp;quot;);
    }
 
}
```
Rápidamente comienzan los problemas , el niño no tiene Dni , no tiene tarjeta y gracias a dios no puede pagar nada. Sin embargo sí es un tipo de Persona y cumple con la relación "es de". ¿Qué es lo que esta sucediendo?. Lo que esta sucediendo es que No estamos aplicando el Principio de Substitución de Liskov.

**Solucion**: Podemos aplicar de forma estricta el Principio de Substitución de Liskov y rediseñar nuestra jerarquía de clases. Vamos a verlo:

![alt text](/images/liskovdelegacion.png)

Ahora sí que el niño es una Persona ya que siempre tiene nombre y apellidos. Es la clase Adulto la que incorpora el Dni y la tarjeta para pagar. De esta forma todo es más reutilizable. Si queremos que el niño pueda pagar algo lo hará delegando en la clase Adulto que es la que puede hacerlo con la figura de tutor . Veamos el código

```
public class Adulto extends Persona {
 
    public Adulto(String nombre, String apellidos, String dni, String tarjeta) {
        super(nombre, apellidos);
        this.dni = dni;
        this.tarjeta = tarjeta;
    }
 
    private String dni;
    private String tarjeta;
 
    public void pagar() {
    }
}
```
```
public class Persona {
 
    private String nombre;
    private String apellidos;

    public Persona( String nombre, String apellidos) {
        super();
 
        this.nombre = nombre;
        this.apellidos = apellidos;
 
    } 
}
```
```
public class Niño extends Persona{
 
    private Adulto tutor;
 
    public Niño(String nombre, String apellidos,Adulto tutor) {
        super( nombre, apellidos);
        this.tutor=tutor;
    } 
}
```
Se han omitido los métodos getter y setter para las clases `Persona`, `Adulto` y `Niño`.

## Principio de segregación de interfaces
Este principio nos dice que una clase nunca debe extender de interfaces con métodos que no usa, por el principio de segregación de interfaces busca que las interfaces sean lo más pequeñas y específicas posible de modo que cada clase solo implemente los métodos que necesita.

### ¿Cómo detectar que estamos violando el principio de segregación de interfaces?
Estaremos violando este principio si Tenemos clases que implementan métodos de interfaces que no se usan.
Otro caso de violación del principio sería cuando definimos interfaces con parámetros que no se van a utilizar en todas las clases.
Otra señal de que nos estamos saltando el principio será cuando tenemos interfaces muy grandes. Probablemente estemos definiendo métodos que no son genéricos y que otras clases que implementen esta interfaz no puedan usar.

Mala implementación:

```
export default interface AnimalInterface {
  run(),
  eat(),
}
```
```
class Dog implements AnimalInterface {
  eat() {
    console.log('eating...')
  }

  run() {
    console.log('running...')
  }
}
```
```
import AnimalInterface from "./AnimalInterface";

class Fish implements AnimalInterface {
  eat() {
    console.log('eating...')
  }

  run() {
    throw new Error('Method not implemented')
  }
}
```

### ¿Cómo solucionar la violación del principio?
Podremos solucionar la violación del principio dividiendo interfaces grandes con métodos que no todas las clases que la implementan usan, por clases mas pequeñas con métodos usados por las clases

En el caso de que tengamos interfaces con parámetros definidos, deberemos valorar si es un elemento común entre las clases que implementan esa interfaz. Y, si no lo es, deberemos eliminarlos.

Correcta definición:
```
export default interface EatInterface {
  eat();
}
```
```
export default interface RunInterface {
  run();
}
```
Implementación:
```
class Fish implements EatInterface {
  eat() {
    console.log('eating...')
  }
}
```
```
class Dog implements EatInterface, RunInterface {
  eat() {
    console.log('eating...')
  }
  run() {
    console.log('running...')
  }
}
```