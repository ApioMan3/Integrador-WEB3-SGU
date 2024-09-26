"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const estudiantesRoutes_1 = __importDefault(require("./routes/estudiantesRoutes"));
const profesoresRoutes_1 = __importDefault(require("./routes/profesoresRoutes"));
const inscripcionRoutes_1 = __importDefault(require("./routes/inscripcionRoutes"));
const cursosRoutes_1 = __importDefault(require("./routes/cursosRoutes"));
const body_parser_1 = __importDefault(require("body-parser"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const methodOverride = require('method-override');
app.use(methodOverride('_method'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
app.use((0, cors_1.default)());
app.set('view engine', 'pug');
app.set('views', path_1.default.join(__dirname, 'public', 'views'));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.get('/', (req, res) => {
    console.log(__dirname);
    return res.render('index', {
        pagina: 'App Univerdsidad',
    });
});
app.use('/estudiantes', estudiantesRoutes_1.default);
app.use('/profesores', profesoresRoutes_1.default);
app.use('/cursos', cursosRoutes_1.default);
app.use('/inscripciones', inscripcionRoutes_1.default);
exports.default = app;
