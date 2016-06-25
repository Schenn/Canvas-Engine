export function exists(val){
  return typeof (val) !== "undefined" && val !== null;
}

export function orDefault(potential, def){
  return exists(potential) ? potential : def;
}

export function isFunction(arg){
  return exists(arg) && $.isFunction(arg);
}

export function isArray(arg){
  return (!!arg) && (arg.constructor === Array);
}

export function cleanArray(cleanMe){
  let cleaner = [];
  if(isArray(cleanMe)) {
    for (var i = 0; i < cleanMe.length; i++) {
      if (exists(cleanMe[i])) {
        cleaner.push(cleanMe[i]);
      }
    }
    return cleaner;
  } else {
    console.log(cleanMe + " - is not an array");
    return cleanMe;
  }
}

export function randName() {
  let length = 8 + Math.floor(7 * (Math.random() % 1));
  let val = "ce_";
  for (let i = 1; i <= length; i++) {
    let slots = 1 + Math.floor(4 * (Math.random() % 1));
    switch (slots) {
      case 1:
        val += 48 + Math.floor(10 * (Math.random() % 1));
        break;
      case 2:
        val += String.fromCharCode(65 + Math.floor(26 * (Math.random() % 1)));
        break;
      case 3:
        val += String.fromCharCode(97 + Math.floor(26 * (Math.random() % 1)));
        break;
    }
  }
  return (val);
}

export function parseJsonArray(screenMap){
  if (typeof(screenMap) === "string") {
    screenMap = $.parseJSON(screenMap);
  }
  if(isArray(screenMap)){
    for (var i = 0; i < screenMap.length; i++) {
      if ($.parseJSON(screenMap[i]) !== null) {
        screenMap[i] = $.parseJSON(screenMap[i]);
      }
    }
  }

  return (screenMap);
}