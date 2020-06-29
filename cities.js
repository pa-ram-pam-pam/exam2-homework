/**
 * Для выполнения задания нужно установить Node JS (делается быстро и просто)
 *
 *
 * Дан список городов. Код для их получения в переменную написан. Вам нужно написать программу, которая будет выполняться следующим образом:
 * node ./cities.js "all where %number%>5" - выведет все города из списка с полем number у объектов городов которые соответствуют условию (вместо number могут быть region и city)
 *
 * первое слово указывает максимальное количиство или позицию (Для first и second выводится одна запись) - all - все, first - первый, last - последний, цифра - количество, например
 * node ./cities.js "3 where %number%>5" - выведет в консоль 3 записи
 * node ./cities.js "first where %number%>5" - выведет в консоль первую запись
 *
 * если слова where нет, например:
 * node ./cities.js "all"
 * то вывод работает без фильтрации, в примере выше выведутся в консоль все города.
 * Для удобства разбора (парсинга) строки с запросом рекомендую использовать regex
 * если задан неверный запрос (в примере ниже пропущено слово where но присутствует условие) выводится ошибка: wrong query
 * node ./cities.js "all %number%>5"
 *
 * Операции для запроса могут быть: больше (>), меньше (<), совпадает (=)
 *
 * ОТВЕТ ВЫВОДИТЬ В КОНСОЛЬ И ПИСАТЬ В ФАЙЛ OUTPUT.JSON (каждый раз перезаписывая)
 */

//Путь к файлу с городами
const LIST_OF_CITIES = "./cities.json";
const OUTPUT_FILE = "./output.json";

// Пакет node для чтения из файла
const fs = require("fs");

// тут мы получаем "запрос" из командной строки
const query = process.argv[2];

let cities = {};

// Чтение городов в переменную, запись в переменную производится в Callback-функции
fs.readFile(LIST_OF_CITIES, "utf8", (err, data) => {
  if (!err) {
    cities = data;
    cities = JSON.parse(cities);
    let requestObj = checkQuery(query); //проверяем запрос
    processRequest(cities, requestObj); // выполняем запрос
  } else console.log("Видимо что-то произошло с файлом");
});

////////////// Далее идут функции, выполняющие логику.

function checkQuery(str) {
  const FIRST_WORDS = ["all", "first", "last"];
  if (str === "" || str === undefined) {
    return { error: true };
  }
  // str = str.trim(); //убираем лишние пробелы
  let requestObj = {};

  let queryArray = str.split(" "); //разбиваем по пробелам

  // if (queryArray.length > 3) {
  //   //слишком много слов
  //   return { error: true };
  // }

  switch (queryArray.length) {
    case 1:
      if (FIRST_WORDS.includes(queryArray[0])) return { how: queryArray[0] };
      if (Number.isInteger(+queryArray[0])) {
        return { how: +queryArray[0] };
      } else {
        return { error: true };
      }
      break;
    // case 2:
    //   return { error: true };
    //   break;
    default:
      if (FIRST_WORDS.includes(queryArray[0]) && queryArray[1] === "where") {
        let indexWhere = str.indexOf("where");
        let queryAfterWhere = str.slice(indexWhere + 6, str.length); //6 - длина where+1
        // console.log(queryAfterWhere, "ssss");
        requestObj = checkCondition(queryAfterWhere);
        if (requestObj.error !== true) {
          requestObj.how = queryArray[0];
          return requestObj;
        } else return { error: true };
      }
      if (Number.isInteger(+queryArray[0]) && queryArray[1] === "where") {
        let indexWhere = str.indexOf("where");
        let queryAfterWhere = str.slice(indexWhere + 6, str.length); //6 - длина where+1
        // console.log(queryAfterWhere, "ssss");
        requestObj = checkCondition(queryAfterWhere);
        if (requestObj.error !== true) {
          requestObj.how = +queryArray[0];
          return requestObj;
        } else return { error: true };
        break;
      } else return { error: true };
    // default:
    //   return { error: true };
  }

  function checkCondition(str) {
    const CORRECT_WORDS = ["%number%", "%region%", "%city%"];
    const indexCompare = str.search(/[<, >, =]/);

    const leftSide = str.slice(0, indexCompare);
    const rightSide = str.slice(indexCompare + 1);
    const leftSide_p = leftSide.replace(/[%]/g, "");

    // console.log(leftSide_p);

    if (indexCompare === -1) return { error: true };

    switch (leftSide) {
      case "number":
        if (!isNaN(rightSide) && Number.isInteger(+rightSide)) {
          return {
            what: leftSide,
            compare: str.slice(indexCompare, indexCompare + 1),
            value: +rightSide,
          };
        } else {
          return { error: true };
        }
        break;
      default:
        if (CORRECT_WORDS.includes(leftSide) && rightSide !== "") {
          return {
            what: leftSide_p,
            compare: str.slice(indexCompare, indexCompare + 1),
            value: rightSide,
          };
        } else {
          return { error: true };
        }
    }
  }
}

function processRequest(cities, requestObj) {
  // console.log(requestObj, "dddd");

  if (requestObj.error === true) {
    console.log("Wrong request!");
    return;
  }
  let filteredArr = [];

  if (requestObj.compare === undefined) {
    filteredArr = cities;
  } else {
    switch (requestObj.compare) {
      case ">":
        filteredArr = cities.filter(
          (item) => item[requestObj.what] > requestObj.value
        );
        break;
      case "<":
        filteredArr = cities.filter(
          (item) => item[requestObj.what] < requestObj.value
        );
        break;
      case "=":
        filteredArr = cities.filter(
          (item) => item[requestObj.what] === requestObj.value
        );
        break;
    }
  }

  if (filteredArr.length < requestObj.how) requestObj.how = filteredArr.length; //чтобы не делать лишнюю работу на случай, когда число строк пользователя больше, чем есть у нас
  if (requestObj.how === "all") {
    for (let i of filteredArr) {
      console.log(i);
    }
  }

  if (requestObj.how === "first") {
    console.log(filteredArr[0]);
    filteredArr = filteredArr[0];
  }

  if (requestObj.how === "last") {
    console.log(filteredArr[filteredArr.length - 1]);
    filteredArr = filteredArr[filteredArr.length - 1];
  }
  if (requestObj.how > 0) {
    for (let i = 0; i < requestObj.how; i++) {
      console.log(filteredArr[i]);
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(filteredArr));
}
