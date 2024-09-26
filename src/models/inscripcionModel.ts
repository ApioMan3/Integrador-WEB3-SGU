import { Entity, ManyToOne, JoinColumn, Column, PrimaryColumn } from 'typeorm';
import { Estudiante } from './estudianteModel';
import { Curso } from './cursoModel';

@Entity('cursos_estudiantes')
export class CursoEstudiante {
    @PrimaryColumn()
    estudiante_id: number;

    @PrimaryColumn()
    curso_id: number;

    @Column({ type: 'float' })
    nota: number;

    @Column({ type: 'date' })
    fecha: Date;

    @ManyToOne(() => Estudiante, (estudiante) => estudiante.cursos)
    @JoinColumn({ name: 'estudiante_id' })
    estudiante: Estudiante;

    @ManyToOne(() => Curso, (curso) => curso.estudiantes)
    @JoinColumn({ name: 'curso_id' })
    curso: Curso;
}
