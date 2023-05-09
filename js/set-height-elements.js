/* eslint-disable no-empty-function, no-unused-vars */

/*
 * 2.1.0
 * Cambiar el nombre a mayusculas para la Instancia ✅
 * Activar los mensajes con modo debug (activar con la configuracion) ✅
 * Agregar instancias en cada callback ✅
 * Se removio el objeto de utilsSHE del objeto global, no era necesario ✅
 * Agregar clases de ayuda para los elementos calculados ✅
 *   - Cuando es 0 = "height-zero"
 *   - Cuando se Esta calculando - "height-calculating"
 *   - Cuando termino de calcular - "height-calculated"
 * Se cambio la variable default por "--height"
 *
 *
 *
 *
 *
 */

const utilsSHE = {
  mergeDeepObject: (...objects) => {
    const isObject = (obj) => obj && typeof obj === 'object';

    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach((key) => {
        const pVal = prev[key];
        const oVal = obj[key];

        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          prev[key] = [...new Set([...oVal, ...pVal])];
        } else if (isObject(pVal) && isObject(oVal)) {
          prev[key] = utilsSHE.mergeDeepObject(pVal, oVal);
        } else {
          prev[key] = oVal;
        }
      });

      return prev;
    }, {});
  },
  debounce(fn, wait) {
    let t;
    return (...args) => {
      window.clearTimeout(t);
      t = window.setTimeout(() => fn.apply(this, args), wait);
    };
  },
  uniqueID() {
    const random = Math.random().toString(36).substr(2);
    const fecha = Date.now().toString(36);
    return fecha + random;
  },
  returnArrayData(data) {
    return Array.isArray(data) ? data : [data];
  },
  getcssVariable(element, cssVariable) {
    return window.getComputedStyle(element).getPropertyValue(cssVariable);
  },
  cssVariable(DOMElements, cssVariable, cssVariableValue = null) {
    const elements = utilsSHE.returnArrayData(DOMElements);

    if (!elements || elements.length === 0) {
      return;
    }

    elements.forEach((element, index) => {
      if (cssVariableValue === null) {
        element.style.removeProperty(cssVariable);
        return;
      }

      element.style.setProperty(cssVariable, cssVariableValue);
    });
  },
  classElements(DOMElements, status, classes) {
    const classesArray = utilsSHE.returnArrayData(classes);
    const elements = utilsSHE.returnArrayData(DOMElements);

    if (!elements || elements.length === 0) {
      return;
    }

    elements.forEach((element) => {
      if (status === 'add') {
        element.classList.add(...classesArray);
      }
      if (status === 'remove') {
        element.classList.remove(...classesArray);
      }
    });
  },
  wrapElements(DOMElements, classWrapper, tagElementWrapper = 'div') {
    const elements = utilsSHE.returnArrayData(DOMElements);

    if (!elements || elements.length === 0) {
      return;
    }

    elements.forEach((element) => {
      const wrapper = document.createElement(tagElementWrapper);
      wrapper.className = classWrapper;
      element.parentNode.insertBefore(wrapper, element);
      wrapper.appendChild(element);
    });
  },
  unwrapElement(DOMElements) {
    const elements = utilsSHE.returnArrayData(DOMElements);

    elements.forEach((element) => {
      const wrapper = element.parentNode;

      while (wrapper.firstChild) {
        wrapper.parentNode.insertBefore(wrapper.firstChild, wrapper);
      }

      wrapper.parentNode.removeChild(wrapper);
    });
  },
  removeAttributes(DOMElements, attributesArray) {
    const attributes = utilsSHE.returnArrayData(attributesArray);
    const elements = utilsSHE.returnArrayData(DOMElements);

    elements.forEach((element) => {
      attributes.forEach((attribute) => {
        element.removeAttribute(attribute);
      });
    });
  },
  replaceElement(oldElement, newElement) {
    oldElement.replaceWith(newElement);
  },
};

