import { CursoEstudiante } from "../models/inscripcionModel";
import { Curso } from "../models/cursoModel";
import { Profesor } from "../models/profesorModel";
import { Estudiante } from "../models/estudianteModel";
import { AppDataSource } from "../db/conexion";
import { Request,Response } from "express";



 
export const consultarInscripciones = async (req: Request, res: Response): Promise<void> => {
  try {
    const inscripcionesRepository = AppDataSource.getRepository(CursoEstudiante);
    const inscripciones = await inscripcionesRepository.find({ relations: ['estudiante',"curso"]});
    res.render('listarInscripciones', {
      pagina: 'Lista de Inscripciones',
      inscripciones
    });
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).send(err.message);
    } else {
      res.status(500).send('Error desconocido');
    }
  }
};

export const listarInscripcionesPorEstudiante = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const estudianteRepository = AppDataSource.getRepository(Estudiante);
    const inscripcionRepository = AppDataSource.getRepository(CursoEstudiante);

    const estudiante = await estudianteRepository.findOne({ where: { id: parseInt(id) } });
    if (!estudiante) {
      res.status(404).json({ mensaje: "Estudiante no encontrado" });
      return;
    }

    const inscripciones = await inscripcionRepository.find({
      where: { estudiante: { id: parseInt(id) } },
      relations: ["curso"],
    });

    res.render("listarInscripcionesPorEstudiante", {
      pagina: `Inscripciones de ${estudiante.nombre} ${estudiante.apellido}`,
      inscripciones,
      estudiante,
    });
  } catch (err) {
    console.error("Error al listar inscripciones por estudiante:", err);
    res.status(500).send("Error al listar inscripciones");
  }
};

export const listarInscripcionesPorCurso = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const cursoRepository = AppDataSource.getRepository(Curso);
    const inscripcionRepository = AppDataSource.getRepository(CursoEstudiante);

    const curso = await cursoRepository.findOne({ where: { id: parseInt(id) } });
    if (!curso) {
      res.status(404).json({ mensaje: "Curso no encontrado" });
      return;
    }

    const inscripciones = await inscripcionRepository.find({
      where: { curso: { id: parseInt(id) } },
      relations: ["estudiante"],
    });

    res.render("listarInscripcionesPorCurso", {
      pagina: `Inscripciones en el curso ${curso.nombre}`,
      inscripciones,
      curso,
    });
  } catch (err) {
    console.error("Error al listar inscripciones por curso:", err);
    res.status(500).send("Error al listar inscripciones");
  }
};

 

    export const inscribir = async (req: Request, res: Response): Promise<void> => {
      const { estudiante_id, curso_id, fecha } = req.body;
  
      try {
          const estudiante = await AppDataSource.getRepository(Estudiante).findOne({ where: { id: estudiante_id } });
          const curso = await AppDataSource.getRepository(Curso).findOne({ where: { id: curso_id } });
  
          if (!estudiante || !curso) {
              res.status(400).json({ mensaje: 'Estudiante o curso no encontrado.' });
              return;
          }
  
          const inscripcion = new CursoEstudiante();
          inscripcion.estudiante = estudiante;
          inscripcion.curso = curso;
          inscripcion.fecha = fecha;
  
          await AppDataSource.getRepository(CursoEstudiante).save(inscripcion);
          res.redirect('/inscripciones/listarInscripciones');
      } catch (err) {
          console.error('Error al inscribir al estudiante:', err);
          res.status(500).send('Error al inscribir al estudiante');
      }
  };

     


      export const cancelarInscripcion = async (req: Request, res: Response): Promise<void> => {
        const { curso_id, estudiante_id } = req.params;
      
        try {
          const inscripcionRepository = AppDataSource.getRepository(CursoEstudiante);
      
          const inscripcion = await inscripcionRepository.findOne({
            where: {
              curso: { id: parseInt(curso_id) },
              estudiante: { id: parseInt(estudiante_id) }
            },
            relations: ['curso', 'estudiante']
          });
      
          if (!inscripcion) {
            res.status(404).json({ mensaje: 'Inscripción no encontrada.' });
            return;
          }

          await inscripcionRepository.remove(inscripcion);
          res.json({ mensaje: 'Inscripción eliminada' });
        } catch (error) {
          console.error('Error al eliminar la inscripción:', error);
          res.status(500).json({ mensaje: 'Error al eliminar la inscripción' });
        }
      };


    export const calificar= async (req:Request,res:Response) =>{
      try {
        const { nombre, descripcion, profesor_id } = req.body;
  
        const cursoRepository = AppDataSource.getRepository(Curso);
        const profesorRepository = AppDataSource.getRepository(Profesor);
  
        const curso = await cursoRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!curso) {
            return res.status(404).send('Curso no encontrado');
        }
  
        const profesor = await profesorRepository.findOneBy({ id: parseInt(profesor_id) });
        if (!profesor) {
            return res.status(404).send('Profesor no encontrado');
        }
  
        curso.nombre = nombre;
        curso.descripcion = descripcion;
        curso.profesor = profesor;

        await cursoRepository.save(curso);

        res.redirect('/cursos/listarCursos');
    } catch (error) {
        console.error('Error al actualizar el curso:', error);
        res.status(500).send('Error al actualizar el curso');
    }
        }

        export const modificarInscripcion = async (req: Request, res: Response): Promise<void> => {
          const { curso_id, estudiante_id } = req.params;
      
          try {
              const inscripcionRepository = AppDataSource.getRepository(CursoEstudiante);

              const inscripcion = await inscripcionRepository.findOne({
                  where: {
                      curso: { id: parseInt(curso_id) },
                      estudiante: { id: parseInt(estudiante_id) }
                  },
                  relations: ['curso', 'estudiante']
              });
      
              if (!inscripcion) {
                  res.status(404).json({ mensaje: 'Inscripción no encontrada.' });
                  return;
              }

              res.render('modificarInscripcion', {
                  pagina: 'Modificar Inscripción',
                  inscripcion
              });
          } catch (error) {
              console.error('Error al obtener la inscripción:', error);
              res.status(500).send('Error al obtener la inscripción.');
          }
      };
      
      export const actualizarInscripcion = async (req: Request, res: Response): Promise<void> => {
          const { curso_id, estudiante_id } = req.params;
          const { nota, fecha } = req.body;
      
          try {
              const inscripcionRepository = AppDataSource.getRepository(CursoEstudiante);
              const inscripcion = await inscripcionRepository.findOne({
                  where: {
                      curso: { id: parseInt(curso_id) },
                      estudiante: { id: parseInt(estudiante_id) }
                  },
                  relations: ['curso', 'estudiante']
              });
      
              if (!inscripcion) {
                  res.status(404).json({ mensaje: 'Inscripción no encontrada.' });
                  return;
              }
      
              inscripcion.nota = nota || inscripcion.nota;
              inscripcion.fecha = fecha || inscripcion.fecha;
      
              await inscripcionRepository.save(inscripcion);
      
              res.redirect('/inscripciones/listarInscripciones');
          } catch (error) {
              console.error('Error al actualizar la inscripción:', error);
              res.status(500).send('Error al actualizar la inscripción.');
          }
      };