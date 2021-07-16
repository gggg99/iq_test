import {Divider, Grid, CircularProgress, Button, FormControl, RadioGroup, FormControlLabel, FormLabel, Radio} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import {React, useState, useRef, useEffect} from 'react';
import axios from 'axios';
import {config} from '../config'

const useStyles = makeStyles((theme) => ({
    media_option_wrapper: {
        textAlign: "center",
        marginBottom: "30px"
    },
    media_wrapper: {
        textAlign: "center",
        marginBottom: "30px"
    },
    images_container:{
      width: "850px",
      paddingBottom: "10px"
    },
    images_wrapper: {
        display: "flex",
        justifyContent: "center",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center"
    },
    image_wrapper: {
        marginBottom: "90px"
    },
    radio_group: {
        flexDirection: "row",
        paddingTop: "40px",
        paddingBottom: "60px",
        justifyContent: "center"
    },
    form_control: {
        paddingTop: "20px"
    },
    button_wrapper: {
        paddingBottom: "40px",
        paddingTop: "30px",
        textAlign: "center",
        width: "100%"
    },
    wrapper: {
        [theme.breakpoints.up('sm')]: {
            width: "500px",
            margin: "auto"
        },
        textAlign: "center",
        paddingTop: "30px"
    },
    loader: {
        width: "100%",
        height: "100%",
        padding: "40%"
    }
  }));

const Questions = ({questions, setOrderResult}) => {

    const [answers, setAnswers] = useState({});
    const [isRequestOrder, setRequestOrder] = useState(false);
    const scrollRef = useRef(null);
    
    const handleChange = (event) => {
        const updatedAnswers = {...answers, [event.target.name]: event.target.value };
        setAnswers(updatedAnswers);
    };

    const scrollMessages = () => {
        if (Object.keys(answers).length == 11) {
            scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
        }
    }

    useEffect(() => {
        scrollMessages();
    }, [answers])

    const sendResults = async () => {
        if (Object.keys(answers).length == 11){
            setRequestOrder(true);
            const result = await axios.post(config.url + '/order/create', answers);
            setRequestOrder(false);
            setOrderResult(result.data);
        }
    }

    const classes = useStyles();

    return  <Grid container className={classes.wrapper}>
     {!questions && <div className={classes.loader}><CircularProgress/></div>}
     { questions && questions.map((question, key) => (
        <Grid item xs={12} key={key}>
            <div className={classes.media_option_wrapper}><img src={`${question.question}`} width="100%" className={classes.media}/></div>
            <div className={classes.media_wrapper}><img src={`${question.option}`} width="100%" className={classes.media_option}/></div>
            <FormControl component="fieldset">
                <FormLabel component="legend">Номер картинки (отсчет слева направо)</FormLabel>
                <RadioGroup aria-label="question" className={classes.radio_group} name={`${question.name}`} value={answers[question.name] ? answers[question.name] : 1} onChange={handleChange}>
                    <FormControlLabel value="1" control={<Radio />} label="1" />
                    <FormControlLabel value="2" control={<Radio />} label="2" />
                    <FormControlLabel value="3" control={<Radio />} label="3" />
                    <FormControlLabel value="4" control={<Radio />} label="4" />
                    <FormControlLabel value="5" control={<Radio />} label="5" />
                </RadioGroup>
            </FormControl>
            <Divider/>
        </Grid>
       ))
    }
        {Object.keys(answers).length == 11 && (
            <div className={classes.button_wrapper}>
                {!isRequestOrder && (
                    <Button variant="contained" color="secondary" onClick={() => sendResults()}>
                        Узнать результат
                    </Button>
                )}
                {isRequestOrder && <CircularProgress/>}
            </div>
        )}
        <div ref={scrollRef}></div>
    </Grid>
}

export default Questions;