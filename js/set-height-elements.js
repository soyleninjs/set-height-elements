/* eslint-disable promise/catch-or-return, no-empty-function, no-unused-vars */

const setHeightElements = (nodeElementsArray, newOptions = {}) => {
  // ------------------------ VARAIBLES ------------------------

  let firstExecution = false;
  const defaultOptions = {
    cssVariable: "--max-value",
    gridOptions: null,
    classElementToOmit: "",
    init: (data) => {},
    afterResize: (data) => {},
  };
  const finalOptions = { ...defaultOptions, ...newOptions };

  // ------------------------ END VARAIBLES ------------------------

  // ------------------------ FUNCTIONALITY ------------------------

  const setCallbacks = (data) => {
    if (firstExecution) {
      finalOptions.afterResize(data);
    }
    if (!firstExecution) {
      finalOptions.init(data);
      firstExecution = true;
    }
  };

  const setMaxHeightElements = (elements) => {
    let maxValue = 0;

    if (finalOptions.gridOptions == null) {
      maxValue = 0;

      elements.forEach((element) => {
        element.style.setProperty(finalOptions.cssVariable, `unset`);
      });

      elements.forEach((element) => {
        const elementToOmit = element.classList.contains(
          finalOptions.classElementToOmit
        );

        if (element.offsetHeight > maxValue && !elementToOmit) {
          maxValue = element.offsetHeight;
        }
      });

      elements.forEach((element) => {
        element.style.setProperty(finalOptions.cssVariable, `${maxValue}px`);
      });

      setCallbacks(maxValue);
    } else {
      const arrayElements = Array.from(elements);
      const groupsElements = [];
      const arrayData = [];
      let columns = finalOptions.gridOptions.defaultColumns;

      if (columns === undefined) {
        window.console.error(
          "Coloca el valor de 'defaultColumns' para el correcto funcionamiento"
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

        group.forEach((element) => {
          element.style.setProperty(finalOptions.cssVariable, `unset`);
        });

        group.forEach((element) => {
          const elementToOmit = element.classList.contains(
            finalOptions.classElementToOmit
          );

          if (element.offsetHeight > maxValue && !elementToOmit) {
            maxValue = element.offsetHeight;
          }
        });

        group.forEach((element) => {
          element.style.setProperty(finalOptions.cssVariable, `${maxValue}px`);
        });

        arrayData.push(maxValue);
      });

      setCallbacks(arrayData);
    }
  };

  // ------------------------ END FUNCTIONALITY ------------------------

  // ------------------------ INIT ------------------------

  document.fonts.ready.then(() => {
    setMaxHeightElements(nodeElementsArray);
  });

  // ------------------------ END INIT ------------------------

  // ------------------------ EVENTS ------------------------

  window.addEventListener("resize", () => {
    setMaxHeightElements(nodeElementsArray);
  });

  // ------------------------ END EVENTS ------------------------
};

window.setHeightElements = setHeightElements;

export default setHeightElements;
