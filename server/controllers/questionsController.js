const Question = require('../models/question.js');

module.exports.getQuestions = async (req, res) => {
    const questions = await Question.find({}, { answer: 0} );
    return res.status(200).json(questions)
}

module.exports.createQuestion = async (req, res) => {
    Question.create({
        name: req.body.name,
        question: req.body.question,
        option: req.body.option,
        answer: req.body.answer
    },
    function(err, question){
        if(err){console.log(err); return res.status(400);}
        console.log('succesfully added question', question);
        return res.status(200).json(question);
    })
}