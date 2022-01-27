import React, {useEffect, useState} from 'react';
import {Button, Grid, Container, Typography} from '@material-ui/core';
import axios from 'axios';
import Questions from './Questions';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {config} from '../config'

const Dashboard = () => {

    const [questions, setQuestions] = useState();
    const [orderResult, setOrderResult] = useState(false);
    const [email, setEmail] = useState();
    

    const useStyles = makeStyles((theme) => ({
        payment_checkout_wrapper: {
            paddingTop: "30px",
            textAlign: "center"
        },
        payment_checkout_text: {
            marginBottom: "20px",
            textAlign: "left"
        },
        email_input: {
            marginBottom: "20px"
        }
    }))

    useEffect(() => {
        const getQuestions = async () => {
            const questions = await axios.get(config.url + '/questions');
            if (questions) setQuestions(questions.data);
        }
        getQuestions();
    },[])

    const paymentHandler = (e) => {
        let regEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!email || !regEmail.test(email)){
            setEmail(false);
            e.preventDefault();   
        }
    }   

    const classes = useStyles();

    return (
        <Container maxWidth="md">
            <Grid container>
                <Grid item xs={12}>
                    {!orderResult && <Questions 
                        questions={questions} 
                        orderResult={orderResult} 
                        setOrderResult={setOrderResult}
                    />}
                    {orderResult && (
                        <div className={classes.payment_checkout_wrapper}>
                            <Typography component="p" className={classes.payment_checkout_text}>
                                1Тест в своем роде уникален, и составлялся нами лично, поэтому для того чтобы узнать результат, 
                                оплатите символическую сумму в 50 рублей. Результат вы сможете увидеть сразу
                                после оплаты, либо укажите электронную почту, на которую придет ответ. В случае
                                какой-то проблемы пишите на почту: shopservicestack@gmail.com
                            </Typography>
                            <TextField 
                                error={email == false ? true : false} 
                                id="standard-read-only-input" 
                                label={email == false ? 'Неверный формат e-mail либо поле пусто' : 'E-mail'} 
                                helperText={email == false ? 'Без ввода почты, в случае ошибки мы не узнаем куда вам отправить результат' : 'На эту почту придет письмо с результатами ответов'} 
                                defaultValue="" 
                                onChange={(e) => setEmail(e.target.value)}
                                className={classes.email_input}
                                value={email ? email: ''}
                                type="email"
                            />
                            <form method="POST" action="https://merchant.webmoney.ru/lmi/payment.asp?at=authtype_16" onSubmit={paymentHandler}>  
                                <input type="hidden" name="LMI_PAYMENT_AMOUNT" value={orderResult.LMI_PAYMENT_AMOUNT}/>
                                <input type="hidden" name="LMI_PAYMENT_DESC" value={orderResult.LMI_PAYMENT_DESC}/>
                                <input type="hidden" name="ORDER_ID" value={orderResult.ORDER_ID}/>
                                <input type="hidden" name="EMAIL" value={email}/>
                                <input type="hidden" name="LMI_PAYEE_PURSE" value={orderResult.LMI_PAYEE_PURSE}/>
                                <input type="hidden" name="LMI_SIM_MODE" value={orderResult.LMI_SIM_MODE}/>
                                <Button variant="contained" color="secondary" type="submit">
                                    Узнать результат
                                </Button>
                            </form>
                        </div>
                    )}
                </Grid>
            </Grid>
        </Container>
    )
}

export default Dashboard;