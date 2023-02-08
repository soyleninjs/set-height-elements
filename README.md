

# Set Height Elements


Script para calcular la altura máxima entre un conjunto de elementos.


El objetivo de este script es comparar la altura de un conjunto de elementos/nodos en el DOM y obtener la altura que sea mayor, regresando ese valor en forma de variable CSS a cada uno de los elementos/nodos, con el fin de poder lograr una alineación horizontal perfecta (por ejemplo, muchos cards en un slider, o un grid).


[![npm](https://img.shields.io/npm/v/set-height-elements?color=check&style=plastic)](https://www.npmjs.com/package/set-height-elements)


## Contenido


- [Instalar](#Instalar)
- [Demo](#Demo)
- [Funcionamiento](#Funcionamiento)
- [Parámentros](#Parámentros)
- [Métodos](#Métodos)


## Instalar


**Set Height Elements** está disponible en NPM con el nombre de `set-height-elements`, se puede instalar con Yarn o NPM


```sh
yarn add set-height-elements
```


```sh
npm i set-height-elements
```


## Demo


**[Codepen](https://codepen.io/soyleninjs/pen/PoKMxGV)**


## Funcionamiento


Para inicializar el script solo basta con crear una instancia de ella, pasando los parámetros correspondientes, como el array de los elementos y opcionalmente las configuraciones que desee agregar.


```javascript
  
  const $titlesGridCard = document.querySelectorAll(".title-wrapper");


  const instanceGrid = new setHeightElements($titlesGridCard, {
    cssVariable: "--value",
    gridOptions: {
      defaultColumns: 5,
      responsive: {
        1440: 4,
        834: 3,
        680: 2
      }
    },
    on: {
      init: (value) => {
        console.log("init:  ", value);
      },
      afterResize: (value) => {
        console.log("resize:  ", value);
      },
    },
  });


  window.console.log(instanceGrid); // [object Object]


```


## Parámentros


  - **nodeElementsArray [Required] [*NodeArrayElements*]**
    Este parámetro recibe el array de todos los elementos para revisar  su altura.


    ```javascript
    const titles = document.querySelectorAll(".title-wrapper");
    ```


  - **Options [Optional] [Object]**
    Este parámetro que recibe es un objeto con todas las opciones posibles. Cada que agregues una opción esta sobrescribe la default.


    ```javascript
    const options = {
      autoInit: true,
      cssVariable: '--max-value',
      gridOptions: null,
      initialIndex: 0,
      classElementToOmit: '',
      on: {
        init: (data, instance) => {},
        afterResize: (data) => {},
        afterChanges: (data) => {},
        afterUpdate: (data) => {},
        afterDestroy: (instance) => {},
      },
    };
    ```


    - **autoInit [Optional] [Boolean]**
      Con este campo se indica si se inicia la configuración de manera automática una vez que se instancia, el valor default es *true*, pero si se coloca en *false*, posteriormente puede usar el método de **init()** para iniciar la configuración de manera manual.


      ```javascript
      const autoInit = true;
      ```


    - **cssVariable [Optional] [String]**
      Este campo sirve para colocar la variable la cual tendrá el valor del cálculo de todas las alturas de entre todos los elementos del array. Esta variable se coloca en todos los elementos examinados.


      ```javascript
      const cssVariable = "--max-value";
      ```


    - **gridOptions [Optional - Only for grid] [Object]**
      Este parámetro se utiliza solo cuando el layout es un grid. Este es un objeto con dos propiedades los cuales contendrán información como las columnas default, los breakpoints y cuantas columnas hay en cada medida.
      Se basa en **desktopFirst**, es decir, una vez que alcanza la medida este se configura hacia abajo, dando el número de columnas pasado a esta medida, y cambia una vez alcance la siguiente medida.
      **NOTA:** El valor de ‘_defaultColumns_’ es **Requerido**, si no se coloca en código lanzará error.


      ```javascript
      const optionsGrid = {
        defaultColumns: 5,
        responsive: {
          // window.width <= 1440px : 4 columns
          1440: 4,
          // window.width <= 834px : 3 columns
          834: 3,
          // window.width <= 680px : 2 columns
          680: 2,
        },
      };
      ```


    - **initialIndex [Optional] [Number]**
      Este campo ayuda a que el script inicie en determinada posición del array, es decir, que inicie a partir de determinado index, así evitando configurar elementos que estén por detrás de esta posición inicial.


      ```javascript
      const initialIndex = 0;
      ```


    - **classElementToOmit [Optional] [String]**
      Este parámetro recibe el nombre de la clase que comparten los elementos en el array, es decir, esta clase se usa para saltar aquel elemento que contenga esta clase, así se omite y no es contemplado para checar su altura.


      ```javascript
      const classElementToOmit = "element-class-to-omit";
      ```


    - **on [Optional] [Object]**
      Dentro de este objeto encontraremos los métodos/callbacks para cada evento que pase durante la vida de la instancia.


      - **init [Optional] [function]**
      Función que retorna el valor que se asignó a los elementos justo después de haber configurado los elementos por primera vez, tambien retorna la instancia completa.


      ```javascript
      on: {
        init: (data, instance) => {
          console.log(data, instance);
        },
      };
      ```


      - **afterResize [Optional] [function]**
      Función que se ejecuta después de cada resize. Retorna los valores actualizados después del resize.


      ```javascript
      on: {
        afterResize: (data) => {
          console.log(data);
        },
      };
      ```


      - **afterChanges [Optional] [function]**
      Función que se ejecuta después de un cambio en el DOM sobre los elementos del array. Retorna los valores actualizados después de la actualización.


      ```javascript
      on: {
        afterChanges: (data) => {
          console.log(data);
        },
      };
      ```


      - **afterUpdate [Optional] [function]**
      Función que se invoca después de ejecutar el método **update()** de la instancia. Retorna los valores después de la actualización.


      ```javascript
      on: {
        afterUpdate: (data) => {
          console.log(data);
        },
      };
      ```


      - **afterDestroy [Optional] [function]**
      Función que se invoca después de ejecutar el método **destroy()** de la instancia. Retorna la instancia


      ```javascript
      on: {
        afterDestroy: (instance) => {
          console.log(instance);
        },
      };
      ```


## Métodos


  - **init** - Este método funciona para inicializar la configuración de manera manual. (este método puede usarse si anteriormente se usó el método **destroy()**)


    ```javascript
      myInstance.init()
    ```


  - **destroy** - Este método destruye toda la configuración hecha por la app, remueve las variables css y cancelar los eventos enlazados a los elementos.


    ```javascript
      myInstance.destroy()
    ```


  - **update** - Este método ayuda a actualizar de manera manual la configuración, esto hará que el callback de **afterUpdate()** se invoque.


    ```javascript
      myInstance.update()
    ```


  - **startResizeCalculation** - Este método inicializa el observador de *'resize'*, esto hará que el callback de **afterResize()**  se invoque.


    ```javascript
      myInstance.startResizeCalculation()
    ```


  - **stopChangesObserver** - Este método cancela el observador de *'resize'*, esto hará que el callback de **afterResize()** deje de invocarse.


    ```javascript
      myInstance.stopChangesObserver()
    ```


  - **startChangesObserver** - Este método inicializa el observador para los cambios en el DOM sobre los elementos, esto hará que el callback de **afterChanges()** se invoque.


    ```javascript
      myInstance.startChangesObserver()
    ```


  - **stopChangesObserver** - Este método cancela el observador para los cambios en el DOM sobre los elementos, esto hará que el callback de **afterChanges()** deje de invocarse.


    ```javascript
      myInstance.stopChangesObserver()
    ```


















