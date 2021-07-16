module.exports.calculateResult  = (results, questions) => {
    let incrementResult = 0;
    for (const name in results){
        for(const question of questions){
            if (question["name"] == name && (question["answer"] == results[name])) 
                incrementResult = incrementResult + 1;            
        }
    }

    return incrementResult
}

module.exports.generateResultMessage = (questions, incrementResult) => {
    let resultMessage = '';

    if (incrementResult >= 0 && incrementResult < 5) {
        resultMessage = `Вы ответили на ${incrementResult} вопросов из ${questions.length}. Ваш уровень ниже среднего, попытайтесь еще раз.`;
    }else if (incrementResult >= 5 && incrementResult < 7){
        resultMessage = `Вы ответили на ${incrementResult} вопросов из ${questions.length}. Ваш уровень мог бы быть лучше, попробуйте еще раз `;
    }else if (incrementResult == 8){
        resultMessage = `Вы ответили на ${incrementResult} вопросов из ${questions.length}. Ваш уровень вполне не плох, попробуйте еще раз `;
    }else if (incrementResult == 9){
        resultMessage = `Вы ответили на ${incrementResult} вопросов из ${questions.length}. Отличный уровень, так держать, попробуйте еще раз, чтобы ответить на все вопросы `;
    }else if (incrementResult == 10){
        resultMessage = `Вы ответили на ${incrementResult} вопросов из ${questions.length}. Ваш уровень просто космос! Отлично! `;
    }

    return resultMessage;
}
