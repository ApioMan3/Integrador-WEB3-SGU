"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const cursosController_1 = require("../controllers/cursosController");
// Ruta para consultar todos los cursos
router.get('/', cursosController_1.consultar);
// Ruta para insertar un nuevo curso
router.post('/', cursosController_1.insertar);
// Rutas para manejar un curso específico por ID
router.route('/:id')
    .delete(cursosController_1.borrar) // Eliminar un curso
    .put(cursosController_1.modificar) // Modificar un curso
    .get(cursosController_1.consultarUno); // Consultar un curso específico
exports.default = router;
