import express, {Request,Response} from "express";
import cors from 'cors';
import morgan from "morgan";
import estudianteRouter from './routes/estudiantesRoutes';
import profesorRouter from './routes/profesoresRoutes';
import inscripcionRouter from './routes/inscripcionRoutes';
import cursoRouter from './routes/cursosRoutes';
import bodyParser from 'body-parser';
import path from 'path';

const app=express();
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(cors());
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'public', 'views'));
app.use(express.static(path.join(__dirname, 'public')));




app.get('/',(req:Request,res:Response)=>{
    console.log(__dirname);
    return res.render('index', {
        pagina: 'App Univerdsidad',
    });
});


app.use('/estudiantes',estudianteRouter);
app.use('/profesores',profesorRouter);
app.use('/cursos',cursoRouter);
app.use('/inscripciones',inscripcionRouter);



export default app;