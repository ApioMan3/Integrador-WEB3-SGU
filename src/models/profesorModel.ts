import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from "typeorm";
import { Curso } from "./cursoModel";

@Entity('profesores')
export class Profesor {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    dni: string;

    @Column()
    nombre: string;

    @Column()
    apellido: string;

    @Column({ unique: true })
    email: string;

    @Column()
    profesion: string;

    @Column()
    telefono: string;

    @CreateDateColumn({ name: 'createAt' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updateAt' })
    updatedAt: Date;

    @OneToMany(() => Curso, (curso) => curso.profesor)
    cursos: Curso[];
}
