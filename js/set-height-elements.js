/* eslint-disable promise/catch-or-return, no-empty-function, no-unused-vars */
const Utils = {
  mergeDeep: (...objects) => {
    const isObject = obj => obj && typeof obj === 'object';
    
    return objects.reduce((prev, obj) => {
      Object.keys(obj).forEach(key => {
        const pVal = prev[key];
        const oVal = obj[key];
        
        if (Array.isArray(pVal) && Array.isArray(oVal)) {
          prev[key] = [...new Set([...oVal, ...pVal])];
        }
        else if (isObject(pVal) && isObject(oVal)) {
          prev[key] = Utils.mergeDeep(pVal, oVal);
        }
        else {
          prev[key] = oVal;
        }
      });
      
      return prev;
    }, {});
  }
}

function setHeightElements(nodeElementsArray, newOptions = {}){
  // ------------------------ VARAIBLES ------------------------

  const finalOptions = Utils.mergeDeep({
    autoInit: true,
    cssVariable: '--max-value',
    gridOptions: null,
    initialIndex: 0,
    classElementToOmit: '',
    on: {
      init: (data) => {},
      afterResize: (data) => {},
      afterChanges: (data) => {},
      afterUpdate: (data) => {},
      afterDestroy: (data) => {},
    },
  }, newOptions);

  let elementsObservers = []
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

  this.config = finalOptions
  this.elementsArray = nodeElementsArray
  this.values = 0

  // ------------------------ END VARAIBLES ------------------------

  // ------------------------ FUNCTIONALITY ------------------------

  const setPropertyCss = (arrayElements, cssVariable, cssVariableValue) => {
    if (arrayElements.length === 0) {
      return
    }

    arrayElements.forEach((element, index) => {
      element.style.setProperty(cssVariable, cssVariableValue);
    });
  }

  const setCallbacks = (calledOn, data) => {
    if (calledOn === "init") {
      finalOptions.on.init(data, this);
    }
    if (calledOn === "resize") {
      finalOptions.on.afterResize(data);
    }
    if (calledOn === "changes") {
      finalOptions.on.afterChanges(data);
    }
    if (calledOn === "update") {
      finalOptions.on.afterUpdate(data);
    }
    if (calledOn === "destroy") {
      finalOptions.on.afterDestroy(this);
    }
  };

  const setMaxHeightElements = (calledOn) => {
    let maxValue = 0;

    if (finalOptions.gridOptions == null) {
      maxValue = 0;
      const elements = [...filteredElements];

      setPropertyCss(elements, finalOptions.cssVariable, 'unset')

      elements.forEach((element, index) => {
        const elementToOmit = element.classList.contains(
          finalOptions.classElementToOmit,
        );

        if (element.offsetHeight > maxValue && !elementToOmit) {
          maxValue = element.offsetHeight;
        }
      });

      setPropertyCss(elements, finalOptions.cssVariable, `${maxValue}px`)

      this.values = maxValue
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

        setPropertyCss(group, finalOptions.cssVariable, 'unset')

        group.forEach((element, index) => {
          const elementToOmit = element.classList.contains(
            finalOptions.classElementToOmit,
          );

          if (element.offsetHeight > maxValue && !elementToOmit) {
            maxValue = element.offsetHeight;
          }
        });

        setPropertyCss(group, finalOptions.cssVariable, `${maxValue}px`)

        arrayMaxValues.push(maxValue);
      });

      this.values = arrayMaxValues
      setCallbacks(calledOn, arrayMaxValues);
    }
  };

  const cleanHeightElements = () => {
    const elements = [...filteredElements]

    elements.forEach((element, index) => {
      element.style.removeProperty(finalOptions.cssVariable);
    });
  };

  const updateAfterResize = () => {
    setMaxHeightElements("resize");
  }

  const updateAfterChanges = () => {
    setMaxHeightElements("changes");
  }

  const setChangesObserver = () => {
    [...filteredElements].forEach((element) => {
      const elementObserver = new window.MutationObserver(updateAfterChanges);
      elementsObservers.push(elementObserver)
    });
  };

  const resizeObserver = new window.ResizeObserver(updateAfterResize);

  // ------------------------ END FUNCTIONALITY ------------------------

  // ------------------------ METHODS ------------------------

  this.startResizeCalculation = () => {
    resizeObserver.observe(document.body);
  }

  this.stopResizeCalculation = () => {
    resizeObserver.unobserve(document.body);
  }

  this.startChangesObserver = () => {
    [...filteredElements].forEach((element, index) => {
      elementsObservers[index].observe(element, {
        childList: true,
        subtree: true,
      });
    });
  }

  this.stopChangesObserver = () => {
    [...filteredElements].forEach((element, index) => {
      elementsObservers[index].disconnect();
    });
  }

  this.update = () => {
    setMaxHeightElements("update");
  }

  this.init = () => {
    setMaxHeightElements("init");
    setChangesObserver();
    this.startResizeCalculation()
    this.startChangesObserver()
    window.console.info(
      "Se han configurado los elementos de manera existosa.",
    );
  }

  this.destroy = () => {
    cleanHeightElements()
    this.stopResizeCalculation()
    this.stopChangesObserver()
    this.values = 0
    elementsObservers = []
    setCallbacks("destroy")
    window.console.info(
      "Se eliminó la configuración de los elementos.",
    );
  }

  // ------------------------ END METHODS ------------------------

  // ------------------------ INIT ------------------------

  if (finalOptions.autoInit) {
    document.fonts.ready.then(() => {
      this.init()
    }).catch((error) => {
      window.console.log(error);
    });
  }

  window.SHE.Instances.push(this)
  return this
  // ------------------------ END INIT ------------------------
};

window.SHE = window.SHE || {
  Init: setHeightElements,
  Instances: [],
  Utils,
};

export default setHeightElements;
