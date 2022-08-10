/* eslint-disable promise/catch-or-return, no-empty-function, no-unused-vars */

const setHeightElements = (nodeElementsArray, newOptions = {}) => {
  // ------------------------ VARAIBLES ------------------------

  let firstExecution = false;
  const finalOptions = {
    cssVariable: '--max-value',
    gridOptions: null,
    initialIndex: 0,
    classElementToOmit: '',
    init: (data) => {},
    afterResize: (data) => {},
    ...newOptions,
  };

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

  const setMaxHeightElements = () => {
    let maxValue = 0;

    if (finalOptions.gridOptions == null) {
      maxValue = 0;
      const elements = [...nodeElementsArray].filter((element, index) => {
        if (finalOptions.initialIndex > 0) {
          if (index >= finalOptions.initialIndex) {
            return element;
          }
        } else {
          return element;
        }

        return false;
      });

      elements.forEach((element, index) => {
        element.style.setProperty(finalOptions.cssVariable, `unset`);
      });

      elements.forEach((element, index) => {
        const elementToOmit = element.classList.contains(
          finalOptions.classElementToOmit,
        );

        if (element.offsetHeight > maxValue && !elementToOmit) {
          maxValue = element.offsetHeight;
        }
      });

      elements.forEach((element, index) => {
        element.style.setProperty(finalOptions.cssVariable, `${maxValue}px`);
      });

      setCallbacks(maxValue);
    } else {
      const groupsElements = [];
      const arrayData = [];
      let columns = finalOptions.gridOptions.defaultColumns;
      const arrayElements = [...nodeElementsArray].filter((element, index) => {
        if (finalOptions.initialIndex > 0) {
          if (index >= finalOptions.initialIndex) {
            return element;
          }
        } else {
          return element;
        }

        return false;
      });

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

        group.forEach((element, index) => {
          element.style.setProperty(finalOptions.cssVariable, `unset`);
        });

        group.forEach((element, index) => {
          const elementToOmit = element.classList.contains(
            finalOptions.classElementToOmit,
          );

          if (element.offsetHeight > maxValue && !elementToOmit) {
            maxValue = element.offsetHeight;
          }
        });

        group.forEach((element, index) => {
          element.style.setProperty(finalOptions.cssVariable, `${maxValue}px`);
        });

        arrayData.push(maxValue);
      });

      setCallbacks(arrayData);
    }
  };

  // ------------------------ END FUNCTIONALITY ------------------------

  // ------------------------ INIT ------------------------

  document.fonts.ready.then(setMaxHeightElements);

  // ------------------------ END INIT ------------------------

  // ------------------------ EVENTS ------------------------

  window.removeEventListener('resize', setMaxHeightElements);
  window.addEventListener('resize', setMaxHeightElements);

  // ------------------------ END EVENTS ------------------------
};

window.setHeightElements = setHeightElements;

export default setHeightElements;
