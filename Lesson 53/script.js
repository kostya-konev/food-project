const log = function(a, b, ...rest) {
    console.log(a, b, rest);
};

log('basic', 'rest', 'operator', 'usage');

//Ответ: basic rest [ 'operator', 'usage' ]


//Параметр по умолчанию

function calcOrDouble(number, basis = 2) { //если при вызове функции второй параметр не будет указан, то он по умолчанию будет 2
    console.log(number * basis);
}

calcOrDouble(2, );

//Ответ: 4