function SetHeightElements(nodeElementsArray, newOptions = {}) {
  // ------------------------ VARAIBLES ------------------------

  const finalOptions = utilsSHE.mergeDeepObject(
    {
      autoInit: true,
      cssVariable: '--height',
      gridOptions: null,
      initialIndex: 0,
      classElementToOmit: '',
      debug: false,
      on: {
        init: (data, instance) => {},
        afterResize: (data, instance) => {},
        afterChanges: (data, instance) => {},
        afterUpdate: (data, instance) => {},
        afterDestroy: (instance) => {},
      },
    },
    newOptions,
  );

  let elementsObservers = [];
  const classes = {
    zero: 'height-zero',
    calculating: 'height-calculating',
    complete: 'height-calculated',
  };
  const filteredElements = [...nodeElementsArray].filter((element, index) => {
    if (finalOptions.initialIndex > 0) {
      if (index >= finalOptions.initialIndex) {
        return element;
      }
    } else {
      return element;
    }

    return false;
  });

  this.id = utilsSHE.uniqueID();
  this.config = finalOptions;
  this.elementsArray = nodeElementsArray;
  this.values = 0;

  // ------------------------ END VARAIBLES ------------------------

  // ------------------------ FUNCTIONALITY ------------------------

  const setDebugMessage = (message) => {
    if (finalOptions.debug) {
      window.console.info(
        `%cInstace[${this.id}] - ${message}`,
        `
          background-color: lightgray;
          padding: 3px;
          font-style: italic; 
          color: black;
        `,
      );
    }
  };

  const setCallbacks = (calledOn, data) => {
    if (calledOn === 'init') {
      finalOptions.on.init(data, this);
      setDebugMessage("Se ejecuto el callback 'init' correctamente.");
    }
    if (calledOn === 'resize') {
      finalOptions.on.afterResize(data, this);
      setDebugMessage("Se ejecuto el callback 'afterResize' correctamente.");
    }
    if (calledOn === 'changes') {
      finalOptions.on.afterChanges(data, this);
      setDebugMessage("Se ejecuto el callback 'afterChanges' correctamente.");
    }
    if (calledOn === 'update') {
      finalOptions.on.afterUpdate(data, this);
      setDebugMessage("Se ejecuto el callback 'afterUpdate' correctamente.");
    }
    if (calledOn === 'destroy') {
      finalOptions.on.afterDestroy(this);
      setDebugMessage("Se ejecuto el callback 'afterDestroy' correctamente.");
    }
  };

  const setMaxHeightElements = (calledOn) => {
    let maxValue = 0;

    if (finalOptions.gridOptions == null) {
      maxValue = 0;
      const elements = [...filteredElements];

      utilsSHE.cssVariable(elements, finalOptions.cssVariable);
      utilsSHE.classElements(elements, 'remove', [
        classes.zero,
        classes.calculating,
        classes.complete,
      ]);
      utilsSHE.classElements(elements, 'add', classes.calculating);

      elements.forEach((element, index) => {
        const elementToOmit = element.classList.contains(
          finalOptions.classElementToOmit,
        );

        if (element.offsetHeight > maxValue && !elementToOmit) {
          maxValue = element.offsetHeight;
        }
      });

      utilsSHE.cssVariable(
        elements,
        finalOptions.cssVariable,
        `${maxValue}px`,
      );
      utilsSHE.classElements(elements, 'remove', classes.calculating);
      if (maxValue > 0) {
        utilsSHE.classElements(elements, 'add', classes.complete);
      } else {
        utilsSHE.classElements(elements, 'add', classes.zero);
      }

      this.values = maxValue;
      setCallbacks(calledOn, maxValue);
    } else {
      const groupsElements = [];
      const arrayMaxValues = [];
      let columns = finalOptions.gridOptions.defaultColumns;
      const arrayElements = [...filteredElements];

      if (columns === undefined) {
        window.console.error(
          "Coloca el valor de 'defaultColumns' para el correcto funcionamiento",
        );
        return;
      }

      if (finalOptions.gridOptions.responsive !== undefined) {
        Object.keys(finalOptions.gridOptions.responsive)
          .reverse()
          .forEach((object) => {
            if (window.innerWidth > Number(object)) {
              return;
            }
            columns = finalOptions.gridOptions.responsive[object];
          });
      }

      let totalItems = arrayElements.length;
      while (totalItems !== 0) {
        const lastGroup = arrayElements.splice(0, columns);
        groupsElements.push(lastGroup);
        totalItems = arrayElements.length;
      }

      groupsElements.forEach((group) => {
        maxValue = 0;

        utilsSHE.cssVariable(group, finalOptions.cssVariable);
        utilsSHE.classElements(group, 'remove', [
          classes.zero,
          classes.calculating,
          classes.complete,
        ]);
        utilsSHE.classElements(group, 'add', classes.calculating);

        group.forEach((element, index) => {
          const elementToOmit = element.classList.contains(
            finalOptions.classElementToOmit,
          );

          if (element.offsetHeight > maxValue && !elementToOmit) {
            maxValue = element.offsetHeight;
          }
        });

        utilsSHE.cssVariable(
          group,
          finalOptions.cssVariable,
          `${maxValue}px`,
        );
        utilsSHE.classElements(group, 'remove', classes.calculating);
        if (maxValue > 0) {
          utilsSHE.classElements(group, 'add', classes.complete);
        } else {
          utilsSHE.classElements(group, 'add', classes.zero);
        }

        arrayMaxValues.push(maxValue);
      });

      this.values = arrayMaxValues;
      setCallbacks(calledOn, arrayMaxValues);
    }
  };

  const cleanHeightElements = () => {
    const elements = [...filteredElements];

    elements.forEach((element, index) => {
      element.style.removeProperty(finalOptions.cssVariable);
    });

    setDebugMessage('Se limpiaron los valores calculados de los elementos.');
  };

  const updateAfterResize = () => {
    setMaxHeightElements('resize');
    setDebugMessage('Se actualizaron los valores mediante Resize.');
  };

  const updateAfterChanges = () => {
    setMaxHeightElements('changes');
    setDebugMessage('Se actualizaron los valores por cambios en el DOM.');
  };

  const setChangesObserver = () => {
    [...filteredElements].forEach((element) => {
      const elementObserver = new window.MutationObserver(updateAfterChanges);
      elementsObservers.push(elementObserver);
    });
  };

  // ------------------------ END FUNCTIONALITY ------------------------

  // ------------------------ METHODS ------------------------

  this.startResizeCalculation = () => {
    window.addEventListener('resize', updateAfterResize);
    setDebugMessage('Observando el Resize...');
  };

  this.stopResizeCalculation = () => {
    window.removeEventListener('resize', updateAfterResize);
    setDebugMessage('Se dejó de Observar el Resize.');
  };

  this.startChangesObserver = () => {
    [...filteredElements].forEach((element, index) => {
      elementsObservers[index].observe(element, {
        childList: true,
        subtree: true,
      });
    });
    setDebugMessage('Observando cambios en el DOM...');
  };

  this.stopChangesObserver = () => {
    [...filteredElements].forEach((element, index) => {
      elementsObservers[index].disconnect();
    });
    setDebugMessage('Se dejaron de Observar los cambios en el DOM.');
  };

  this.update = () => {
    setMaxHeightElements('update');
    setDebugMessage('Se actualizaron los valores manualmente.');
  };

  this.init = () => {
    setMaxHeightElements('init');
    setChangesObserver();
    this.startResizeCalculation();
    this.startChangesObserver();
    setDebugMessage('Se han configurado los elementos de manera exitosa.');
  };

  this.destroy = () => {
    cleanHeightElements();
    this.stopResizeCalculation();
    this.stopChangesObserver();
    this.values = 0;
    elementsObservers = [];
    setCallbacks('destroy');
    setDebugMessage('Se eliminó la configuración de los elementos.');
  };

  // ------------------------ END METHODS ------------------------

  // ------------------------ INIT ------------------------

  if (finalOptions.autoInit) {
    document.fonts.ready
      .then(() => {
        this.init();
      })
      .catch((error) => {
        window.console.log(error);
      });
  }

  window.SHE.Instances.push(this);
  setDebugMessage("Se agregó la instancia en 'window.SHE.Instances'");
  return this;
  // ------------------------ END INIT ------------------------
}

window.SHE = window.SHE || {
  Init: SetHeightElements,
  Instances: [],
};

export default SetHeightElements;
