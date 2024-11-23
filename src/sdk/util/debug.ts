declare global {
  interface Window {
    ___debug: any;
  }
}

export const runDebug = (debug = false) => {
  //////////DEBUG///////////////
  // Extend the Window interface to include thingDebug

  window.___debug = {
    log: (message: string, type: string) => {
      if (debug) {
        const baseStyle =
          'color: white; padding: 4px; border-radius: 2px; font-size: 16px;';

        if (type === 'error') {
          console.group(
            '%cDebug: Error ➡️➡️➡️➡️🔥',
            `background: #930000; ${baseStyle}`
          );
          console.log('%c' + message, `background: #930000; ${baseStyle}`);
          console.groupEnd();
        } else if (type === 'warn') {
          console.group(
            '%cDebug: Warning ➡️➡️➡️➡️⚠️',
            `background: #915e00; ${baseStyle}`
          );
          console.log('%c' + message, `background: #915e00; ${baseStyle}`);
          console.groupEnd();
        } else if (type === 'success') {
          console.group(
            '%cDebug: Success ➡️➡️➡️➡️🎉',
            `background: #009100; ${baseStyle}`
          );
          console.log('%c' + message, `background: #009100; ${baseStyle}`);
        } else {
          console.group(
            '%cDebug: Info ➡️➡️➡️➡️👍',
            `background: dodgerblue; ${baseStyle}`
          );
          console.log('%c' + message, `background: dodgerblue; ${baseStyle}`);
          console.groupEnd();
        }
      }
    },
  };

  //////////DEBUG///////////////
};
