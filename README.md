# Set Height Elements

Script para colocar la altura maxima entre el conjunto de elementos.

La principal función de este script es hacer que todos los elementos pasados tengan la misma altura (por ejemplo, muchos cards en un slider, o un grid).

[![npm](https://img.shields.io/npm/v/set-height-elements?color=check&style=plastic)](https://www.npmjs.com/package/set-height-elements)

## Contenido

- [Instalar](#Instalar)
- [Demo](#Demo)
- [Parámentros](#Parámentros)

## Instalar

**Set Height Elements** esta disponible en NPM con el nombre de `set-height-elements`, se puede instalar con Yarn o NPM

```sh
yarn add set-height-elements
```

```sh
npm i set-height-elements
```

## Demo

**[Codepen](https://codepen.io/soyleninjs/pen/PoKMxGV)**

## Parámentros

- **nodeElementsArray [Required] [*NodeArrayElements*]**
  Este campo recibe el array de todos los elementos a checar su altura.
  ```javascript
  const titles = document.querySelectorAll(".title-wrapper");
  ```
- **Options [Optional] [Object]**
  Él parámetro que recibe es un objeto con todas las opciones posibles. Cada que agregues una option esta sobrescribe la default.
  ```javascript
  const options = {
    cssVariable: "--max-value",
    gridOptions: null,
    classElementToOmit: "",
    init: (data) => {},
    afterResize: (data) => {},
  };
  ```
  - **initialIndex [Optional] [Number]**
    Este campo ayuda a que el script inicie en determinada posición del array, es decir, que inicie a partir de determinada posición, así evitando configurar elementos que este por detrás de esta posición inicial.
    ```javascript
    const initialIndex = 0;
    ```
  - **cssVariable [Optional] [String]**
    Este campo sirve para colocar la variable la cual tendrá el valor del calculo de todas las alturas de entre todos los elementos del array. Esta variable se coloca en todos los elementos examinados.
    ```javascript
    const cssVariable = "--max-value";
    ```
  - **gridOptions [Optional - Only for grid] [Object]**
    Este parámetro se utiliza solo cuando el layout es un grid. este es un objeto con dos propiedades los cuales contendrán información como las columnas default, los breakpoints y cuantas columnas hay en cada medida.
    Se basa en **desktopFirst,** es decir, una vez que alcanza la medida este se configura hacia abajo, dando el numero de columnas pasado a esta medida, y cambia una vez alcance la siguiente medida.
    **NOTA:** El valor de ‘_defaultColumns_’ es **Requerido**, si no se coloca en código lanzara error.
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
  - **classElementToOmit [Optional] [String]**
    Este parámetro recibe el nombre de la clase que comparten los elementos en el array, es decir, esta clase se usa para saltar aquel elemento que contenga esta clase, así se omite y no es contemplado para checar su altura.
    ```javascript
    const classElementToOmit = "element-class-to-omit";
    ```
  - **init [Optional] [function]**
    Este parámetro para pasar una función callback el cual retorna el valor que se asigno a los elementos justo desde de la primer inicializacion.
    ```javascript
    const options = {
      init: (data) => {
        console.log(data);
      },
    };
    ```
  - **afterResize [Optional] [function]**
    Este parámetro para pasar una función callback el cual retorna el valor que se asigno a los elementos justo después de cada resize.
    ```javascript
    const options = {
      afterResize: (data) => {
        console.log(data);
      },
    };
    ```
